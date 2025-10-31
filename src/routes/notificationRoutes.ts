import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
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
  notificationController.createNotification
);

// Get user notifications
router.get(
  '/user/:userId',
  validateRequest(getNotificationsSchema),
  notificationController.getUserNotifications
);

// Mark notification as read
router.patch(
  '/:notificationId/read',
  validateRequest(markAsReadSchema),
  notificationController.markAsRead
);

// Get unread count
router.get(
  '/user/:userId/unread-count',
  notificationController.getUnreadCount
);

export default router;