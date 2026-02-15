/*const axios = require('axios');
const Feedback = require('../models/Feedback');
const AnalysisResult = require('../models/AnalysisResult');

// Analyze a single feedback
exports.analyzeFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    // Check if feedback exists
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if already analyzed
    const existingAnalysis = await AnalysisResult.findOne({ feedbackId });
    if (existingAnalysis) {
      return res.status(200).json({
        message: 'Feedback already analyzed',
        analysis: existingAnalysis
      });
    }

    // Call ML server for sentiment analysis
    const sentimentResponse = await axios.post(
      `${process.env.ML_SERVER_URL}/api/analyze/sentiment`,
      { text: feedback.commentText }
    );

    // Call ML server for keyword extraction
    const keywordsResponse = await axios.post(
      `${process.env.ML_SERVER_URL}/api/analyze/keywords`,
      { text: feedback.commentText, top_n: 5 }
    );

    // Call ML server for summarization
    const summaryResponse = await axios.post(
      `${process.env.ML_SERVER_URL}/api/analyze/summarize`,
      { text: feedback.commentText, max_length: 100 }
    );

    // Determine priority based on sentiment score
    let priority = 'medium';
    const score = sentimentResponse.data.score;
    if (Math.abs(score) > 0.6) {
      priority = 'high';
    } else if (Math.abs(score) < 0.3) {
      priority = 'low';
    }

    // Create analysis result
    const analysisResult = await AnalysisResult.create({
      feedbackId: feedback._id,
      sentiment: sentimentResponse.data.sentiment,
      sentimentScore: sentimentResponse.data.score,
      keywords: keywordsResponse.data.keywords,
      priority,
      summary: summaryResponse.data.summary
    });

    res.status(201).json({
      message: 'Feedback analyzed successfully',
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      message: 'Error analyzing feedback',
      error: error.message 
    });
  }
};

// Get analysis for a specific feedback
exports.getAnalysis = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const analysis = await AnalysisResult.findOne({ feedbackId })
      .populate('feedbackId');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ 
      message: 'Error retrieving analysis',
      error: error.message 
    });
  }
};

// Batch analyze all feedbacks for a legislation
exports.batchAnalyze = async (req, res) => {
  try {
    const { legislationId } = req.body;

    if (!legislationId) {
      return res.status(400).json({ message: 'Legislation ID is required' });
    }

    // Get all feedbacks for this legislation
    const feedbacks = await Feedback.find({ legislationId });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedbacks found for this legislation' });
    }

    // Filter out already analyzed feedbacks
    const analyzedFeedbackIds = await AnalysisResult.find({
      feedbackId: { $in: feedbacks.map(f => f._id) }
    }).distinct('feedbackId');

    const unanalyzedFeedbacks = feedbacks.filter(
      f => !analyzedFeedbackIds.includes(f._id.toString())
    );

    if (unanalyzedFeedbacks.length === 0) {
      return res.status(200).json({ 
        message: 'All feedbacks already analyzed',
        total: feedbacks.length,
        analyzed: feedbacks.length
      });
    }

    // Prepare batch data for ML server
    const batchData = unanalyzedFeedbacks.map(f => ({
      id: f._id.toString(),
      text: f.commentText
    }));

    // Call ML server batch endpoint
    const batchResponse = await axios.post(
      `${process.env.ML_SERVER_URL}/api/analyze/batch`,
      { feedbacks: batchData }
    );

    // Create analysis results
    const analysisResults = batchResponse.data.results.map(result => {
      const score = result.sentiment.score;
      let priority = 'medium';
      if (Math.abs(score) > 0.6) {
        priority = 'high';
      } else if (Math.abs(score) < 0.3) {
        priority = 'low';
      }

      return {
        feedbackId: result.id,
        sentiment: result.sentiment.sentiment,
        sentimentScore: result.sentiment.score,
        keywords: result.keywords,
        priority,
        summary: result.summary
      };
    });

    await AnalysisResult.insertMany(analysisResults);

    res.status(201).json({
      message: 'Batch analysis completed',
      total: feedbacks.length,
      analyzed: unanalyzedFeedbacks.length,
      results: analysisResults
    });
  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({ 
      message: 'Error in batch analysis',
      error: error.message 
    });
  }
};

// Get all analyses for a legislation
exports.getAnalysesByLegislation = async (req, res) => {
  try {
    const { legislationId } = req.params;

    // Get all feedbacks for this legislation
    const feedbacks = await Feedback.find({ legislationId });
    const feedbackIds = feedbacks.map(f => f._id);

    // Get all analyses
    const analyses = await AnalysisResult.find({
      feedbackId: { $in: feedbackIds }
    }).populate('feedbackId');

    res.status(200).json({
      total: analyses.length,
      analyses
    });
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ 
      message: 'Error retrieving analyses',
      error: error.message 
    });
  }
};

// Delete analysis (for re-analysis)
exports.deleteAnalysis = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const result = await AnalysisResult.findOneAndDelete({ feedbackId });

    if (!result) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.status(200).json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ 
      message: 'Error deleting analysis',
      error: error.message 
    });
  }
};*/


