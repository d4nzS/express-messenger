const { validationResult } = require('express-validator');

const User = require('../models/user');
const ApiError = require('../exceptions/api-error');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(ApiError.UnprocessableEntity('Validation failed.', errors.array()));
  }

  const { email, name, password } = req.body;
};