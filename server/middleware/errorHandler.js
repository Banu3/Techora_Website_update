export const errorHandler = (err, req, res, next) => {
  console.error('[Server Error Trace]:', err.stack || err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An internal enterprise server error occurred. Please try again later.'
      : err.message || 'Internal Server Error'
  });
};
