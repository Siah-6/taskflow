import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import BoardManagement from "../components/BoardManagement";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showBoardManagement, setShowBoardManagement] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch project
        const projectResponse = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProject(projectResponse.data);

        // Fetch tasks
        const tasksResponse = await axios.get(
          "http://localhost:5000/api/tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Filter tasks for this project
        const projectTasks = tasksResponse.data.filter(
          (task) => task.project && task.project._id === projectId,
        );
        setTasks(projectTasks);
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          ...taskData,
          project: projectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTasks([response.data.task, ...tasks]);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  const handleBoardsUpdate = (newBoards) => {
    setProject((prev) => ({ ...prev, boards: newBoards }));
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
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
                <span>{project.members?.length || 1} members</span>
                <span>•</span>
                <span>{project.boards?.length || 0} boards</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBoardManagement(true)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Manage Boards
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Task Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Task List with Dynamic Boards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <TaskList
            tasks={tasks}
            loading={false}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            boards={project.boards}
          />
        </div>

        {/* Board Management Modal */}
        {showBoardManagement && (
          <BoardManagement
            project={project}
            onBoardsUpdate={handleBoardsUpdate}
            onClose={() => setShowBoardManagement(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectDetailPage;