/*const axios = require('axios');
const Feedback = require('../models/Feedback');
const AnalysisResult = require('../models/AnalysisResult');

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:8000';

// Analyze a single feedback
exports.analyzeFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const existingAnalysis = await AnalysisResult.findOne({ feedbackId });
    if (existingAnalysis) {
      return res.status(200).json({
        message: 'Feedback already analyzed',
        analysis: existingAnalysis,
      });
    }

    const sentimentResponse = await axios.post(
      `${ML_SERVER_URL}/api/analyze/sentiment`,
      { text: feedback.commentText }
    );

    const keywordsResponse = await axios.post(
      `${ML_SERVER_URL}/api/analyze/keywords`,
      { text: feedback.commentText, top_n: 5 }
    );

    const summaryResponse = await axios.post(
      `${ML_SERVER_URL}/api/analyze/summarize`,
      { text: feedback.commentText, max_length: 100 }
    );

    let priority = 'medium';
    const score = sentimentResponse.data.score;
    if (Math.abs(score) > 0.6) {
      priority = 'high';
    } else if (Math.abs(score) < 0.3) {
      priority = 'low';
    }

    const analysisResult = await AnalysisResult.create({
      feedbackId: feedback._id,
      sentiment: sentimentResponse.data.sentiment,
      sentimentScore: sentimentResponse.data.score,
      keywords: keywordsResponse.data.keywords,
      priority,
      summary: summaryResponse.data.summary,
    });

    res.status(201).json({
      message: 'Feedback analyzed successfully',
      analysis: analysisResult,
    });
  } catch (error) {
    console.error('Analysis error:', error?.response?.data || error.message);
    res.status(500).json({
      message: 'Error analyzing feedback',
      error: error.message,
    });
  }
};

// Get analysis for a specific feedback
exports.getAnalysis = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const analysis = await AnalysisResult.findOne({ feedbackId }).populate('feedbackId');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error.message);
    res.status(500).json({
      message: 'Error retrieving analysis',
      error: error.message,
    });
  }
};

// Batch analyze all feedbacks for a legislation
exports.batchAnalyze = async (req, res) => {
  try {
    const { legislationId } = req.body;

    if (!legislationId) {
      return res.status(400).json({ message: 'Legislation ID is required' });
    }

    const feedbacks = await Feedback.find({ legislationId });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedbacks found for this legislation' });
    }

    const analyzedFeedbackIds = await AnalysisResult.find({
      feedbackId: { $in: feedbacks.map(f => f._id) },
    }).distinct('feedbackId');

    const analyzedSet = new Set(analyzedFeedbackIds.map(id => id.toString()));
    const unanalyzedFeedbacks = feedbacks.filter(f => !analyzedSet.has(f._id.toString()));

    if (unanalyzedFeedbacks.length === 0) {
      return res.status(200).json({
        message: 'All feedbacks already analyzed',
        total: feedbacks.length,
        analyzed: feedbacks.length,
      });
    }

    const batchData = unanalyzedFeedbacks.map(f => ({
      id: f._id.toString(),
      text: f.commentText,
    }));

    const batchResponse = await axios.post(
      `${ML_SERVER_URL}/api/analyze/batch`,
      { feedbacks: batchData }
    );

    const analysisResults = batchResponse.data.results.map(result => {
      const score = result.sentiment.score;
      let priority = 'medium';
      if (Math.abs(score) > 0.6) {
        priority = 'high';
      } else if (Math.abs(score) < 0.3) {
        priority = 'low';
      }

      return {
        feedbackId: result.id,
        sentiment: result.sentiment.sentiment,
        sentimentScore: result.sentiment.score,
        keywords: result.keywords,
        priority,
        summary: result.summary,
      };
    });

    await AnalysisResult.insertMany(analysisResults);

    res.status(201).json({
      message: 'Batch analysis completed',
      total: feedbacks.length,
      analyzed: unanalyzedFeedbacks.length,
      results: analysisResults,
    });
  } catch (error) {
    console.error('Batch analysis error:', error?.response?.data || error.message);
    res.status(500).json({
      message: 'Error in batch analysis',
      error: error.message,
    });
  }
};

// Get all analyses for a legislation
exports.getAnalysesByLegislation = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const feedbacks = await Feedback.find({ legislationId });
    const feedbackIds = feedbacks.map(f => f._id);

    const analyses = await AnalysisResult.find({
      feedbackId: { $in: feedbackIds },
    }).populate('feedbackId');

    res.status(200).json({
      total: analyses.length,
      analyses,
    });
  } catch (error) {
    console.error('Get analyses error:', error.message);
    res.status(500).json({
      message: 'Error retrieving analyses',
      error: error.message,
    });
  }
};

// Delete analysis (for re-analysis)
exports.deleteAnalysis = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const result = await AnalysisResult.findOneAndDelete({ feedbackId });

    if (!result) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.status(200).json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error.message);
    res.status(500).json({
      message: 'Error deleting analysis',
      error: error.message,
    });
  }
};*/

