import React, { useState, useEffect } from "react";
import axios from "axios";

function TaskFilters({ filters, onFiltersChange, projects }) {
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = ["all", "To Do", "In Progress", "Completed", "Done"];
  const priorityOptions = ["all", "Low", "Medium", "High"];
  const sortOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "title", label: "Title" }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleFilterChange("search", value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleDateChange = (type, value) => {
    if (type === "from") {
      setDateFrom(value);
      handleFilterChange("dateFrom", value);
    } else {
      setDateTo(value);
      handleFilterChange("dateTo", value);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      status: "all",
      priority: "all",
      project: "all",
      board: "all",
      search: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt",
      sortOrder: "desc"
    };
    
    setDateFrom("");
    setDateTo("");
    setSearchTerm("");
    onFiltersChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.priority && filters.priority !== "all") count++;
    if (filters.project && filters.project !== "all") count++;
    if (filters.board && filters.board !== "all") count++;
    if (filters.search) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearchChange(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || "all"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Statuses" : status}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority || "all"}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority === "all" ? "All Priorities" : priority}
              </option>
            ))}
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            value={filters.project || "all"}
            onChange={(e) => handleFilterChange("project", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy || "createdAt"}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.sortOrder || "desc"}
              onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <svg
            className={`w-4 h-4 transform transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {showAdvanced ? "Hide" : "Show"} Advanced Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleDateChange("from", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleDateChange("to", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Board Filter (if project selected) */}
            {filters.project && filters.project !== "all" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Board
                </label>
                <select
                  value={filters.board || "all"}
                  onChange={(e) => handleFilterChange("board", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Boards</option>
                  {projects
                    .find((p) => p._id === filters.project)
                    ?.boards?.map((board, index) => (
                      <option key={index} value={board.name}>
                        {board.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskFilters;
