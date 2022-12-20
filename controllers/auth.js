const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const ApiError = require('../exceptions/api-error');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(ApiError.UnprocessableEntity('Validation failed.', errors.array()));
  }

  const { email, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    res.status(201).json({
      message: 'User created',
      userId: user._id
    });
  } catch (err) {
    next(err);
  }
};