/*

const Feedback = require('../models/Feedback');
const Legislation = require('../models/Legislation');
const AnalysisResult = require('../models/AnalysisResult');

const {
  groupSimilarFeedbacks,
  extractKeyPhrases,
  getMostSuggestedChanges,
  calculateSimilarity
} = require('../services/similarityService');
const {
  detectSemanticSimilarity,
  getAIInsights
} = require('../services/aiSimilarityService');
const {
  sendDuplicateAlert,
  sendDailyDigest
} = require('../services/emailService');

// @desc    Analyze feedbacks for duplicates with AI
// @route   GET /api/analysis/legislation/:legislationId/duplicates
// @access  Private (admin, analyst)
exports.analyzeDuplicates = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const { threshold = 0.6, useAI = 'false' } = req.query;

    // Get legislation details
    const legislation = await Legislation.findById(legislationId);
    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    // Get all feedbacks
    const feedbacks = await Feedback.find({ legislationId }).sort({ submittedAt: -1 });

    if (feedbacks.length === 0) {
      return res.json({
        message: 'No feedbacks found for analysis',
        groups: [],
        totalFeedbacks: 0
      });
    }

    // Basic similarity grouping
    const groups = groupSimilarFeedbacks(feedbacks, parseFloat(threshold));
    const topSuggestions = getMostSuggestedChanges(feedbacks, 15);
    const keyPhrases = extractKeyPhrases(feedbacks);

    // AI-powered semantic analysis (if requested)
    let aiAnalysis = null;
    let aiInsights = null;

    if (useAI === 'true' && process.env.ANTHROPIC_API_KEY) {
      try {
        aiAnalysis = await detectSemanticSimilarity(feedbacks);
        aiInsights = await getAIInsights(feedbacks);
      } catch (error) {
        console.error('AI Analysis error:', error);
      }
    }

    // Calculate distribution for charts
    const distribution = calculateDuplicateDistribution(groups);

    res.json({
      success: true,
      totalFeedbacks: feedbacks.length,
      uniqueGroups: groups.length,
      duplicateGroups: groups.filter(g => g.count > 1).length,
      groups: groups,
      topSuggestions: topSuggestions,
      keyPhrases: keyPhrases,
      threshold: parseFloat(threshold),
      aiAnalysis: aiAnalysis,
      aiInsights: aiInsights,
      distribution: distribution,
      legislationTitle: legislation.title
    });

  } catch (error) {
    console.error('Duplicate analysis error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error analyzing duplicates',
      error: error.message 
    });
  }
};

// @desc    Get AI-powered insights
// @route   GET /api/analysis/legislation/:legislationId/ai-insights
// @access  Private (admin, analyst)
exports.getAIInsights = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const feedbacks = await Feedback.find({ legislationId }).limit(100);

    if (feedbacks.length === 0) {
      return res.json({
        success: false,
        message: 'No feedbacks available for analysis'
      });
    }

    const insights = await getAIInsights(feedbacks);

    res.json({
      success: true,
      insights: insights,
      feedbackCount: feedbacks.length
    });

  } catch (error) {
    console.error('AI Insights error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating AI insights',
      error: error.message 
    });
  }
};

// @desc    Send duplicate alert
// @route   POST /api/analysis/send-duplicate-alert
// @access  Private (admin)
exports.sendDuplicateAlertEmail = async (req, res) => {
  try {
    const { originalFeedbackId, duplicateFeedbackId, legislationId } = req.body;

    const originalFeedback = await Feedback.findById(originalFeedbackId);
    const duplicateFeedback = await Feedback.findById(duplicateFeedbackId);
    const legislation = await Legislation.findById(legislationId);

    if (!originalFeedback || !duplicateFeedback || !legislation) {
      return res.status(404).json({ message: 'Required data not found' });
    }

    const result = await sendDuplicateAlert(
      originalFeedback,
      duplicateFeedback,
      legislation.title
    );

    if (result) {
      res.json({ success: true, message: 'Alert email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }

  } catch (error) {
    console.error('Send alert error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending alert',
      error: error.message 
    });
  }
};

// @desc    Send daily digest
// @route   POST /api/analysis/send-daily-digest
// @access  Private (admin)
exports.sendDailyDigestEmail = async (req, res) => {
  try {
    const { legislationId } = req.body;

    const legislation = await Legislation.findById(legislationId);
    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    const feedbacks = await Feedback.find({ legislationId });
    const groups = groupSimilarFeedbacks(feedbacks, 0.6);
    const duplicateGroups = groups.filter(g => g.count > 1);

    const result = await sendDailyDigest(duplicateGroups, legislation.title);

    if (result) {
      res.json({ success: true, message: 'Daily digest sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send digest' });
    }

  } catch (error) {
    console.error('Send digest error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending digest',
      error: error.message 
    });
  }
};

// @desc    Search within grouped feedbacks
// @route   GET /api/analysis/legislation/:legislationId/search
// @access  Private (admin, analyst)
exports.searchGroupedFeedbacks = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const { query, threshold = 0.6 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const feedbacks = await Feedback.find({ legislationId });
    const groups = groupSimilarFeedbacks(feedbacks, parseFloat(threshold));

    // Search within groups
    const searchResults = groups.filter(group => {
      const representativeMatch = group.representative.commentText
        .toLowerCase()
        .includes(query.toLowerCase());
      
      const similarMatch = group.similar.some(s => 
        s.commentText.toLowerCase().includes(query.toLowerCase())
      );

      return representativeMatch || similarMatch;
    });

    res.json({
      success: true,
      query: query,
      resultsCount: searchResults.length,
      results: searchResults
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error searching feedbacks',
      error: error.message 
    });
  }
};

// Helper function to calculate distribution
const calculateDuplicateDistribution = (groups) => {
  const distribution = {
    single: 0,
    small: 0,    // 2-5 duplicates
    medium: 0,   // 6-10 duplicates
    large: 0     // 11+ duplicates
  };

  groups.forEach(group => {
    if (group.count === 1) {
      distribution.single++;
    } else if (group.count <= 5) {
      distribution.small++;
    } else if (group.count <= 10) {
      distribution.medium++;
    } else {
      distribution.large++;
    }
  });

  return distribution;
};

// @desc    Get top suggestions
// @route   GET /api/analysis/legislation/:legislationId/top-suggestions
// @access  Private (admin, analyst)
exports.getTopSuggestions = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const { limit = 20 } = req.query;

    const feedbacks = await Feedback.find({ legislationId });

    if (feedbacks.length === 0) {
      return res.json({
        message: 'No feedbacks found',
        suggestions: []
      });
    }

    const topSuggestions = getMostSuggestedChanges(feedbacks, parseInt(limit));

    res.json({
      success: true,
      totalFeedbacks: feedbacks.length,
      suggestions: topSuggestions
    });

  } catch (error) {
    console.error('Top suggestions error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching top suggestions',
      error: error.message 
    });
  }
};

// @desc    Analyze feedbacks in batch
// @route   POST /api/analysis/batch
// @access  Private (admin, analyst)
/*exports.analyzeBatch = async (req, res) => {
  try {
    const { feedbacks } = req.body;

    if (!feedbacks || !Array.isArray(feedbacks) || feedbacks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Feedbacks array is required'
      });
    }

    // Basic analysis example (you can replace with ML/AI later)
    const results = feedbacks.map((feedback, index) => ({
      id: index,
      text: feedback.commentText || feedback,
      sentiment: 'neutral', // placeholder
      confidence: 0.75
    }));

    res.status(200).json({
      success: true,
      analyzedCount: results.length,
      results
    });

  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing feedbacks',
      error: error.message
    });
  }
};
*/
exports.analyzeBatch = async (req, res) => {
  try {
    const { legislationId } = req.body;

    if (!legislationId) {
      return res.status(400).json({ message: 'legislationId is required' });
    }

    // Get all un-analyzed feedbacks
    const feedbacks = await Feedback.find({ legislationId });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedbacks found for this legislation' });
    }

    let analyzedCount = 0;

    for (const feedback of feedbacks) {
      // Skip if already analyzed
      const alreadyAnalyzed = await AnalysisResult.findOne({ feedbackId: feedback._id });
      if (alreadyAnalyzed) continue;

      // 🔹 Basic placeholder analysis (replace later with ML/AI)
      const sentiment = 'neutral';
      const priority = 'medium';
      
      // ✅ FIX: Extract keywords properly
      const keyPhrasesResult = extractKeyPhrases([feedback]);
      
      // Convert to simple array of strings
      let keywords = [];
      if (Array.isArray(keyPhrasesResult)) {
        // If it's already an array of strings, use it
        if (typeof keyPhrasesResult[0] === 'string') {
          keywords = keyPhrasesResult.slice(0, 10); // Limit to 10 keywords
        } 
        // If it's an array of objects with a 'phrases' property
        else if (keyPhrasesResult[0]?.phrases) {
          keywords = keyPhrasesResult[0].phrases.slice(0, 10);
        }
        // If it's an array of objects with a 'phrase' property
        else if (keyPhrasesResult[0]?.phrase) {
          keywords = keyPhrasesResult.map(item => item.phrase).slice(0, 10);
        }
      }
      
      const summary = feedback.commentText.slice(0, 200);

      // Save analysis result
      await AnalysisResult.create({
        feedbackId: feedback._id,
        sentiment,
        sentimentScore: 0,
        priority,
        keywords, // Now this is a proper array of strings
        category: null,
        summary,
        analyzedAt: new Date()
      });

      analyzedCount++;
    }

    res.status(200).json({
      success: true,
      analyzedCount,
      message: `${analyzedCount} feedback(s) analyzed successfully`
    });

  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  analyzeDuplicates: exports.analyzeDuplicates,
  getAIInsights: exports.getAIInsights,
  sendDuplicateAlertEmail: exports.sendDuplicateAlertEmail,
  sendDailyDigestEmail: exports.sendDailyDigestEmail,
  searchGroupedFeedbacks: exports.searchGroupedFeedbacks,
  getTopSuggestions: exports.getTopSuggestions,
   analyzeBatch: exports.analyzeBatch 
};


















