class ApiError extends Error{
  constructor(message, statusCode, data) {
    super(message);

    this.statusCode = statusCode;
    this.data = data;
  }

  static NotFound(message) {
    return new this(message, 404);
  }

  static UnprocessableEntity(message, data) {
    return new this(message, 422, data);
  }
}

module.exports = ApiError;