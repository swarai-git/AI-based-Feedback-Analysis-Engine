const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Use Claude AI to detect semantic similarity between feedbacks
 * This goes beyond text matching to understand meaning
 */
const detectSemanticSimilarity = async (feedbacks) => {
  try {
    if (feedbacks.length === 0) return [];

    // Prepare feedback texts for analysis
    const feedbackTexts = feedbacks.map((f, idx) => ({
      id: idx,
      text: f.commentText,
      submitter: f.submitterName
    }));

    const prompt = `You are analyzing public feedback on legislation. Your task is to group similar feedbacks based on their MEANING, not just text similarity.

Here are the feedbacks:
${feedbackTexts.map(f => `[${f.id}] ${f.text}`).join('\n\n')}

Please:
1. Group feedbacks that express similar concerns or suggestions (even if worded differently)
2. Identify the main themes/topics
3. Highlight the most common concerns

Return a JSON response with this structure:
{
  "groups": [
    {
      "theme": "Brief theme description",
      "feedbackIds": [1, 3, 7],
      "commonConcern": "What they're all concerned about",
      "severity": "high/medium/low"
    }
  ],
  "topConcerns": ["concern1", "concern2", "concern3"],
  "sentimentSummary": {
    "positive": 10,
    "negative": 15,
    "neutral": 5
  }
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Map feedback IDs back to actual feedback objects
      analysis.groups = analysis.groups.map(group => ({
        ...group,
        feedbacks: group.feedbackIds.map(id => feedbackTexts[id])
      }));
      
      return analysis;
    }

    return { groups: [], topConcerns: [], sentimentSummary: {} };

  } catch (error) {
    console.error('AI Semantic Similarity Error:', error);
    throw error;
  }
};

/**
 * Get AI-powered insights on feedback trends
 */
const getAIInsights = async (feedbacks) => {
  try {
    const feedbackTexts = feedbacks.slice(0, 50).map(f => f.commentText).join('\n---\n');

    const prompt = `Analyze these public feedbacks on legislation and provide insights:

${feedbackTexts}

Provide:
1. Key themes (top 5)
2. Most urgent concerns
3. Common suggestions
4. Overall sentiment
5. Actionable recommendations for legislators

Keep it concise and data-driven.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return message.content[0].text;

  } catch (error) {
    console.error('AI Insights Error:', error);
    throw error;
  }
};

module.exports = {
  detectSemanticSimilarity,
  getAIInsights
};