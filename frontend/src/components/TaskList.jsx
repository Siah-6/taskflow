import TaskItem from "./TaskItem";

function TaskList({ tasks, loading, onUpdateTask, onDeleteTask, onRefresh }) {
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

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter(
    (task) => task.status === "Completed" || task.status === "Done",
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* To Do Column */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">To Do</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {todoTasks.length}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2 min-h-[500px] bg-gray-50/50">
          {todoTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
          {todoTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-xs">
              No tasks
            </div>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">In Progress</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              {inProgressTasks.length}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2 min-h-[500px] bg-gray-50/50">
          {inProgressTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
          {inProgressTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-xs">
              No tasks
            </div>
          )}
        </div>
      </div>

      {/* Done Column */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Done</h3>
            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded-full">
              {doneTasks.length}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2 min-h-[500px] bg-gray-50/50">
          {doneTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
          {doneTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-xs">
              No tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
