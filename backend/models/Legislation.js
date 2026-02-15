const mongoose = require('mongoose');

const legislationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  draftUrl: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'under_review'],
    default: 'open'
  },
  deadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Legislation', legislationSchema);