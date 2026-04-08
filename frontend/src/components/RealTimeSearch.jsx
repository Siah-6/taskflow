import React, { useState, useEffect, useRef, useCallback } from "react";

function RealTimeSearch({
  onSearch,
  placeholder = "Search tasks...",
  initialValue = "",
  debounceMs = 300,
  maxRecentSearches = 5,
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("taskRecentSearches");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (error) {
        console.error("Error loading recent searches:", error);
        return [];
      }
    }
    return [];
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search
  const debouncedSearch = useCallback(
    (value) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setIsSearching(true);
        onSearch("search", value);
        setIsSearching(false);
      }, debounceMs);
    },
    [onSearch, debounceMs],
  );

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);

    // Show suggestions if user starts typing
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Save to recent searches
      const updated = [
        searchTerm.trim(),
        ...recentSearches.filter((s) => s !== searchTerm.trim()),
      ].slice(0, maxRecentSearches);
      setRecentSearches(updated);
      localStorage.setItem("taskRecentSearches", JSON.stringify(updated));

      debouncedSearch(searchTerm.trim());
      setShowSuggestions(false);
    }
    inputRef.current?.focus();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    debouncedSearch(suggestion);
    setShowSuggestions(false);

    // Update recent searches
    const updated = [
      suggestion,
      ...recentSearches.filter((s) => s !== suggestion),
    ].slice(0, maxRecentSearches);
    setRecentSearches(updated);
    localStorage.setItem("taskRecentSearches", JSON.stringify(updated));

    inputRef.current?.focus();
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    debouncedSearch("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("taskRecentSearches");
    setShowSuggestions(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Search Icon */}
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
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
          )}

          {/* Loading Indicator */}
          {isSearching && (
            <div className="absolute right-10 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && recentSearches.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Recent Searches */}
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-500">
                Recent Searches
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            </div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RealTimeSearch;
