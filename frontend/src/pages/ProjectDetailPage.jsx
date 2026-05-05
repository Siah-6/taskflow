import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import BoardManagement from "../components/BoardManagement";
import ProjectFilters from "../components/ProjectFilters";
import CollaboratorManager from "../components/CollaboratorManager";
import CreateProject from "../components/CreateProject";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showBoardManagement, setShowBoardManagement] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [currentUserId, setCurrentUserId] = useState('');

  // Get current user ID on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(tokenPayload.userId);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch project
        const projectResponse = await axiosInstance.get(
          `/projects/${projectId}`
        );
        console.log('Project data in Project Detail:', projectResponse.data);
        setProject(projectResponse.data);

        // Fetch tasks for this project only (no filters needed for project detail page)
        const tasksResponse = await axiosInstance.get(
          `/tasks?project=${projectId}`
        );
        
        setTasks(tasksResponse.data);
        setError("");
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axiosInstance.post(
        "/tasks",
        taskData
      );

      setTasks([response.data.task || response.data, ...tasks]);
      setError("");
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}`, updates);

      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, ...updates } : task,
        ),
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  // Filter and sort tasks
  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    // Filter by priority
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (sortBy === 'dueDate') {
        // Handle null/undefined due dates
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1; // Tasks without due dates go last
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        const aPriority = priorityOrder[a.priority] || 3;
        const bPriority = priorityOrder[b.priority] || 3;
        return aPriority - bPriority;
      }
      return 0;
    });

    return sortedTasks;
  };

  const handleBoardsUpdate = (newBoards) => {
    setProject((prev) => ({ ...prev, boards: newBoards }));
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
  };

  const handleCreateProjectClose = () => {
    setShowCreateProject(false);
  };

  const handleCreateProjectSuccess = (newProject) => {
    setShowCreateProject(false);
    // Optionally navigate to the new project or refresh
    // For now, just close the modal
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Project
          </h3>
          <p className="text-gray-600 mb-4">{error || "Project not found"}</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                  {getFilteredAndSortedTasks().length} {getFilteredAndSortedTasks().length === 1 ? "task" : "tasks"}
                </span>
              </div>
              {project.description && (
                <p className="text-gray-600 mb-3">{project.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{1 + (project.collaboratorUsers?.length || 0)} {1 + (project.collaboratorUsers?.length || 0) === 1 ? 'member' : 'members'}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateProject(true)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Project
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 bg-[#6F00FF] hover:bg-[#5a00cc] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Collaborator Management */}
        <div className="mb-6">
          <CollaboratorManager 
            project={project} 
            onProjectUpdate={handleProjectUpdate} 
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        
        {/* Project Filters */}
        <div className="mb-4">
          <ProjectFilters
            priorityFilter={priorityFilter}
            sortBy={sortBy}
            onPriorityChange={setPriorityFilter}
            onSortChange={setSortBy}
          />
        </div>

        {/* Task List with Dynamic Boards */}
        <TaskList
          tasks={getFilteredAndSortedTasks()}
          loading={false}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          boards={project.boards}
        />

        {/* Create Project Modal */}
        {showCreateProject && (
          <CreateProject
            onClose={handleCreateProjectClose}
            onSuccess={handleCreateProjectSuccess}
          />
        )}

        {/* Board Management Modal */}
        {showBoardManagement && (
          <BoardManagement
            project={project}
            onBoardsUpdate={handleBoardsUpdate}
            onClose={() => setShowBoardManagement(false)}
          />
        )}

        {/* Task Creation Modal */}
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          projectId={projectId}
        />
      </div>
    </div>
  );
}

export default ProjectDetailPage;
