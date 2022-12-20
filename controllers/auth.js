const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(ApiError.Unauthorized('A user with this email could not be found.'));
    }

    if (!await bcrypt.compare(password, user.password)) {
      return next(ApiError.Unauthorized('Wrong password.'));
    }

    const token = jwt.sign(
      {
        email,
        userId: user._id.toString()
      },
      'secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      userId: user._id.toString()
    });
  } catch (err) {
    next(err);
  }
};