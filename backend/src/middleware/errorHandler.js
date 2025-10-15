/**
 * Global error handler middleware
 * FR-4.2.3: Does not expose stack traces in production
 */
export const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  
  const errorResponse = {
    error: {
      code: statusCode,
      message: err.message || 'Internal server error',
    },
  };
  
  // Only include stack trace in development
  if (isDevelopment && err.stack) {
    errorResponse.error.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};
