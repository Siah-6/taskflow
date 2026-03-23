import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

function TaskPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
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
      setTasks([response.data.task, ...tasks]);
      setShowForm(false);
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-slate-600">Manage your tasks efficiently</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create Task
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {error && <div className="alert-error mb-6">{error}</div>}

        {showForm && (
          <div className="card p-6 mb-6">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="card p-6">
          <TaskList
            tasks={tasks}
            loading={loading}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onRefresh={fetchTasks}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
