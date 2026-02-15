const express = require('express');
const router = express.Router();
const AnalysisResult = require('../models/AnalysisResult');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

router.get('/summary', async (req, res) => {
  try {
    const analyses = await AnalysisResult.countDocuments();
    const feedback = await Feedback.countDocuments();
    const users = await User.countDocuments();
    res.json({ analyses, feedback, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analyses', async (req, res) => {
  const data = await AnalysisResult.find({}).lean();
  res.json(data);
});

router.get('/feedback', async (req, res) => {
  const data = await Feedback.find({}).lean();
  res.json(data);
});

module.exports = router;