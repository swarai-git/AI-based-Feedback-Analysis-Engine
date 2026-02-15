import { useState, useEffect } from 'react';
import { analysisAPI } from '../services/api';
import { Sparkles, Brain, AlertCircle } from 'lucide-react';

const AIInsights = ({ legislationId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analysisAPI.getAIInsights(legislationId);
      setInsights(response.data.insights);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  if (!insights && !loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI-Powered Insights
          </h3>
          <p className="text-gray-600 mb-4">
            Get deep analysis and recommendations powered by Claude AI
          </p>
          <button onClick={fetchInsights} className="btn-primary">
            <Sparkles className="h-5 w-5 mr-2 inline" />
            Generate Insights
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Claude is analyzing the feedbacks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="h-6 w-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          AI-Powered Insights
        </h3>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
          Powered by Claude
        </span>
      </div>
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-700">
          {insights}
        </div>
      </div>
      <button
        onClick={fetchInsights}
        className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        🔄 Refresh Insights
      </button>
    </div>
  );
};

export default AIInsights;