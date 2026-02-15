const PendingVerification = require('../models/PendingVerification');
const User = require('../models/User');

// Get all pending verifications
exports.getPendingVerifications = async (req, res) => {
  try {
    const pending = await PendingVerification.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.status(200).json({ pending });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({ message: 'Error fetching pending verifications' });
  }
};

// Approve verification
exports.approveVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;

    const pending = await PendingVerification.findById(verificationId);
    if (!pending) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    if (pending.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    // Create the user account
    const user = await User.create({
      username: pending.username,
      email: pending.email,
      password: pending.password, // Already hashed
      role: pending.requestedRole
    });

    // Update verification status
    pending.status = 'approved';
    pending.reviewedBy = req.user._id;
    pending.reviewedAt = new Date();
    await pending.save();

    console.log(`✅ Admin ${req.user.email} approved ${user.email} as ${user.role}`);

    res.status(200).json({ 
      message: 'User approved and account created',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error approving verification:', error);
    res.status(500).json({ message: 'Error approving verification' });
  }
};

// Reject verification
exports.rejectVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { reason } = req.body;

    const pending = await PendingVerification.findById(verificationId);
    if (!pending) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    if (pending.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    // Update verification status
    pending.status = 'rejected';
    pending.reviewedBy = req.user._id;
    pending.reviewedAt = new Date();
    pending.rejectionReason = reason || 'Verification failed';
    await pending.save();

    console.log(`❌ Admin ${req.user.email} rejected ${pending.email}'s verification`);

    res.status(200).json({ 
      message: 'Verification request rejected',
      reason: pending.rejectionReason
    });
  } catch (error) {
    console.error('Error rejecting verification:', error);
    res.status(500).json({ message: 'Error rejecting verification' });
  }
};