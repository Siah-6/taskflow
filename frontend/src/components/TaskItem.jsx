import { useState } from "react";

function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority || "Medium",
    project: task.project || "",
    dueDate: task.dueDate || "",
  });

  const statusOptions = ["To Do", "In Progress", "Completed"];
  const priorityOptions = ["Low", "Medium", "High"];

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || "Medium",
      project: task.project || "",
      dueDate: task.dueDate || "",
    });
  };

  const handleSave = () => {
    // Sync board with status to ensure task appears in correct column
    const updatedData = {
      ...editData,
      board: editData.status, // Update board to match status
    };
    onUpdateTask(task._id, updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || "Medium",
      project: task.project || "",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(task._id);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
    e.dataTransfer.setData('taskStatus', task.status);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
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
        <div 
          className="bg-white border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow cursor-move"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2">
            {/* Task Header */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-gray-900 leading-tight flex-1">
                {task.title}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${getPriorityColor(
                  task.priority || "Medium",
                )}`}
              >
                {task.priority || "Medium"}
              </span>
            </div>

            {/* Task Description */}
            {task.description && (
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Project Badge */}
            {task.project && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-xs text-gray-500">
                  {task.project.name || "Project"}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Task Footer */}
            <div className="flex items-center justify-between pt-1">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                  task.status,
                )}`}
              >
                {task.status}
              </span>

              <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  <svg
                    className="w-3 h-3"
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
