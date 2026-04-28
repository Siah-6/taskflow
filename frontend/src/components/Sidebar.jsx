import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ModalPortal from "./ModalPortal";

function Sidebar({ onCreateProject }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuProjectId, setOpenMenuProjectId] = useState(null);
  const [renameModalProject, setRenameModalProject] = useState(null);
  const [deleteModalProject, setDeleteModalProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    // Set current user ID
    const token = localStorage.getItem("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(tokenPayload.userId);
    }

    const fetchProjects = async () => {
      try {
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

  const handleMenuClick = (e, projectId) => {
    e.stopPropagation();
    setOpenMenuProjectId(openMenuProjectId === projectId ? null : projectId);
  };

  const handleRenameProject = (project) => {
    setRenameModalProject(project);
    setNewProjectName(project.name);
    setOpenMenuProjectId(null);
  };

  const handleDeleteProject = (project) => {
    setDeleteModalProject(project);
    setOpenMenuProjectId(null);
  };

  const handleSaveRename = async () => {
    if (renameModalProject && newProjectName.trim() && newProjectName !== renameModalProject.name) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:5000/api/projects/${renameModalProject._id}`,
          { name: newProjectName.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update project in local state with response data
        setProjects(projects.map(p => 
          p._id === renameModalProject._id ? response.data : p
        ));
        
        // Trigger a refresh of dashboard data
        window.dispatchEvent(new CustomEvent('projectUpdated', { 
          detail: { project: response.data } 
        }));
        
      } catch (error) {
        console.error('Error renaming project:', error);
        alert('Failed to rename project. Please try again.');
        return; // Don't close modal on error
      }
    }
    setRenameModalProject(null);
    setNewProjectName('');
  };

  const handleConfirmDelete = async () => {
    if (deleteModalProject) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/projects/${deleteModalProject._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Remove project from local state
        setProjects(projects.filter(p => p._id !== deleteModalProject._id));
        
        // If user is currently on the deleted project page, redirect to dashboard
        if (location.pathname === `/projects/${deleteModalProject._id}`) {
          navigate('/dashboard');
        }
        
        // Trigger a refresh of dashboard data by emitting a custom event
        window.dispatchEvent(new CustomEvent('projectDeleted', { 
          detail: { projectId: deleteModalProject._id } 
        }));
        
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
    setDeleteModalProject(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setRenameModalProject(null);
      setDeleteModalProject(null);
      setNewProjectName('');
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuProjectId(null);
    };

    if (openMenuProjectId) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openMenuProjectId]);

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
                <div
                  key={project._id}
                  className="group flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors text-sm hover:bg-gray-100 relative"
                >
                  {/* Left side: dot + project name */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.boards?.[0]?.color || "#3B82F6" }}
                    />
                    <span 
                      className="truncate cursor-pointer hover:text-gray-900"
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.name}
                    </span>
                    {project.owner && 
                     project.owner._id !== JSON.parse(atob(localStorage.getItem("token").split('.')[1])).userId && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        Shared
                      </span>
                    )}
                  </div>

                  {/* Right side: 3-dot button */}
                  <button
                    onClick={(e) => handleMenuClick(e, project._id)}
                    className="w-7 h-7 border-none bg-transparent rounded-md text-[#64748b] cursor-pointer hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    style={{ opacity: openMenuProjectId === project._id ? 1 : undefined }}
                    title="More options"
                  >
                    ⋮
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuProjectId === project._id && (
                    <div className="absolute right-2 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
                      {/* Only show rename/delete for project owners */}
                      {project.owner && project.owner._id === currentUserId && (
                        <>
                          <button
                            onClick={() => handleRenameProject(project)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Rename Project
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete Project
                          </button>
                        </>
                      )}
                      
                      {/* Show view-only message for collaborators */}
                      {project.owner && project.owner._id !== currentUserId && (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          View only
                        </div>
                      )}
                    </div>
                  )}
                </div>
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

      {/* Rename Project Modal */}
      {renameModalProject && (
        <ModalPortal>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            style={{ zIndex: 9999 }}
            onClick={handleBackdropClick}
          >
            <div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
              style={{ zIndex: 10000 }}
            >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Rename Project</h2>
            </div>
            <div className="px-6 py-4">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
                autoFocus
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setRenameModalProject(null);
                  setNewProjectName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRename}
                disabled={!newProjectName.trim() || newProjectName === renameModalProject.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Delete Project Modal */}
      {deleteModalProject && (
        <ModalPortal>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            style={{ zIndex: 9999 }}
            onClick={handleBackdropClick}
          >
            <div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
              style={{ zIndex: 10000 }}
            >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Delete Project</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">
                Are you sure you want to delete "{deleteModalProject.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalProject(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
}

export default Sidebar;
