const Legislation = require('../models/Legislation');
const Feedback = require('../models/Feedback');

// @desc    Create new legislation
// @route   POST /api/legislation
// @access  Private (Admin only)
exports.createLegislation = async (req, res) => {
  try {
    const { title, description, department, deadline, draftUrl } = req.body;

    const legislation = await Legislation.create({
      title,
      description,
      department,
      deadline,
      draftUrl,
      status: 'open'
    });

    res.status(201).json({
      message: 'Legislation created successfully',
      legislation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all legislations
// @route   GET /api/legislation
// @access  Public
exports.getAllLegislations = async (req, res) => {
  try {
    const { status, department, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (department) query.department = { $regex: department, $options: 'i' };

    const legislations = await Legislation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Legislation.countDocuments(query);

    // Get feedback count for each legislation
    const legislationsWithCount = await Promise.all(
      legislations.map(async (legislation) => {
        const feedbackCount = await Feedback.countDocuments({ 
          legislationId: legislation._id 
        });
        return {
          ...legislation.toObject(),
          feedbackCount
        };
      })
    );

    res.json({
      legislations: legislationsWithCount,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalLegislations: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single legislation by ID
// @route   GET /api/legislation/:id
// @access  Public
exports.getLegislationById = async (req, res) => {
  try {
    const legislation = await Legislation.findById(req.params.id);

    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    // Get feedback count
    const feedbackCount = await Feedback.countDocuments({ 
      legislationId: legislation._id 
    });

    res.json({
      ...legislation.toObject(),
      feedbackCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update legislation
// @route   PUT /api/legislation/:id
// @access  Private (Admin only)
exports.updateLegislation = async (req, res) => {
  try {
    const legislation = await Legislation.findById(req.params.id);

    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    const { title, description, department, deadline, draftUrl, status } = req.body;

    if (title) legislation.title = title;
    if (description) legislation.description = description;
    if (department) legislation.department = department;
    if (deadline) legislation.deadline = deadline;
    if (draftUrl) legislation.draftUrl = draftUrl;
    if (status) legislation.status = status;

    await legislation.save();

    res.json({
      message: 'Legislation updated successfully',
      legislation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete legislation
// @route   DELETE /api/legislation/:id
// @access  Private (Admin only)
exports.deleteLegislation = async (req, res) => {
  try {
    const legislation = await Legislation.findById(req.params.id);

    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    // Delete all associated feedbacks
    await Feedback.deleteMany({ legislationId: legislation._id });

    await legislation.deleteOne();

    res.json({ message: 'Legislation and associated feedbacks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get open legislations
// @route   GET /api/legislation/status/open
// @access  Public
exports.getOpenLegislations = async (req, res) => {
  try {
    const legislations = await Legislation.find({ status: 'open' })
      .sort({ deadline: 1 });

    res.json({
      count: legislations.length,
      legislations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};