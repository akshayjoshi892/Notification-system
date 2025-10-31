import Notification, { INotification } from '../models/Notification';
import { redisService } from './redisService';

export class NotificationService {
  private readonly NOTIFICATION_CHANNEL = 'notifications';

  constructor() {
    this.setupRedisSubscriber();
  }

  private async setupRedisSubscriber(): Promise<void> {
    await redisService.subscribe(this.NOTIFICATION_CHANNEL, this.handleRedisNotification.bind(this));
  }

  private async handleRedisNotification(message: string): Promise<void> {
    try {
      const notificationData = JSON.parse(message);
      console.log('Received notification via Redis Pub/Sub:', notificationData);
      
      // Here you can add WebSocket integration or other real-time delivery mechanisms
      // For now, we'll just log it
    } catch (error) {
      console.error('Error processing Redis notification:', error);
    }
  }

  async createNotification(notificationData: {
    title: string;
    message: string;
    userId: string;
    type?: string;
  }): Promise<INotification> {
    try {
      // Save to MongoDB
      const notification = new Notification(notificationData);
      const savedNotification = await notification.save();

      // Publish to Redis for real-time delivery
      await redisService.publish(this.NOTIFICATION_CHANNEL, {
        event: 'new_notification',
        data: savedNotification.toJSON(),
        timestamp: new Date()
      });

      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20): Promise<{
    notifications: INotification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        Notification.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Notification.countDocuments({ userId })
      ]);

      return {
        notifications,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );

      if (notification) {
        // Publish read event
        await redisService.publish(this.NOTIFICATION_CHANNEL, {
          event: 'notification_read',
          data: notification.toJSON(),
          timestamp: new Date()
        });
      }

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await Notification.countDocuments({ userId, isRead: false });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}

// Create and export the instance
const notificationService = new NotificationService();
export { notificationService };