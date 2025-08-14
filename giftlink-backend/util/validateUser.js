const { body } = require('express-validator');

const validateUser = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('Fist name must contain only letters'),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Fist name must contain only letters'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

module.exports = validateUser;

