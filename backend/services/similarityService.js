const stringSimilarity = require('string-similarity');
const natural = require('natural');

// Tokenizer for text processing
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

/**
 * Preprocess text: lowercase, remove special chars, tokenize
 */
const preprocessText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim();
};

/**
 * Calculate similarity between two texts (0 to 1)
 */
const calculateSimilarity = (text1, text2) => {
  const processed1 = preprocessText(text1);
  const processed2 = preprocessText(text2);
  
  // Use string-similarity library (Dice coefficient)
  return stringSimilarity.compareTwoStrings(processed1, processed2);
};

/**
 * Group similar feedbacks together
 * @param {Array} feedbacks - Array of feedback objects
 * @param {Number} threshold - Similarity threshold (0-1, default 0.6)
 * @returns {Array} - Array of grouped feedbacks
 */
const groupSimilarFeedbacks = (feedbacks, threshold = 0.6) => {
  const groups = [];
  const processed = new Set();

  feedbacks.forEach((feedback, index) => {
    // Skip if already processed
    if (processed.has(index)) return;

    // Create new group with current feedback
    const group = {
      representative: feedback,
      similar: [],
      count: 1,
      feedbackIds: [feedback._id],
      averageSimilarity: 1
    };

    // Find similar feedbacks
    feedbacks.forEach((otherFeedback, otherIndex) => {
      if (index === otherIndex || processed.has(otherIndex)) return;

      const similarity = calculateSimilarity(
        feedback.commentText,
        otherFeedback.commentText
      );

      // If similarity is above threshold, add to group
      if (similarity >= threshold) {
        group.similar.push({
          ...otherFeedback.toObject(),
          similarity: similarity.toFixed(2)
        });
        group.feedbackIds.push(otherFeedback._id);
        group.count++;
        processed.add(otherIndex);
      }
    });

    // Calculate average similarity
    if (group.similar.length > 0) {
      const totalSimilarity = group.similar.reduce(
        (sum, item) => sum + parseFloat(item.similarity),
        0
      );
      group.averageSimilarity = (totalSimilarity / group.similar.length).toFixed(2);
    }

    groups.push(group);
    processed.add(index);
  });

  // Sort by count (most suggested changes first)
  return groups.sort((a, b) => b.count - a.count);
};

/**
 * Extract key phrases from feedbacks
 */
const extractKeyPhrases = (feedbacks) => {
  const tfidf = new TfIdf();
  
  // Add all comments to TF-IDF
  feedbacks.forEach(feedback => {
    tfidf.addDocument(preprocessText(feedback.commentText));
  });

  const keyPhrases = [];
  
  // Get top terms from each document
  feedbacks.forEach((feedback, index) => {
    const terms = [];
    tfidf.listTerms(index).slice(0, 5).forEach(item => {
      terms.push(item.term);
    });
    
    if (terms.length > 0) {
      keyPhrases.push({
        feedbackId: feedback._id,
        phrases: terms
      });
    }
  });

  return keyPhrases;
};

/**
 * Get most common suggestions across all feedbacks
 */
const getMostSuggestedChanges = (feedbacks, topN = 10) => {
  const wordFrequency = {};
  
  feedbacks.forEach(feedback => {
    const words = tokenizer.tokenize(preprocessText(feedback.commentText));
    
    words.forEach(word => {
      // Filter out common words
      if (word.length > 3 && !isCommonWord(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
  });

  // Sort by frequency and get top N
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
};

/**
 * Check if word is a common stop word
 */
const isCommonWord = (word) => {
  const stopWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all',
    'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get',
    'has', 'him', 'his', 'how', 'its', 'may', 'now', 'said',
    'she', 'than', 'that', 'this', 'will', 'with'
  ];
  return stopWords.includes(word.toLowerCase());
};

module.exports = {
  calculateSimilarity,
  groupSimilarFeedbacks,
  extractKeyPhrases,
  getMostSuggestedChanges
};