import React from "react";

function ProjectCard({ project, onClick }) {
  const memberCount = project.members?.length || 1; // At least the owner

  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
    >
      <div className="space-y-4">
        {/* Project Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full group-hover:bg-blue-200 transition-colors">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>

        {/* Project Description */}
        {project.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Project Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {project.owner?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {project.owner?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
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
                d="M8 7V3m8 4v4m0 4v6m8-8H4"
              />
            </svg>
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Boards Preview */}
        <div className="flex gap-2 pt-2">
          {project.boards?.slice(0, 3).map((board, index) => (
            <div
              key={index}
              className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-600 border border-gray-200"
              style={{ borderColor: board.color + "30" }}
            >
              {board.name}
            </div>
          ))}
          {project.boards?.length > 3 && (
            <div className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-500 border border-gray-200">
              +{project.boards.length - 3} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
