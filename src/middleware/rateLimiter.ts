import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      message,
      retryAfter: `${windowMs / 1000} seconds`
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Specific rate limiters for different endpoints
export const generalRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // Limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

export const notificationCreationLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // Limit each IP to 10 notification creations per minute
  'Too many notifications created, please try again later.'
);

export const strictRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // Limit each IP to 5 requests per windowMs for sensitive operations
  'Too many attempts, please try again later.'
);