const Feedback = require('../models/Feedback');
const Legislation = require('../models/Legislation');
const AnalysisResult = require('../models/AnalysisResult');

const {
  groupSimilarFeedbacks,
  extractKeyPhrases,
  getMostSuggestedChanges,
  calculateSimilarity
} = require('../services/similarityService');

const {
  detectSemanticSimilarity,
  getAIInsights
} = require('../services/aiSimilarityService');

const {
  sendDuplicateAlert,
  sendDailyDigest
} = require('../services/emailService');

// @desc    Analyze feedbacks for duplicates with AI
// @route   GET /api/analysis/legislation/:legislationId/duplicates
// @access  Private (admin, analyst)
exports.analyzeDuplicates = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const { threshold = 0.6, useAI = 'false' } = req.query;

    // Get legislation details
    const legislation = await Legislation.findById(legislationId);
    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    // Get all feedbacks
    const feedbacks = await Feedback.find({ legislationId }).sort({ submittedAt: -1 });

    if (feedbacks.length === 0) {
      return res.json({
        message: 'No feedbacks found for analysis',
        groups: [],
        totalFeedbacks: 0,
        uniqueGroups: 0,
        duplicateGroups: 0,
        distribution: { single: 0, small: 0, medium: 0, large: 0 },
        topSuggestions: []
      });
    }

    // Basic similarity grouping
    const groups = groupSimilarFeedbacks(feedbacks, parseFloat(threshold));
    const topSuggestions = getMostSuggestedChanges(feedbacks, 15);
    const keyPhrases = extractKeyPhrases(feedbacks);

    // AI-powered semantic analysis (if requested)
    let aiAnalysis = null;
    let aiInsights = null;

    if (useAI === 'true' && process.env.ANTHROPIC_API_KEY) {
      try {
        aiAnalysis = await detectSemanticSimilarity(feedbacks);
        aiInsights = await getAIInsights(feedbacks);
      } catch (error) {
        console.error('AI Analysis error:', error);
      }
    }

    // Calculate distribution for charts
    const distribution = calculateDuplicateDistribution(groups);

    res.json({
      success: true,
      totalFeedbacks: feedbacks.length,
      uniqueGroups: groups.length,
      duplicateGroups: groups.filter(g => g.count > 1).length,
      groups: groups,
      topSuggestions: topSuggestions,
      keyPhrases: keyPhrases,
      threshold: parseFloat(threshold),
      aiAnalysis: aiAnalysis,
      aiInsights: aiInsights,
      distribution: distribution,
      legislationTitle: legislation.title
    });

  } catch (error) {
    console.error('Duplicate analysis error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error analyzing duplicates',
      error: error.message 
    });
  }
};

