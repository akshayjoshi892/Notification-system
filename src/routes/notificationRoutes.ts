import { Router } from 'express';
import { 
  createNotification, 
  getUserNotifications, 
  markAsRead, 
  getUnreadCount 
} from '../controllers/notificationController';
import {
  createNotificationSchema,
  markAsReadSchema,
  getNotificationsSchema,
  validateRequest
} from '../middleware/validation';
import {
  generalRateLimiter,
  notificationCreationLimiter
} from '../middleware/rateLimiter';

const router = Router();

// Apply general rate limiting to all notification routes
router.use(generalRateLimiter);

// Create notification
router.post(
  '/',
  notificationCreationLimiter,
  validateRequest(createNotificationSchema),
  createNotification
);

// Get user notifications
router.get(
  '/user/:userId',
  validateRequest(getNotificationsSchema),
  getUserNotifications
);

// Mark notification as read
router.patch(
  '/:notificationId/read',
  validateRequest(markAsReadSchema),
  markAsRead
);

// Get unread count
router.get(
  '/user/:userId/unread-count',
  getUnreadCount
);

export default router;