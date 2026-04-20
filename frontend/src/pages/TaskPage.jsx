import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";

function TaskPage({ selectedProject }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState("");

  // Enhanced filters state
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    project: "all",
    board: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Update filters when selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      setFilters(prev => ({
        ...prev,
        project: selectedProject._id
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        project: "all"
      }));
    }
  }, [selectedProject]);

  const fetchTasks = useCallback(async () => {
    let loadingTimeout;
    try {
      setLoading(true);
      console.log("Fetching tasks...");
      console.log("Token:", token ? "exists" : "missing");
      console.log("Filters:", filters);

      // Force loading to stop after 10 seconds
      loadingTimeout = setTimeout(() => {
        console.log("Forcing loading to stop due to timeout");
        setLoading(false);
        setError(
          "Request timed out. Please check your connection and try again.",
        );
      }, 10000);

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value &&
          value !== "all" &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const url = `http://localhost:5000/api/tasks?${queryParams.toString()}`;
      console.log("Fetching from URL:", url);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Tasks response:", response.data);
      setTasks(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      console.error("Error response:", error.response?.data);
      setError(
        "Failed to fetch tasks: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      console.log("Setting loading to false");
      setLoading(false);
    }
  }, [token, filters]);

  // Fetch projects for filter dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects...");
        const token = localStorage.getItem("token");
        console.log("Token:", token ? "exists" : "missing");

        const response = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Projects response:", response.data);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        console.error("Error response:", error.response?.data);
        setError(
          "Failed to fetch projects: " +
            (error.response?.data?.message || error.message),
        );
        setProjects([]); // Add this line to set projects to an empty array on error
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [token, navigate, fetchTasks]);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks([response.data, ...tasks]);
      setShowForm(false);
      setNotification("Task created successfully!");
      setTimeout(() => setNotification(""), 3000);
      setError("");
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId, updateData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task)),
      );
      setError("");
    } catch (error) {
      console.error("Error updating task:", error);
      setError(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      setError("");
    } catch (error) {
      console.error("Error deleting task:", error);
      setError(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-taskflow-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {selectedProject ? selectedProject.name : "My Tasks"}
            </h1>
            <p className="text-slate-600">
              {selectedProject 
                ? `Manage tasks for ${selectedProject.name}` 
                : "Manage your tasks efficiently"
              }
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/projects")}
              className="btn-secondary"
            >
              Projects
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create Task
            </button>
          </div>
        </div>

        {error && <div className="alert-error mb-6">{error}</div>}

        {/* Success Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            {notification}
          </div>
        )}

        {/* Enhanced Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          projects={projects}
          tasks={tasks}
        />

        {showForm && (
          <div className="card p-6 mb-6">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Tasks{" "}
              {tasks.length > 0 && (
                <span className="text-slate-500">({tasks.length})</span>
              )}
            </h2>
          </div>

          <TaskList
            tasks={tasks}
            loading={loading}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onRefresh={fetchTasks}
            boards={[
              { name: "To Do", color: "#6B7280" },
              { name: "In Progress", color: "#3B82F6" },
              { name: "Completed", color: "#10B981" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
