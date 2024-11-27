class ApplicationError extends Error {
    constructor(message, status = 500, data = {}) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
      this.data = data;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends ApplicationError {
    constructor(message, data) {
      super(message, 400, data);
    }
  }
  
  class AuthenticationError extends ApplicationError {
    constructor(message = 'Authentication failed') {
      super(message, 401);
    }
  }
  
  class AuthorizationError extends ApplicationError {
    constructor(message = 'Insufficient permissions') {
      super(message, 403);
    }
  }
  
  class NotFoundError extends ApplicationError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  }
  
  module.exports = {
    ApplicationError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError
  };