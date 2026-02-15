import { useState } from 'react';
import { analysisAPI } from '../services/api';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EmailAlerts = ({ legislationId, duplicateGroups }) => {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  const sendDailyDigest = async () => {
    try {
      setSending(true);
      setMessage(null);
      
      await analysisAPI.sendDailyDigest({ legislationId });
      
      setMessage({
        type: 'success',
        text: 'Daily digest sent successfully!'
      });
    } catch (error) {
      console.error('Error sending digest:', error);
      setMessage({
        type: 'error',
        text: 'Failed to send digest'
      });
    } finally {
      setSending(false);
    }
  };

  const sendDuplicateAlert = async (group) => {
    if (group.similar.length === 0) return;

    try {
      setSending(true);
      setMessage(null);
      
      await analysisAPI.sendDuplicateAlert({
        originalFeedbackId: group.representative._id,
        duplicateFeedbackId: group.similar[0]._id,
        legislationId: legislationId
      });
      
      setMessage({
        type: 'success',
        text: 'Duplicate alert sent!'
      });
    } catch (error) {
      console.error('Error sending alert:', error);
      setMessage({
        type: 'error',
        text: 'Failed to send alert'
      });
    } finally {
      setSending(false);
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Email Alerts
        </h3>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={sendDailyDigest}
          disabled={sending}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          {sending ? 'Sending...' : 'Send Daily Digest'}
        </button>

        <p className="text-xs text-gray-500">
          Send a summary of all duplicate groups to administrators
        </p>
      </div>
    </div>
  );
};

export default EmailAlerts;