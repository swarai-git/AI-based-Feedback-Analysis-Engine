import { useState, useEffect } from 'react';
import { analysisAPI } from '../services/api';
import { Copy, TrendingUp, Users, AlertCircle, Sparkles } from 'lucide-react';
import DuplicateCharts from './DuplicateCharts';
import AIInsights from './AIInsights';
import SearchGroupedFeedbacks from './SearchGroupedFeedbacks';
import EmailAlerts from './EmailAlerts';
import { useAuth } from '../context/AuthContext';

const DuplicateAnalysis = ({ legislationId }) => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0.6);
  const [useAI, setUseAI] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, [legislationId, threshold, useAI]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analysisAPI.analyzeDuplicates(legislationId, threshold, useAI);
      setAnalysis(response.data);
    } catch (err) {
      console.error('Error fetching duplicate analysis:', err);
      setError('Failed to load duplicate analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  if (!analysis || analysis.totalFeedbacks === 0) {
    return (
      <div className="text-center py-12">
        <Copy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No feedbacks available for analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Feedbacks"
          value={analysis.totalFeedbacks}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Unique Groups"
          value={analysis.uniqueGroups}
          icon={Copy}
          color="green"
        />
        <StatCard
          title="Duplicate Groups"
          value={analysis.duplicateGroups}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Threshold Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Similarity Threshold: {(threshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.1"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              Higher threshold = more strict matching
            </p>
          </div>

          {/* AI Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Use AI-Powered Analysis
              </span>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Enable semantic similarity detection using Claude AI
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      {analysis.distribution && analysis.topSuggestions && (
        <DuplicateCharts 
          distribution={analysis.distribution} 
          topSuggestions={analysis.topSuggestions} 
        />
      )}

      {/* AI Insights */}
      {useAI && analysis.aiInsights && (
        <div className="card">
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI-Powered Insights
            </h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {analysis.aiInsights}
            </div>
          </div>
        </div>
      )}

      {/* Or show AI Insights component if not already loaded */}
      {!useAI && <AIInsights legislationId={legislationId} />}

      {/* Search Component */}
      <SearchGroupedFeedbacks 
        legislationId={legislationId} 
        threshold={threshold} 
      />

      {/* Email Alerts (Admin only) */}
      {user?.role === 'admin' && (
        <EmailAlerts 
          legislationId={legislationId} 
          duplicateGroups={analysis.groups.filter(g => g.count > 1)} 
        />
      )}

      {/* Top Suggestions */}
      {analysis.topSuggestions && analysis.topSuggestions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Most Suggested Changes
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.topSuggestions.map((suggestion, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {suggestion.word} ({suggestion.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grouped Feedbacks */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Grouped Similar Feedbacks
        </h3>
        <div className="space-y-4">
          {analysis.groups.slice(0, 10).map((group, index) => (
            <GroupCard key={index} group={group} index={index} legislationId={legislationId} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Group Card Component
const GroupCard = ({ group, index, legislationId }) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const sendAlert = async () => {
    if (group.similar.length === 0) return;

    try {
      await analysisAPI.sendDuplicateAlert({
        originalFeedbackId: group.representative._id,
        duplicateFeedbackId: group.similar[0]._id,
        legislationId: legislationId
      });
      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 3000);
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-semibold text-gray-900">
              Group #{index + 1}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              {group.count} similar feedback{group.count > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">
            {group.representative.commentText}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            By: {group.representative.submitterName} • {new Date(group.representative.submittedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {group.count > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expanded ? 'Hide' : 'Show'} {group.similar.length} similar feedback{group.similar.length > 1 ? 's' : ''}
          </button>
        )}

        {user?.role === 'admin' && group.count > 1 && (
          <button
            onClick={sendAlert}
            disabled={alertSent}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium ml-auto"
          >
            {alertSent ? '✓ Alert Sent' : '📧 Send Alert'}
          </button>
        )}
      </div>

      {expanded && group.similar.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
          {group.similar.map((similar, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Similarity: {(parseFloat(similar.similarity) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{similar.commentText}</p>
              <div className="text-xs text-gray-500">
                By: {similar.submitterName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuplicateAnalysis;