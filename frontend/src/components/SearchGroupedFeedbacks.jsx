import { useState } from 'react';
import { analysisAPI } from '../services/api';
import { Search, X } from 'lucide-react';

const SearchGroupedFeedbacks = ({ legislationId, threshold }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await analysisAPI.searchGroupedFeedbacks(
        legislationId,
        query,
        threshold
      );
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setSearched(false);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Search Within Groups
      </h3>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for keywords, topics, or concerns..."
              className="input pl-10 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {searched && (
            <button
              type="button"
              onClick={clearSearch}
              className="btn-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results */}
      {searched && results && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Found <strong>{results.resultsCount}</strong> group(s) matching "{results.query}"
          </p>

          {results.resultsCount === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No matching groups found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.results.map((group, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {group.count} feedback{group.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {group.representative.commentText}
                  </p>
                  <div className="text-xs text-gray-500">
                    By: {group.representative.submitterName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchGroupedFeedbacks;