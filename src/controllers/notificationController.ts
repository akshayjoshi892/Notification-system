import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { asyncHandler } from '../middleware/errorHandler';

export const notificationController = {
  createNotification: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { title, message, userId, type } = req.body;

    const notification = await notificationService.createNotification({
      title,
      message,
      userId,
      type
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  }),

  getUserNotifications: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const result = await notificationService.getUserNotifications(
      userId,
      parseInt(page as string) || 1,
      parseInt(limit as string) || 20
    );

    res.status(200).json({
      success: true,
      data: result
    });
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const notification = await notificationService.markAsRead(notificationId, userId);

    if (!notification) {
      res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  }),

  getUnreadCount: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const count = await notificationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  })
};