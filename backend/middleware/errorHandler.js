const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const error = {
    message: err.message || 'Internal server error',
    status: err.status || 500
  };

  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.detail = err.detail;
  }

  if (err.name === 'SequelizeValidationError') {
    error.status = 400;
    error.type = 'ValidationError';
    error.details = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  res.status(error.status).json({ error });
};

module.exports = errorHandler;