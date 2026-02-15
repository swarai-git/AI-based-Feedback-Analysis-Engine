const Feedback = require('../models/Feedback');
const Legislation = require('../models/Legislation');

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = async (req, res) => {
  try {
    const { legislationId, submitterName, submitterEmail, commentText, provision } = req.body;

    // Verify legislation exists
    const legislation = await Legislation.findById(legislationId);
    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    // Check if legislation is still open
    if (legislation.status === 'closed') {
      return res.status(400).json({ message: 'This legislation is no longer accepting feedback' });
    }

    // Create feedback
    const feedback = await Feedback.create({
      legislationId,
      submitterName,
      submitterEmail,
      commentText,
      provision,
      source: 'portal'
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedbacks with pagination and filters
// @route   GET /api/feedback
// @access  Private
exports.getAllFeedbacks = async (req, res) => {
  try {
    const { 
      legislationId, 
      page = 1, 
      limit = 10, 
      search,
      provision 
    } = req.query;

    const query = {};
    
    if (legislationId) {
      query.legislationId = legislationId;
    }
    
    if (provision) {
      query.provision = { $regex: provision, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { submitterName: { $regex: search, $options: 'i' } },
        { submitterEmail: { $regex: search, $options: 'i' } },
        { commentText: { $regex: search, $options: 'i' } }
      ];
    }

    const feedbacks = await Feedback.find(query)
      .populate('legislationId', 'title department')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Feedback.countDocuments(query);

    res.json({
      feedbacks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalFeedbacks: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single feedback by ID
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('legislationId', 'title description department');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Admin only)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedbacks by legislation
// @route   GET /api/feedback/legislation/:legislationId
// @access  Private
exports.getFeedbacksByLegislation = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ 
      legislationId: req.params.legislationId 
    }).sort({ submittedAt: -1 });

    res.json({
      count: feedbacks.length,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};