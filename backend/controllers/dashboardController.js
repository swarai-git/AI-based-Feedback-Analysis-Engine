const Feedback = require('../models/Feedback');
const AnalysisResult = require('../models/AnalysisResult');
const Legislation = require('../models/Legislation');

// Get overall dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const { legislationId } = req.params;

    // Get total feedbacks
    const totalFeedbacks = await Feedback.countDocuments({ legislationId });

    // Get feedbacks with analysis
    const feedbackIds = await Feedback.find({ legislationId }).distinct('_id');
    const analyzedCount = await AnalysisResult.countDocuments({
      feedbackId: { $in: feedbackIds }
    });

    // Get sentiment distribution
    const sentimentCounts = await AnalysisResult.aggregate([
      { $match: { feedbackId: { $in: feedbackIds } } },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    const sentimentDistribution = {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    sentimentCounts.forEach(item => {
      sentimentDistribution[item._id] = item.count;
    });

    // Get priority distribution
    const priorityCounts = await AnalysisResult.aggregate([
      { $match: { feedbackId: { $in: feedbackIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const priorityDistribution = {
      high: 0,
      medium: 0,
      low: 0
    };

    priorityCounts.forEach(item => {
      priorityDistribution[item._id] = item.count;
    });

    // Get recent feedbacks
    const recentFeedbacks = await Feedback.find({ legislationId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('submitterName commentText submittedAt');

    res.status(200).json({
      totalFeedbacks,
      analyzedCount,
      pendingAnalysis: totalFeedbacks - analyzedCount,
      sentimentDistribution,
      priorityDistribution,
      recentFeedbacks,
      analysisProgress: totalFeedbacks > 0 
        ? Math.round((analyzedCount / totalFeedbacks) * 100) 
        : 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Error retrieving dashboard statistics',
      error: error.message 
    });
  }
};

// Get sentiment distribution over time
exports.getSentimentTrend = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const feedbackIds = await Feedback.find({ legislationId }).distinct('_id');

    const trend = await AnalysisResult.aggregate([
      { $match: { feedbackId: { $in: feedbackIds } } },
      {
        $lookup: {
          from: 'feedbacks',
          localField: 'feedbackId',
          foreignField: '_id',
          as: 'feedback'
        }
      },
      { $unwind: '$feedback' },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$feedback.submittedAt' } },
            sentiment: '$sentiment'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.status(200).json(trend);
  } catch (error) {
    console.error('Sentiment trend error:', error);
    res.status(500).json({ 
      message: 'Error retrieving sentiment trend',
      error: error.message 
    });
  }
};

// Get top keywords across all feedbacks
exports.getTopKeywords = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const feedbackIds = await Feedback.find({ legislationId }).distinct('_id');

    const keywordStats = await AnalysisResult.aggregate([
      { $match: { feedbackId: { $in: feedbackIds } } },
      { $unwind: '$keywords' },
      { $group: { _id: '$keywords', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    const keywords = keywordStats.map(k => ({
      text: k._id,
      value: k.count
    }));

    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Top keywords error:', error);
    res.status(500).json({ 
      message: 'Error retrieving top keywords',
      error: error.message 
    });
  }
};

// Get feedback analysis with filters
exports.getFilteredAnalysis = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const { sentiment, priority, page = 1, limit = 10 } = req.query;

    const feedbackIds = await Feedback.find({ legislationId }).distinct('_id');

    const filter = { feedbackId: { $in: feedbackIds } };

    if (sentiment) {
      filter.sentiment = sentiment;
    }

    if (priority) {
      filter.priority = priority;
    }

    const skip = (page - 1) * limit;

    const analyses = await AnalysisResult.find(filter)
      .populate('feedbackId')
      .sort({ analyzedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AnalysisResult.countDocuments(filter);

    res.status(200).json({
      analyses,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (error) {
    console.error('Filtered analysis error:', error);
    res.status(500).json({ 
      message: 'Error retrieving filtered analysis',
      error: error.message 
    });
  }
};

// Get category distribution
exports.getCategoryDistribution = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const feedbackIds = await Feedback.find({ legislationId }).distinct('_id');

    const categories = await AnalysisResult.aggregate([
      { $match: { feedbackId: { $in: feedbackIds }, category: { $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Category distribution error:', error);
    res.status(500).json({ 
      message: 'Error retrieving category distribution',
      error: error.message 
    });
  }
};

// Get high priority feedbacks
exports.getHighPriorityFeedbacks = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const feedbackIds = await Feedback.find({ legislationId }).distinct('_id');

    const highPriorityAnalyses = await AnalysisResult.find({
      feedbackId: { $in: feedbackIds },
      priority: 'high'
    })
      .populate('feedbackId')
      .sort({ sentimentScore: -1 })
      .limit(10);

    res.status(200).json({
      total: highPriorityAnalyses.length,
      feedbacks: highPriorityAnalyses
    });
  } catch (error) {
    console.error('High priority feedbacks error:', error);
    res.status(500).json({ 
      message: 'Error retrieving high priority feedbacks',
      error: error.message 
    });
  }
};

// Export data for Power BI
exports.exportForPowerBI = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const feedbacks = await Feedback.find({ legislationId });
    const feedbackIds = feedbacks.map(f => f._id);

    const analyses = await AnalysisResult.find({
      feedbackId: { $in: feedbackIds }
    }).populate('feedbackId');

    // Combine feedback and analysis data
    const exportData = analyses.map(analysis => ({
      feedbackId: analysis.feedbackId._id,
      submitterName: analysis.feedbackId.submitterName,
      submitterEmail: analysis.feedbackId.submitterEmail,
      commentText: analysis.feedbackId.commentText,
      provision: analysis.feedbackId.provision,
      submittedAt: analysis.feedbackId.submittedAt,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      keywords: analysis.keywords.join(', '),
      category: analysis.category,
      priority: analysis.priority,
      summary: analysis.summary,
      analyzedAt: analysis.analyzedAt
    }));

    res.status(200).json({
      legislationId,
      totalRecords: exportData.length,
      data: exportData
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ 
      message: 'Error exporting data',
      error: error.message 
    });
  }
};