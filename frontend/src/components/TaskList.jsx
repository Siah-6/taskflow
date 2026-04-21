import { useState } from "react";
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  loading,
  onUpdateTask,
  onDeleteTask,
  onRefresh,
  boards = [
    { name: "To Do", color: "#6B7280" },
    { name: "In Progress", color: "#3B82F6" },
    { name: "Done", color: "#10B981" },
  ],
}) {
  const [dragOverBoard, setDragOverBoard] = useState(null);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-taskflow-600 mb-4"></div>
        <p className="text-slate-600">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-slate-600">Create your first task to get started!</p>
      </div>
    );
  }

  // Group tasks by board
  const getTasksForBoard = (boardName) => {
    return tasks.filter((task) => {
      // First check if task has a board assigned
      if (task.board) {
        return task.board === boardName;
      }
      // Fall back to status if no board is assigned
      return task.status === boardName;
    });
  };

  const handleDragOver = (e, boardName) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverBoard(boardName);
  };

  const handleDragLeave = () => {
    setDragOverBoard(null);
  };

  const handleDrop = (e, boardName) => {
    e.preventDefault();
    setDragOverBoard(null);
    
    const taskId = e.dataTransfer.getData('taskId');
    const taskStatus = e.dataTransfer.getData('taskStatus');
    
    if (taskId && boardName !== taskStatus) {
      // Update task status locally
      onUpdateTask(taskId, { 
        status: boardName, 
        board: boardName 
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {boards.map((board) => {
        const boardTasks = getTasksForBoard(board.name);

        return (
          <div
            key={board.name}
            className={`bg-white rounded-lg border-2 transition-colors ${
              dragOverBoard === board.name 
                ? "border-blue-400 bg-blue-50" 
                : "border-gray-200"
            }`}
            onDragOver={(e) => handleDragOver(e, board.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, board.name)}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {board.name}
                </h3>
                <span
                  className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: board.color + "20",
                    color: board.color,
                  }}
                >
                  {boardTasks.length}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2 min-h-[500px] bg-gray-50/50">
              {boardTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-500">
                    No tasks in {board.name}
                  </p>
                </div>
              ) : (
                boardTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;
