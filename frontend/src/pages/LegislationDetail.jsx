/*import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { legislationAPI, feedbackAPI, dashboardAPI } from '../services/api';
import { ArrowLeft, Calendar, Building2, ExternalLink, BarChart3 } from 'lucide-react';

const LegislationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [legislation, setLegislation] = useState(null);
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [legResponse, statsResponse, feedbackResponse] = await Promise.all([
        legislationAPI.getById(id),
        dashboardAPI.getStats(id),
        feedbackAPI.getAll({ legislationId: id, limit: 5 })
      ]);

      setLegislation(legResponse.data);
      setStats(statsResponse.data);
      setFeedbacks(feedbackResponse.data.feedbacks || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!legislation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Legislation not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    */
      {/* Back Button */}
      /*<button
        onClick={() => navigate('/legislations')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Legislations
      </button>
*/
      {/* Header */}/*
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(legislation.status)}`}>
            {legislation.status.replace('_', ' ').toUpperCase()}
          </span>
          {(user?.role === 'admin '|| user?.role ==='analyst')&&(
          <Link
            to={`/analytics/${id}`}
            className="btn-primary flex items-center gap-2"
          >
            <BarChart3 className="h-5 w-5" />
            View Analytics
          </Link>)}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {legislation.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{legislation.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(legislation.deadline)}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {legislation.description}
          </p>
        </div>

        {legislation.draftUrl && (
          <a
            href={legislation.draftUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="h-4 w-4" />
            View Draft Document
          </a>
        )}
      </div>
*/
      {/* Statistics */}
      /*{stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Feedbacks"
            value={stats.totalFeedbacks}
            color="blue"
          />
          <StatCard
            title="Positive"
            value={stats.sentimentDistribution?.positive || 0}
            color="green"
          />
          <StatCard
            title="Negative"
            value={stats.sentimentDistribution?.negative || 0}
            color="red"
          />
          <StatCard
            title="Neutral"
            value={stats.sentimentDistribution?.neutral || 0}
            color="gray"
          />
        </div>
      )}*/

      {/* Recent Feedbacks */}
      /*
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Feedbacks</h2>
          <Link
            to={`/analytics/${id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No feedbacks yet</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{feedback.submitterName}</p>
                    <p className="text-sm text-gray-500">{feedback.submitterEmail}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(feedback.submittedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  {feedback.commentText}
                </p>
                {feedback.provision && (
                  <p className="text-xs text-gray-500 mt-2">
                    📋 {feedback.provision}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
*/
      {/* Actions */}
     /* <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">Submit Your Feedback</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your thoughts and suggestions on this draft legislation
        </p>
        <Link
          to={`/submit-feedback?legislationId=${id}`}
          className="btn-primary inline-block"
        >
          Submit Feedback
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600',
  };

  return (
    <div className="card">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
};

export default LegislationDetail;
*/
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { legislationAPI, feedbackAPI, dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, Building2, ExternalLink, BarChart3 } from 'lucide-react';

const LegislationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [legislation, setLegislation] = useState(null);
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [legResponse, statsResponse, feedbackResponse] = await Promise.all([
        legislationAPI.getById(id),
        dashboardAPI.getStats(id),
        feedbackAPI.getAll({ legislationId: id, limit: 5 })
      ]);

      setLegislation(legResponse.data);
      setStats(statsResponse.data);
      setFeedbacks(feedbackResponse.data.feedbacks || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!legislation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Legislation not found</p>
        <button
          onClick={() => navigate('/legislations')}
          className="mt-4 btn-primary"
        >
          Back to Legislations
        </button>
      </div>
    );
  }

  console.log('LegislationDetail - user:', user);
  console.log('LegislationDetail - user role:', user?.role);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/legislations')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Legislations
      </button>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(legislation.status)}`}>
            {legislation.status.replace('_', ' ').toUpperCase()}
          </span>
          {user && (user.role === 'admin' || user.role === 'analyst') && (
            <Link
              to={`/analytics/${id}`}
              className="btn-primary flex items-center gap-2"
            >
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {legislation.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{legislation.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(legislation.deadline)}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {legislation.description}
          </p>
        </div>

        {legislation.draftUrl && (
          <a
            href={legislation.draftUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="h-4 w-4" />
            View Draft Document
          </a>
        )}
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Feedbacks"
            value={stats.totalFeedbacks}
            color="blue"
          />
          <StatCard
            title="Positive"
            value={stats.sentimentDistribution?.positive || 0}
            color="green"
          />
          <StatCard
            title="Negative"
            value={stats.sentimentDistribution?.negative || 0}
            color="red"
          />
          <StatCard
            title="Neutral"
            value={stats.sentimentDistribution?.neutral || 0}
            color="gray"
          />
        </div>
      )}

      {/* Recent Feedbacks */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Feedbacks</h2>
          <Link
            to={`/analytics/${id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No feedbacks yet</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{feedback.submitterName}</p>
                    <p className="text-sm text-gray-500">{feedback.submitterEmail}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(feedback.submittedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  {feedback.commentText}
                </p>
                {feedback.provision && (
                  <p className="text-xs text-gray-500 mt-2">
                    📋 {feedback.provision}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">Submit Your Feedback</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your thoughts and suggestions on this draft legislation
        </p>
        <Link
          to={`/submit-feedback?legislationId=${id}`}
          className="btn-primary inline-block"
        >
          Submit Feedback
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600',
  };

  return (
    <div className="card">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
};

export default LegislationDetail;