// @desc    Get AI-powered insights
// @route   GET /api/analysis/legislation/:legislationId/ai-insights
// @access  Private (admin, analyst)
exports.getAIInsights = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const feedbacks = await Feedback.find({ legislationId }).limit(100);

    if (feedbacks.length === 0) {
      return res.json({
        success: false,
        message: 'No feedbacks available for analysis'
      });
    }

    const insights = await getAIInsights(feedbacks);

    res.json({
      success: true,
      insights: insights,
      feedbackCount: feedbacks.length
    });

  } catch (error) {
    console.error('AI Insights error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating AI insights',
      error: error.message 
    });
  }
};

// @desc    Send duplicate alert
// @route   POST /api/analysis/send-duplicate-alert
// @access  Private (admin)
exports.sendDuplicateAlertEmail = async (req, res) => {
  try {
    const { originalFeedbackId, duplicateFeedbackId, legislationId } = req.body;

    const originalFeedback = await Feedback.findById(originalFeedbackId);
    const duplicateFeedback = await Feedback.findById(duplicateFeedbackId);
    const legislation = await Legislation.findById(legislationId);

    if (!originalFeedback || !duplicateFeedback || !legislation) {
      return res.status(404).json({ message: 'Required data not found' });
    }

    // Calculate similarity score
    const similarity = calculateSimilarity(
      originalFeedback.commentText,
      duplicateFeedback.commentText
    );

    const result = await sendDuplicateAlert(
      originalFeedback,
      duplicateFeedback,
      similarity,
      legislation.title
    );

    if (result) {
      res.json({ success: true, message: 'Alert email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }

  } catch (error) {
    console.error('Send alert error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending alert',
      error: error.message 
    });
  }
};

// @desc    Send daily digest
// @route   POST /api/analysis/send-daily-digest
// @access  Private (admin)
exports.sendDailyDigestEmail = async (req, res) => {
  try {
    const { legislationId } = req.body;

    const legislation = await Legislation.findById(legislationId);
    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    const feedbacks = await Feedback.find({ legislationId });
    const groups = groupSimilarFeedbacks(feedbacks, 0.6);
    const duplicateGroups = groups.filter(g => g.count > 1);

    if (duplicateGroups.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No duplicate groups found to report' 
      });
    }

    const result = await sendDailyDigest(
      legislationId,
      duplicateGroups,
      legislation.title
    );

    if (result && result.success) {
      res.json({ 
        success: true, 
        message: 'Daily digest sent successfully',
        groupsCount: duplicateGroups.length
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send digest' 
      });
    }

  } catch (error) {
    console.error('Send digest error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending digest',
      error: error.message 
    });
  }
};

