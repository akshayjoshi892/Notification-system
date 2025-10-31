import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message,
        details: error.details
      });
      return;
    }
    
    next();
  };
};

// Validation schemas
export const createNotificationSchema = Joi.object({
  title: Joi.string().required().min(1).max(255).trim(),
  message: Joi.string().required().min(1).max(1000).trim(),
  userId: Joi.string().required().min(1).max(100).trim(),
  type: Joi.string().valid('info', 'warning', 'error', 'success').default('info')
});

export const markAsReadSchema = Joi.object({
  notificationId: Joi.string().required().hex().length(24)
});

export const getNotificationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});