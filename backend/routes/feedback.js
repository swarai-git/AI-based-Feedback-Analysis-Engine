/*const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedbacks,
  getFeedbackById,
  deleteFeedback,
  getFeedbacksByLegislation
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');

// Public routes
router.post('/', validateFeedback, submitFeedback);

// Protected routes
router.get('/', protect, getAllFeedbacks);
router.get('/:id', protect, getFeedbackById);
router.get('/legislation/:legislationId', protect, getFeedbacksByLegislation);
router.delete('/:id', protect, authorize('admin'), deleteFeedback);

module.exports = router;*/
/*
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const feedbackController = require('../controllers/feedbackController');

// Only viewers and analysts can submit feedback
router.post('/', 
  protect, 
  restrictTo('viewer', 'analyst'), 
  feedbackController.submitFeedback
);

// Admins and analysts can view all feedback
router.get('/', 
  protect, 
  restrictTo('admin', 'analyst'), 
  feedbackController.getAllFeedbacks
);

// Everyone can view their own feedback
router.get('/my-feedback', 
  protect, 
  feedbackController.getMyFeedback
);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const feedbackController = require('../controllers/feedbackController');

// @route   POST /api/feedback
// @desc    Submit new feedback
// @access  Private (viewer, analyst only - NOT admin)
router.post('/', 
  protect, 
  restrictTo('viewer', 'analyst'), 
  feedbackController.submitFeedback
);

// @route   GET /api/feedback
// @desc    Get all feedbacks with filters
// @access  Private (admin, analyst only)
router.get('/', 
  protect, 
  restrictTo('admin', 'analyst'), 
  feedbackController.getAllFeedbacks
);

// @route   GET /api/feedback/legislation/:legislationId
// @desc    Get feedbacks by legislation
// @access  Private
router.get('/legislation/:legislationId', 
  protect, 
  feedbackController.getFeedbacksByLegislation
);

// @route   GET /api/feedback/:id
// @desc    Get single feedback by ID
// @access  Private
router.get('/:id', 
  protect, 
  feedbackController.getFeedbackById
);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
// @access  Private (admin only)
router.delete('/:id', 
  protect, 
  restrictTo('admin'), 
  feedbackController.deleteFeedback
);

module.exports = router;