// @desc    Search within grouped feedbacks
// @route   GET /api/analysis/legislation/:legislationId/search
// @access  Private (admin, analyst)
exports.searchGroupedFeedbacks = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const { query, threshold = 0.6 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const feedbacks = await Feedback.find({ legislationId });
    const groups = groupSimilarFeedbacks(feedbacks, parseFloat(threshold));

    // Search within groups
    const searchResults = groups.filter(group => {
      const representativeMatch = group.representative.commentText
        .toLowerCase()
        .includes(query.toLowerCase());
      
      const similarMatch = group.similar.some(s => 
        s.commentText.toLowerCase().includes(query.toLowerCase())
      );

      return representativeMatch || similarMatch;
    });

    res.json({
      success: true,
      query: query,
      resultsCount: searchResults.length,
      results: searchResults
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error searching feedbacks',
      error: error.message 
    });
  }
};

// Helper function to calculate distribution
const calculateDuplicateDistribution = (groups) => {
  const distribution = {
    single: 0,
    small: 0,    // 2-5 duplicates
    medium: 0,   // 6-10 duplicates
    large: 0     // 11+ duplicates
  };

  groups.forEach(group => {
    if (group.count === 1) {
      distribution.single++;
    } else if (group.count <= 5) {
      distribution.small++;
    } else if (group.count <= 10) {
      distribution.medium++;
    } else {
      distribution.large++;
    }
  });

  return distribution;
};

