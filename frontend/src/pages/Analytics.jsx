import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dashboardAPI, analysisAPI, legislationAPI } from '../services/api';
import { ArrowLeft, TrendingUp, Activity, AlertCircle, Sparkles } from 'lucide-react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [legislation, setLegislation] = useState(null);
  const [stats, setStats] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'analyst') {
      alert('You do not have permission to view analytics');
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [legResponse, statsResponse, keywordsResponse] = await Promise.all([
        legislationAPI.getById(id),
        dashboardAPI.getStats(id),
        dashboardAPI.getKeywords(id, 15),
      ]);

      setLegislation(legResponse.data);
      setStats(statsResponse.data);
      setKeywords(keywordsResponse.data.keywords || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchAnalyze = async () => {
    if (window.confirm('Analyze all pending feedbacks? This may take a few minutes.')) {
      setAnalyzing(true);
      try {
        await analysisAPI.batchAnalyze(id);
        await fetchData();
        alert('Analysis completed successfully!');
      } catch (error) {
        console.error('Error analyzing feedbacks:', error);
        alert('Failed to analyze feedbacks');
      } finally {
        setAnalyzing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const sentimentData = stats?.sentimentDistribution
    ? [
        { name: 'Positive', value: stats.sentimentDistribution.positive, color: '#059669' },
        { name: 'Negative', value: stats.sentimentDistribution.negative, color: '#dc2626' },
        { name: 'Neutral', value: stats.sentimentDistribution.neutral, color: '#6366f1' },
      ]
    : [];

  const priorityData = stats?.priorityDistribution
    ? [
        { name: 'High', value: stats.priorityDistribution.high, color: '#dc2626' },
        { name: 'Medium', value: stats.priorityDistribution.medium, color: '#f59e0b' },
        { name: 'Low', value: stats.priorityDistribution.low, color: '#10b981' },
      ]
    : [];

  const totalSentiments = sentimentData.reduce((sum, item) => sum + item.value, 0);
  const totalPriorities = priorityData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <button
            onClick={() => navigate(`/legislation/${id}`)}
            className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Legislation
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  Analytics Dashboard
                </h1>
              </div>
              <p className="text-lg text-gray-600 pl-6 max-w-2xl">
                {legislation?.title || 'Legislation Details'}
              </p>
            </div>

            {stats?.pendingAnalysis > 0 && (
              <button
                onClick={handleBatchAnalyze}
                disabled={analyzing}
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <Sparkles className={`h-5 w-5 ${analyzing ? 'animate-spin' : 'animate-pulse'}`} />
                  <span>{analyzing ? 'Analyzing...' : `Analyze ${stats.pendingAnalysis} Pending`}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Feedbacks"
            value={stats?.totalFeedbacks || 0}
            trend="+12.5%"
            trendDirection="up"
            color="blue"
            icon={Activity}
          />
          <MetricCard
            title="Analyzed"
            value={stats?.analyzedCount || 0}
            subtitle={`${stats?.analysisProgress || 0}% Complete`}
            color="green"
            icon={TrendingUp}
            progress={stats?.analysisProgress || 0}
          />
          <MetricCard
            title="Pending Analysis"
            value={stats?.pendingAnalysis || 0}
            color="amber"
            icon={AlertCircle}
          />
          <MetricCard
            title="High Priority"
            value={stats?.priorityDistribution?.high || 0}
            subtitle="Requires attention"
            color="red"
            icon={AlertCircle}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Distribution */}
          <ChartCard title="Sentiment Distribution" subtitle="How citizens feel about this legislation">
            {totalSentiments > 0 ? (
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 w-full lg:w-auto">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-8 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState message="No sentiment data available yet" />
            )}
          </ChartCard>

          {/* Priority Distribution */}
          <ChartCard title="Priority Distribution" subtitle="Urgency levels of feedback">
            {totalPriorities > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#color${entry.name})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No priority data available yet" />
            )}
          </ChartCard>
        </div>

        {/* Keywords Section */}
        <ChartCard title="Top Keywords" subtitle="Most frequently mentioned terms in feedback">
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {keywords.map((keyword, index) => {
                const intensity = Math.min(keyword.value / Math.max(...keywords.map(k => k.value)), 1);
                const baseSize = 0.875; // 14px
                const maxSize = 1.25; // 20px
                const fontSize = baseSize + (maxSize - baseSize) * intensity;

                return (
                  <span
                    key={index}
                    className="group relative px-5 py-2.5 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 rounded-full font-medium border border-indigo-100 hover:border-indigo-300 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default"
                    style={{ fontSize: `${fontSize}rem` }}
                  >
                    {keyword.text}
                    <span className="ml-2 text-xs font-bold text-indigo-500">
                      {keyword.value}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full pointer-events-none"></div>
                  </span>
                );
              })}
            </div>
          ) : (
            <EmptyState message="No keywords extracted yet" />
          )}
        </ChartCard>

        {/* Sentiment Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SentimentBreakdownCard
            title="Positive Feedback"
            count={stats?.sentimentDistribution?.positive || 0}
            percentage={totalSentiments > 0 ? ((stats?.sentimentDistribution?.positive || 0) / totalSentiments * 100).toFixed(1) : 0}
            color="emerald"
            bgGradient="from-emerald-500 to-green-600"
          />
          <SentimentBreakdownCard
            title="Negative Feedback"
            count={stats?.sentimentDistribution?.negative || 0}
            percentage={totalSentiments > 0 ? ((stats?.sentimentDistribution?.negative || 0) / totalSentiments * 100).toFixed(1) : 0}
            color="rose"
            bgGradient="from-rose-500 to-red-600"
          />
          <SentimentBreakdownCard
            title="Neutral Feedback"
            count={stats?.sentimentDistribution?.neutral || 0}
            percentage={totalSentiments > 0 ? ((stats?.sentimentDistribution?.neutral || 0) / totalSentiments * 100).toFixed(1) : 0}
            color="indigo"
            bgGradient="from-indigo-500 to-purple-600"
          />
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subtitle, trend, trendDirection, color, icon: Icon, progress }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-green-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-rose-500 to-red-600',
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Background gradient effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full blur-3xl transition-all duration-300 group-hover:opacity-10 group-hover:scale-150`}></div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          </div>
          <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        {subtitle && (
          <p className="text-xs font-medium text-gray-500">{subtitle}</p>
        )}

        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3.5 w-3.5 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
            {trend}
          </div>
        )}

        {progress !== undefined && (
          <div className="space-y-2">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-700`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="mb-6 space-y-1">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Activity className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-500">{message}</p>
      <p className="text-xs text-gray-400 mt-1">Data will appear once feedback is analyzed</p>
    </div>
  );
};

// Sentiment Breakdown Card Component
const SentimentBreakdownCard = ({ title, count, percentage, color, bgGradient }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <div className={`px-2.5 py-1 bg-${color}-50 text-${color}-700 text-xs font-bold rounded-full`}>
            {percentage}%
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500 mt-1">responses</p>
          </div>
          
          {/* Mini progress circle */}
          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-100"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className={`text-${color}-500 transition-all duration-1000`}
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold text-${color}-600`}>{percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;