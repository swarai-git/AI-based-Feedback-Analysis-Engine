const mongoose = require('mongoose');

const pendingVerificationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  requestedRole: {
    type: String,
    enum: ['analyst', 'admin'],
    required: true
  },
  // Verification details
  organizationName: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  officialEmail: {
    type: String,
    required: true
  },
  verificationDocumentPath: {
    type: String,
    required: true
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  rejectionReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PendingVerification', pendingVerificationSchema);