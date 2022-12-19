class ApiError extends Error{
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
  }

  static UnprocessableEntity(message) {
    return new this(message, 422);
  }
}

module.exports = ApiError;