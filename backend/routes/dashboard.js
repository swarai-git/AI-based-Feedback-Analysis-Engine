const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Protect all routes - require authentication
router.use(protect);

// @route   GET /api/dashboard/stats/:legislationId
// @desc    Get overall dashboard statistics
// @access  Admin, Analyst, Viewer
router.get(
  '/stats/:legislationId',
  dashboardController.getDashboardStats
);

// @route   GET /api/dashboard/sentiment-trend/:legislationId
// @desc    Get sentiment distribution over time
// @access  Admin, Analyst, Viewer
router.get(
  '/sentiment-trend/:legislationId',
  dashboardController.getSentimentTrend
);

// @route   GET /api/dashboard/keywords/:legislationId
// @desc    Get top keywords across all feedbacks
// @access  Admin, Analyst, Viewer
router.get(
  '/keywords/:legislationId',
  dashboardController.getTopKeywords
);

// @route   GET /api/dashboard/filtered/:legislationId
// @desc    Get feedback analysis with filters
// @access  Admin, Analyst, Viewer
router.get(
  '/filtered/:legislationId',
  dashboardController.getFilteredAnalysis
);

// @route   GET /api/dashboard/categories/:legislationId
// @desc    Get category distribution
// @access  Admin, Analyst, Viewer
router.get(
  '/categories/:legislationId',
  dashboardController.getCategoryDistribution
);

// @route   GET /api/dashboard/high-priority/:legislationId
// @desc    Get high priority feedbacks
// @access  Admin, Analyst, Viewer
router.get(
  '/high-priority/:legislationId',
  dashboardController.getHighPriorityFeedbacks
);

// @route   GET /api/dashboard/export/:legislationId
// @desc    Export data for Power BI
// @access  Admin, Analyst
router.get(
  '/export/:legislationId',
  dashboardController.exportForPowerBI
);

module.exports = router;