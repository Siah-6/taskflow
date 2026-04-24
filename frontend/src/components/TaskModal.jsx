import React from 'react';
import TaskForm from './TaskForm';

function TaskModal({ isOpen, onClose, onSubmit, projectId }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (taskData) => {
    // Set the project ID when creating a task from project detail page
    const dataWithProject = {
      ...taskData,
      project: projectId || taskData.project
    };
    onSubmit(dataWithProject);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-7">
          <TaskForm 
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialData={{ project: projectId }}
            hideProjectField={!!projectId}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
