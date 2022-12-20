const jwt = require('jsonwebtoken');

const ApiError = require('../exceptions/api-error');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(ApiError.Unauthorized('Not authenticated.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, 'secret');

    if (!decodedToken) {
      return next(ApiError.Unauthorized('Not authenticated.'));
    }

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    next(err);
  }
};