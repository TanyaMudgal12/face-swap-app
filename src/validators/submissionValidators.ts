import { body } from 'express-validator';

export const submissionValidationRules = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 4, max: 30 })
      .withMessage('Name must be 4-30 characters long')
      .matches(/^[A-Za-z\s]+$/)
      .withMessage('Name must contain alphabets only'),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('phone')
      .matches(/^\d{10}$/)
      .withMessage('Phone must be exactly 10 numeric digits'),
    body('terms')
      .equals('on')
      .withMessage('Terms & Conditions must be accepted'),
  ],
};

export default submissionValidationRules;

