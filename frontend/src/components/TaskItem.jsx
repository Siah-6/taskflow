import { useState } from "react";

function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority || "Medium",
  });

  const statusOptions = ["To Do", "In Progress", "Completed"];
  const priorityOptions = ["Low", "Medium", "High"];

  const handleStatusChange = (newStatus) => {
    onUpdateTask(task._id, { status: newStatus });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || "Medium",
    });
  };

  const handleSave = () => {
    onUpdateTask(task._id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || "Medium",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(task._id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="input-field"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="input-field"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData({ ...editData, priority: e.target.value })
              }
              className="input-field"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary">
              Save
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-slate-600 mb-3">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority || "Medium")}`}
              >
                {task.priority || "Medium"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-taskflow-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