// @desc    Get top suggestions
// @route   GET /api/analysis/legislation/:legislationId/top-suggestions
// @access  Private (admin, analyst)
exports.getTopSuggestions = async (req, res) => {
  try {
    const { legislationId } = req.params;
    const { limit = 20 } = req.query;

    const feedbacks = await Feedback.find({ legislationId });

    if (feedbacks.length === 0) {
      return res.json({
        message: 'No feedbacks found',
        suggestions: []
      });
    }

    const topSuggestions = getMostSuggestedChanges(feedbacks, parseInt(limit));

    res.json({
      success: true,
      totalFeedbacks: feedbacks.length,
      suggestions: topSuggestions
    });

  } catch (error) {
    console.error('Top suggestions error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching top suggestions',
      error: error.message 
    });
  }
};

// @desc    Analyze feedbacks in batch
// @route   POST /api/analysis/batch
// @access  Private (admin, analyst)
exports.analyzeBatch = async (req, res) => {
  try {
    const { legislationId } = req.body;

    if (!legislationId) {
      return res.status(400).json({ message: 'legislationId is required' });
    }

    // Get all un-analyzed feedbacks
    const feedbacks = await Feedback.find({ legislationId });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedbacks found for this legislation' });
    }

    let analyzedCount = 0;

    for (const feedback of feedbacks) {
      // Skip if already analyzed
      const alreadyAnalyzed = await AnalysisResult.findOne({ feedbackId: feedback._id });
      if (alreadyAnalyzed) continue;

      // Basic placeholder analysis
      const sentiment = 'neutral';
      const priority = 'medium';
      
      // Extract keywords properly
      const keyPhrasesResult = extractKeyPhrases([feedback]);
      
      // Convert to simple array of strings
      let keywords = [];
      if (Array.isArray(keyPhrasesResult)) {
        if (typeof keyPhrasesResult[0] === 'string') {
          keywords = keyPhrasesResult.slice(0, 10);
        } else if (keyPhrasesResult[0]?.phrases) {
          keywords = keyPhrasesResult[0].phrases.slice(0, 10);
        } else if (keyPhrasesResult[0]?.phrase) {
          keywords = keyPhrasesResult.map(item => item.phrase).slice(0, 10);
        }
      }
      
      const summary = feedback.commentText.slice(0, 200);

      // Save analysis result
      await AnalysisResult.create({
        feedbackId: feedback._id,
        sentiment,
        sentimentScore: 0,
        priority,
        keywords,
        category: null,
        summary,
        analyzedAt: new Date()
      });

      analyzedCount++;
    }

    res.status(200).json({
      success: true,
      analyzedCount,
      message: `${analyzedCount} feedback(s) analyzed successfully`
    });

  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  analyzeDuplicates: exports.analyzeDuplicates,
  getAIInsights: exports.getAIInsights,
  sendDuplicateAlertEmail: exports.sendDuplicateAlertEmail,
  sendDailyDigestEmail: exports.sendDailyDigestEmail,
  searchGroupedFeedbacks: exports.searchGroupedFeedbacks,
  getTopSuggestions: exports.getTopSuggestions,
  analyzeBatch: exports.analyzeBatch
};