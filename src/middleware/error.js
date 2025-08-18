class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message, success: false, status: err.status || 500 });
};

module.exports = { errorHandler, AppError };