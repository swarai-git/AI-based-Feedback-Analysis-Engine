const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Get pending verifications
router.get('/pending-verifications', adminController.getPendingVerifications);

// Approve verification
router.post('/verify/:verificationId/approve', adminController.approveVerification);

// Reject verification
router.post('/verify/:verificationId/reject', adminController.rejectVerification);

module.exports = router;