import React from 'react';

function ProjectFilters({ priorityFilter, sortBy, onPriorityChange, onSortChange }) {
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' }
  ];

  return (
    <div className="flex gap-6 mb-6">
      {/* Filter by Priority */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Priority
        </label>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProjectFilters;
