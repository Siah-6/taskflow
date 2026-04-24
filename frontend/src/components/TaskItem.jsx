import { useState } from "react";
import TaskModal from "./TaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  // Debug logging
  console.log("=== TASK ITEM DEBUG ===");
  console.log("task data:", task);
  console.log("task.dueDate:", task.dueDate);
  console.log("==================");

  const [isDragging, setIsDragging] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusOptions = ["To Do", "In Progress", "Completed"];
  const priorityOptions = ["Low", "Medium", "High"];

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleUpdateTask = (taskData) => {
    // Sync board with status to ensure task appears in correct column
    const updatedData = {
      ...taskData,
      board: taskData.status, // Update board to match status
    };
    onUpdateTask(task._id, updatedData);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(task._id);
    }
  };

  const handleCardClick = (e) => {
    // Prevent opening modal if clicking on action buttons or if dragging
    if (e.target.closest('button') || isDragging) {
      return;
    }
    setShowDetailsModal(true);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task._id);
    e.dataTransfer.setData('taskStatus', task.status || task.board);
    
    // Add dragging styles
    e.target.style.opacity = '0.9';
    e.target.style.transform = 'scale(1.05) rotate(2deg)';
    e.target.style.zIndex = '1000';
    e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    e.target.style.transition = 'none'; // Disable transition during drag
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    // Reset styles
    e.target.style.opacity = '';
    e.target.style.transform = '';
    e.target.style.zIndex = '';
    e.target.style.boxShadow = '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-[#DCFCE7] text-[#16A34A] border-[#DCFCE7]";
      case "In Progress":
        return "bg-[#DBEAFE] text-[#2563EB] border-[#DBEAFE]";
      case "To Do":
        return "bg-[#E5E7EB] text-[#4B5563] border-[#E5E7EB]";
      default:
        return "bg-[#E5E7EB] text-[#4B5563] border-[#E5E7EB]";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]";
      case "Medium":
        return "bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]";
      case "Low":
        return "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]";
      default:
        return "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]";
    }
  };

  return (
    <div className="relative">
      {/* Task Card */}
      <div 
        className="bg-white border border-gray-200 rounded-[12px] p-4 hover:shadow-md transition-all duration-200 cursor-move shadow-sm hover:shadow-gray-200 hover:-translate-y-0.5"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleCardClick}
      >
        {/* Title */}
        <h4 className="text-sm font-medium text-gray-900 leading-tight mb-2">
          {task.title}
        </h4>

        {/* Badges Row */}
        <div className="flex items-center gap-1.5 mb-3">
          {/* Status Badge - Primary */}
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(
              task.status,
            )}`}
          >
            {task.status}
          </span>
          
          {/* Priority Badge - Secondary */}
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border opacity-70 ${getPriorityColor(
              task.priority || "Medium",
            )}`}
          >
            {task.priority || "Medium"}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          </div>
        )}

        {/* Due Date - Bottom Only */}
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
          <span className="text-xs text-gray-400">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }) : 'No due date'}
          </span>
        </div>

        {/* Action Buttons */}
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

      {/* Edit Modal */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateTask}
        initialData={task}
        hideProjectField={true}
      />

      {/* Details Modal */}
      <TaskDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        task={task}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default TaskItem;
