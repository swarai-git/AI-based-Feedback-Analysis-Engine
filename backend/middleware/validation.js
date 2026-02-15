const { body, validationResult } = require('express-validator');

exports.validateFeedback = [
  body('legislationId').notEmpty().withMessage('Legislation ID is required'),
  body('submitterName').trim().notEmpty().withMessage('Submitter name is required'),
  body('submitterEmail').isEmail().withMessage('Valid email is required'),
  body('commentText').trim().notEmpty().withMessage('Comment text is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateRegistration = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];