import React, { useState } from "react";

function FilterPresets({ filters, onFiltersChange }) {
  const [showPresets, setShowPresets] = useState(false);
  const [customPresetName, setCustomPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState(() => {
    const saved = localStorage.getItem("taskFilterPresets");
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: "Today's Tasks",
            filters: {
              status: "To Do",
              priority: "all",
              project: "all",
              board: "all",
              search: "",
              dateFrom: new Date().toISOString().split("T")[0],
              dateTo: new Date().toISOString().split("T")[0],
              sortBy: "createdAt",
              sortOrder: "desc",
            },
          },
          {
            name: "High Priority",
            filters: {
              status: "all",
              priority: "High",
              project: "all",
              board: "all",
              search: "",
              dateFrom: "",
              dateTo: "",
              sortBy: "priority",
              sortOrder: "asc",
            },
          },
          {
            name: "Completed This Week",
            filters: {
              status: "Completed",
              priority: "all",
              project: "all",
              board: "all",
              search: "",
              dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              dateTo: new Date().toISOString().split("T")[0],
              sortBy: "createdAt",
              sortOrder: "desc",
            },
          },
          {
            name: "All In Progress",
            filters: {
              status: "In Progress",
              priority: "all",
              project: "all",
              board: "all",
              search: "",
              dateFrom: "",
              dateTo: "",
              sortBy: "createdAt",
              sortOrder: "desc",
            },
          },
        ];
  });

  const applyPreset = (preset) => {
    onFiltersChange(preset.filters);
    setShowPresets(false);
  };

  const saveCustomPreset = () => {
    if (!customPresetName.trim()) return;

    const newPreset = {
      name: customPresetName.trim(),
      filters: { ...filters },
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem("taskFilterPresets", JSON.stringify(updatedPresets));
    setCustomPresetName("");
    setShowPresets(false);
  };

  const deletePreset = (index) => {
    const updatedPresets = savedPresets.filter((_, i) => i !== index);
    setSavedPresets(updatedPresets);
    localStorage.setItem("taskFilterPresets", JSON.stringify(updatedPresets));
  };

  const getCurrentPresetName = () => {
    const matchingPreset = savedPresets.find((preset) => {
      return JSON.stringify(preset.filters) === JSON.stringify(filters);
    });
    return matchingPreset?.name || "Custom";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPresets(!showPresets)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        <span className="text-sm font-medium">{getCurrentPresetName()}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${showPresets ? "rotate-180" : ""}`}
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
      </button>

      {showPresets && (
        <div className="absolute z-20 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Filter Presets
            </h3>

            {/* Save Current Filter */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Preset name..."
                value={customPresetName}
                onChange={(e) => setCustomPresetName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button
                onClick={saveCustomPreset}
                disabled={!customPresetName.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                Save
              </button>
            </div>
          </div>

          {/* Preset List */}
          <div className="max-h-64 overflow-y-auto">
            {savedPresets.map((preset, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <button
                  onClick={() => applyPreset(preset)}
                  className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.filters.status !== "all" &&
                      `${preset.filters.status} • `}
                    {preset.filters.priority !== "all" &&
                      `${preset.filters.priority} • `}
                    {preset.filters.dateFrom && `Date range • `}
                    {preset.filters.search && `Search`}
                  </div>
                </button>

                {index >= 4 && (
                  <button
                    onClick={() => deletePreset(index)}
                    className="ml-2 p-1 text-red-500 hover:text-red-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPresets;
