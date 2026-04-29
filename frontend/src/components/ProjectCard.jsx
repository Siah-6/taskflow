import React from "react";
import ProjectDropdownMenu from "./ProjectDropdownMenu";

function ProjectCard({ project, onClick, onRename, onDelete }) {
  const memberCount = 1 + (project.collaboratorUsers?.length || 0); // Owner + collaborators

  return (
    <div className="group">
      <div
        onClick={() => onClick(project)}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
      >
        <div className="space-y-4">
          {/* Project Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              {project.owner && 
               project.owner._id !== JSON.parse(atob(localStorage.getItem("token").split('.')[1])).userId && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  Shared
                </span>
              )}
            </div>
            
            {/* 3-Dot Menu */}
            <div className="relative">
              <ProjectDropdownMenu
                project={project}
                onRename={onRename}
                onDelete={onDelete}
              />
            </div>
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
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
