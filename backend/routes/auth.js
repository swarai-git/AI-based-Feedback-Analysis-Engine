/*const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;*/
/*const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validation');

// Register - with file upload for verification
router.post('/register', 
  authController.uploadVerification, // Handle file upload
  validateRegistration, 
  authController.register
);

// Login
router.post('/login', authController.login);

// Get profile
router.get('/profile', protect, authController.getProfile);

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');

// Register - with file upload for verification
router.post('/register', 
  authController.uploadVerification, // Handle file upload
  validateRegistration, 
  authController.register
);

// Login
router.post('/login', authController.login);

// Get profile (protected route)
router.get('/profile', protect, authController.getProfile);

module.exports = router;

