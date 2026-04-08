import React, { useState } from "react";

function SearchAnalytics({ isVisible, onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem("taskSearchAnalytics");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error loading analytics:", error);
      }
    }
    return {
      searchesToday: 0,
      topQueries: [],
      searchTrends: [],
    };
  });

  const clearAnalytics = () => {
    setAnalytics({
      searchesToday: 0,
      topQueries: [],
      searchTrends: [],
    });
    localStorage.removeItem("taskSearchAnalytics");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.searchesToday}
            </div>
            <div className="text-sm text-blue-700">Searches Today</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analytics.topQueries.length}
            </div>
            <div className="text-sm text-green-700">Unique Queries</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.topQueries[0]?.count || 0}
            </div>
            <div className="text-sm text-purple-700">Top Query Count</div>
          </div>
        </div>

        {/* Top Queries */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Top Search Queries
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {analytics.topQueries.length > 0 ? (
            <div className="space-y-2">
              {analytics.topQueries
                .slice(0, showDetails ? 10 : 5)
                .map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {query.query}
                      </div>
                      {showDetails && (
                        <div className="text-sm text-gray-500">
                          Last searched:{" "}
                          {new Date(query.lastSearched).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {query.count} searches
                      </span>
                      <div className="text-sm text-gray-500">#{index + 1}</div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No search data available yet
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (
                confirm("Are you sure you want to clear all search analytics?")
              ) {
                clearAnalytics();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear Analytics
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchAnalytics;
