/*const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes - require authentication
router.use(protect);

// @route   POST /api/analysis/analyze/:feedbackId
// @desc    Analyze a single feedback
// @access  Admin, Analyst
router.post(
  '/analyze/:feedbackId',
  authorize('admin', 'analyst'),
  analysisController.analyzeFeedback
);

// @route   GET /api/analysis/:feedbackId
// @desc    Get analysis for a specific feedback
// @access  Admin, Analyst, Viewer
router.get(
  '/:feedbackId',
  analysisController.getAnalysis
);

// @route   POST /api/analysis/batch
// @desc    Batch analyze all feedbacks for a legislation
// @access  Admin, Analyst
router.post(
  '/batch',
  authorize('admin', 'analyst'),
  analysisController.batchAnalyze
);

// @route   GET /api/analysis/legislation/:legislationId
// @desc    Get all analyses for a legislation
// @access  Admin, Analyst, Viewer
router.get(
  '/legislation/:legislationId',
  analysisController.getAnalysesByLegislation
);

// @route   DELETE /api/analysis/:feedbackId
// @desc    Delete analysis (for re-analysis)
// @access  Admin
router.delete(
  '/:feedbackId',
  authorize('admin'),
  analysisController.deleteAnalysis
);

module.exports = router;*/


const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const analysisController = require('../controllers/analysisController');

// @route   GET /api/analysis/legislation/:legislationId/duplicates
// @desc    Analyze and group duplicate/similar feedbacks
// @access  Private (admin, analyst)
router.get('/legislation/:legislationId/duplicates',
  protect,
  restrictTo('admin', 'analyst'),
  analysisController.analyzeDuplicates
);

// @route   GET /api/analysis/legislation/:legislationId/ai-insights
// @desc    Get AI-powered insights
// @access  Private (admin, analyst)
router.get('/legislation/:legislationId/ai-insights',
  protect,
  restrictTo('admin', 'analyst'),
  analysisController.getAIInsights
);

// @route   GET /api/analysis/legislation/:legislationId/top-suggestions
// @desc    Get most suggested changes
// @access  Private (admin, analyst)
router.get('/legislation/:legislationId/top-suggestions',
  protect,
  restrictTo('admin', 'analyst'),
  analysisController.getTopSuggestions
);

// @route   GET /api/analysis/legislation/:legislationId/search
// @desc    Search within grouped feedbacks
// @access  Private (admin, analyst)
router.get('/legislation/:legislationId/search',
  protect,
  restrictTo('admin', 'analyst'),
  analysisController.searchGroupedFeedbacks
);

// @route   POST /api/analysis/send-duplicate-alert
// @desc    Send email alert for duplicate
// @access  Private (admin)
router.post('/send-duplicate-alert',
  protect,
  restrictTo('admin'),
  analysisController.sendDuplicateAlertEmail
);

// @route   POST /api/analysis/send-daily-digest
// @desc    Send daily digest of duplicates
// @access  Private (admin)
router.post('/send-daily-digest',
  protect,
  restrictTo('admin'),
  analysisController.sendDailyDigestEmail
);

// @route   POST /api/analysis/batch
// @desc    Analyze feedbacks in batch (sentiment, topics, etc.)
// @access  Private (admin, analyst)
router.post('/batch',
  protect,
  restrictTo('admin', 'analyst'),
  analysisController.analyzeBatch
);


module.exports = router;