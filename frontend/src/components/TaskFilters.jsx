import React, { useState } from "react";
import MultiSelect from "./MultiSelect";
import FilterPresets from "./FilterPresets";
import RealTimeSearch from "./RealTimeSearch";
import SearchAnalytics from "./SearchAnalytics";

function TaskFilters({ filters, onFiltersChange, projects, tasks = [] }) {
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const statusOptions = [
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "High", label: "High Priority" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "title", label: "Title" },
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (field, value) => {
    if (field === "search") {
      handleFilterChange("search", value);
    } else {
      handleFilterChange(field, value);
    }
  };

  const handleDateChange = (field, value) => {
    if (field === "dateFrom") {
      setDateFrom(value);
      handleFilterChange("dateFrom", value);
    } else if (field === "dateTo") {
      setDateTo(value);
      handleFilterChange("dateTo", value);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: "",
      status: [],
      priority: [],
      project: "",
      board: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    setDateFrom("");
    setDateTo("");
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {/* Search Bar and Presets */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <RealTimeSearch
            onSearch={handleSearchChange}
            initialValue={filters.search || ""}
            placeholder="Search tasks..."
          />
        </div>

        <FilterPresets filters={filters} onFiltersChange={onFiltersChange} />

        {/* Analytics Button */}
        <button
          onClick={() => setShowAnalytics(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Analytics
        </button>
      </div>

      {/* Search Analytics Modal */}
      <SearchAnalytics
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Status Filter */}
        <MultiSelect
          options={statusOptions}
          selectedValues={filters.status || []}
          onChange={(values) => handleFilterChange("status", values)}
          placeholder="All Statuses"
          label="Status"
        />

        {/* Priority Filter */}
        <MultiSelect
          options={priorityOptions}
          selectedValues={filters.priority || []}
          onChange={(values) => handleFilterChange("priority", values)}
          placeholder="All Priorities"
          label="Priority"
        />

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
        </button>

        <button
          onClick={resetFilters}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Reset All Filters
        </button>
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
                  onChange={(e) => handleDateChange("dateFrom", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleDateChange("dateTo", e.target.value)}
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
