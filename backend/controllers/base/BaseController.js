class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Standard error handler
  handleError(error, res) {
    console.error(`Error: ${error.message}`, {
      stack: error.stack,
      code: error.code,
    });

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Resource already exists",
        details: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }

  // Standard response formatter
  formatResponse(data, message = "Success") {
    return {
      success: true,
      message,
      data,
    };
  }
}

module.exports = BaseController;