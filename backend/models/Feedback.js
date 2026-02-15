const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  legislationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Legislation',
    required: true,
    index: true
  },
  submitterName: {
    type: String,
    required: true,
    trim: true
  },
  submitterEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  commentText: {
    type: String,
    required: true
  },
  provision: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  source: {
    type: String,
    enum: ['portal', 'csv', 'api'],
    default: 'portal'
  }
});

// Compound index for efficient querying
feedbackSchema.index({ legislationId: 1, submittedAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);