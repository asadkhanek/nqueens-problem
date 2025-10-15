import rateLimit from 'express-rate-limit';

// Rate limiting: 10 requests per minute per IP (FR-4.2.4)
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  message: {
    error: {
      code: 429,
      message: 'Too many requests from this IP, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 429,
        message: 'Too many requests from this IP, please try again after a minute.',
      },
    });
  },
});
