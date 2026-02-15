const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: true,
    unique: true,
    index: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true,
    index: true
  },
  sentimentScore: {
    type: Number,
    required: true,
    min: -1,
    max: 1
  },
  keywords: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
    index: true
  },
  summary: {
    type: String
  },
  duplicateGroup: {
    type: Number,
    default: null
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
analysisResultSchema.index({ sentiment: 1, priority: 1 });

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);