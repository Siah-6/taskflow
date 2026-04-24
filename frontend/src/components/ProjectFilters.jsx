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
    <div className="flex gap-4 mb-4">
      {/* Filter by Priority */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Filter by Priority
        </label>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full h-8 px-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent bg-white text-xs"
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
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full h-8 px-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent bg-white text-xs"
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
