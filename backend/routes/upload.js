const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all routes - require authentication
router.use(protect);

// @route   POST /api/upload/csv
// @desc    Upload CSV file with feedbacks
// @access  Admin, Analyst
router.post(
  '/csv',
  authorize('admin'),
  upload.single('file'),
  uploadController.uploadCSV
);

// @route   POST /api/upload/single
// @desc    Upload single feedback manually
// @access  Public (but authenticated)
router.post(
  '/single',
  uploadController.uploadSingleFeedback
);

// @route   GET /api/upload/stats/:legislationId
// @desc    Get upload history/statistics
// @access  Admin, Analyst
router.get(
  '/stats/:legislationId',
  authorize('admin'),
  uploadController.getUploadStats
);

// @route   POST /api/upload/validate
// @desc    Validate CSV format before upload
// @access  Admin, Analyst
router.post(
  '/validate',
  authorize('admin'),
  upload.single('file'),
  uploadController.validateCSV
);

// @route   GET /api/upload/template
// @desc    Download sample CSV template
// @access  Admin, Analyst, Viewer
router.get(
  '/template',
  uploadController.downloadTemplate
);

module.exports = router;