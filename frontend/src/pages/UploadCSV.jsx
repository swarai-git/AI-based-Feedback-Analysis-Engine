import { useState, useEffect } from 'react';
import { legislationAPI, uploadAPI } from '../services/api';
import { Upload, Download, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';

const UploadCSV = () => {
  const [legislations, setLegislations] = useState([]);
  const [selectedLegislation, setSelectedLegislation] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedLegislation) {
      setError('Please select both a legislation and a file');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('legislationId', selectedLegislation);

    try {
      const response = await uploadAPI.uploadCSV(formData);
      setResult(response.data);
      setFile(null);
      setSelectedLegislation('');
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await uploadAPI.downloadTemplate();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'feedback_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Feedback CSV
        </h1>
        <p className="text-gray-600">
          Bulk upload feedback data from CSV files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-900">
                  Upload Successful!
                </h3>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <p>📊 Total Rows: {result.totalRows}</p>
                <p>✅ Successfully Imported: {result.successfulImports}</p>
                {result.failedImports > 0 && (
                  <p>❌ Failed: {result.failedImports}</p>
                )}
              </div>
              {result.errors && result.errors.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-green-900">
                    View Errors
                  </summary>
                  <div className="mt-2 space-y-1 text-xs">
                    {result.errors.slice(0, 5).map((err, idx) => (
                      <p key={idx} className="text-red-600">• {err.error}</p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}

          {/* Upload Card */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Upload Feedback Data
            </h2>

            {/* Select Legislation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Legislation *
              </label>
              <select
                value={selectedLegislation}
                onChange={(e) => setSelectedLegislation(e.target.value)}
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

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV File *
              </label>
              
              {!file ? (
                <label
                  htmlFor="file-input"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV file (Max 10MB)</p>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || !file || !selectedLegislation}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload CSV File
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar - Instructions */}
        <div className="space-y-6">
          {/* Download Template */}
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">📥 CSV Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download the sample CSV template to see the required format
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </button>
          </div>

          {/* Instructions */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">📋 CSV Format</h3>
            <p className="text-sm text-gray-600 mb-3">
              Your CSV file should include these columns:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>submitterName</strong> (required)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>submitterEmail</strong> (required)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>commentText</strong> (required)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>provision</strong> (optional)</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="card bg-yellow-50 border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use UTF-8 encoding</li>
              <li>• Max file size: 10MB</li>
              <li>• Validate emails correctly</li>
              <li>• Remove empty rows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;