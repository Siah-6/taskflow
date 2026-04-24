import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Sidebar({ onCreateProject }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleProjectClick = (project) => {
    navigate(`/projects/${project._id}`);
  };

  const handleCreateProject = () => {
    if (onCreateProject) {
      onCreateProject();
    }
  };

  const isActive = (path) => location.pathname === path;
  
  const isProjectActive = (projectId) => location.pathname === `/projects/${projectId}`;

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 flex flex-col border-r border-gray-200">
      {/* Brand */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </div>
          </button>

          <button
            className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </div>
          </button>
        </div>

        {/* Projects Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 
              onClick={() => handleNavigation("/projects")}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
            >
              PROJECTS
            </h3>
            <button
              onClick={handleCreateProject}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Create new project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="space-y-1">
            {loading ? (
              <div className="px-3 py-2 text-gray-500 text-sm">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">No projects yet</div>
            ) : (
              projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => handleProjectClick(project)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    isProjectActive(project._id)
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.boards?.[0]?.color || "#3B82F6" }}
                    />
                    <span className="truncate">{project.name}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors text-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
