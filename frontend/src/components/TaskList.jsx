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
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks yet</h3>
        <p className="text-slate-600">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          All Tasks ({tasks.length})
        </h2>
        <button
          onClick={onRefresh}
          className="btn-secondary text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
