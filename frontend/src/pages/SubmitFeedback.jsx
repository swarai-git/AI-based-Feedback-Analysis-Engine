import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { legislationAPI, uploadAPI } from '../services/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

const SubmitFeedback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('legislationId');

  const [legislations, setLegislations] = useState([]);
  const [formData, setFormData] = useState({
    legislationId: preselectedId || '',
    submitterName: '',
    submitterEmail: '',
    commentText: '',
    provision: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLegislations();
  }, []);

  const fetchLegislations = async () => {
    try {
      const response = await legislationAPI.getAll({ status: 'open' });
      setLegislations(response.data.legislations || []);
    } catch (error) {
      console.error('Error fetching legislations:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await uploadAPI.uploadSingle(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        legislationId: preselectedId || '',
        submitterName: '',
        submitterEmail: '',
        commentText: '',
        provision: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/legislation/${formData.legislationId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Feedback Submitted Successfully!
            </h2>
            <p className="text-green-700 mb-4">
              Thank you for your valuable feedback. Your input will help improve the legislation.
            </p>
            <p className="text-sm text-green-600">
              Redirecting to legislation page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit Feedback
        </h1>
        <p className="text-gray-600">
          Share your thoughts and suggestions on draft legislations
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Select Legislation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Legislation *
            </label>
            <select
              name="legislationId"
              value={formData.legislationId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">-- Select Legislation --</option>
              {legislations.map((leg) => (
                <option key={leg._id} value={leg._id}>
                  {leg.title}
                </option>
              ))}
            </select>
          </div>

          {/* Your Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              name="submitterName"
              value={formData.submitterName}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="submitterEmail"
              value={formData.submitterEmail}
              onChange={handleChange}
              className="input-field"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Provision/Section (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provision/Section (Optional)
            </label>
            <input
              type="text"
              name="provision"
              value={formData.provision}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Section 4, Article 2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Specify the section or provision your feedback relates to
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback *
            </label>
            <textarea
              name="commentText"
              value={formData.commentText}
              onChange={handleChange}
              className="input-field"
              rows={8}
              placeholder="Share your detailed feedback, suggestions, or concerns..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters. Be specific and constructive.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.commentText.length < 10}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for Good Feedback</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific about which section or provision you're commenting on</li>
          <li>• Provide clear reasoning for your suggestions</li>
          <li>• Support your points with examples when possible</li>
          <li>• Keep your feedback constructive and respectful</li>
        </ul>
      </div>
    </div>
  );
};

export default SubmitFeedback;