import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { legislationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, TrendingUp, Clock, CheckCircle, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [legislations, setLegislations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    underReview: 0,
  });

  useEffect(() => {
    fetchLegislations();
  }, []);

  const fetchLegislations = async () => {
    try {
      const response = await legislationAPI.getAll({ limit: 5 });
      setLegislations(response.data.legislations || []);
      
      // Calculate stats
      const all = response.data.legislations || [];
      setStats({
        total: all.length,
        open: all.filter(l => l.status === 'open').length,
        closed: all.filter(l => l.status === 'closed').length,
        underReview: all.filter(l => l.status === 'under_review').length,
      });
    } catch (error) {
      console.error('Error fetching legislations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to AI Feedback Analysis</h1>
        <p className="text-blue-100">
          Analyze and visualize public feedback on draft legislations with AI-powered insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Legislations"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Open for Feedback"
          value={stats.open}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Closed"
          value={stats.closed}
          icon={CheckCircle}
          color="red"
        />
      </div>

      {/* Recent Legislations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Legislations</h2>
          <Link 
            to="/legislations" 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {legislations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No legislations found</p>
            {user?.role === 'admin' && (
              <Link 
                to="/legislations" 
                className="mt-4 inline-block btn-primary"
              >
                Create New Legislation
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {legislations.map((legislation) => (
              <div
                key={legislation._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {legislation.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(legislation.status)}`}>
                        {legislation.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {legislation.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📋 {legislation.department}</span>
                      <span>📅 Deadline: {formatDate(legislation.deadline)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/legislation/${legislation._id}`}
                    className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
                
                {/* Add a clickable area for the entire card */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/legislation/${legislation._id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                  >
                    View Details & Analytics
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Based on Role */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          { user.role === 'viewer' && (
            <QuickAction
              title="Submit Feedback"
              description="Submit your feedback on draft legislations"
              link="/submit-feedback"
              icon="💬"
              color="blue"
            />
          )}
          {/*only admins can upload*/}
          {user.role === 'admin' && (
            <QuickAction
              title="Upload CSV"
              description="Bulk upload feedback data from CSV files"
              link="/upload-csv"
              icon="📤"
              color="green"
            />
          )}
          <QuickAction
            title="View Legislations"
            description="Browse all available draft legislations"
            link="/legislations"
            icon="📚"
            color="purple"
          />
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
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

// Quick Action Component
const QuickAction = ({ title, description, link, icon, color }) => {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    green: 'border-green-200 hover:border-green-400 hover:bg-green-50',
    purple: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50',
  };

  return (
    <Link
      to={link}
      className={`border-2 rounded-xl p-6 transition-all ${colorClasses[color]}`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
};

export default Dashboard;