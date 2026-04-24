import React, { useState } from 'react';

function TaskDetailsModal({ isOpen, onClose, task, onEdit, onDelete }) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(task?.comments || []);

  if (!isOpen || !task) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment.trim(),
        author: 'Current User', // This would come from auth context
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date().setHours(0, 0, 0, 0);
  };

  const formatCommentTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-7 py-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {task.title}
              </h2>
              
              {/* Status and Priority */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border opacity-70 ${getPriorityColor(task.priority || 'Medium')}`}>
                  {task.priority || 'Medium'}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={onEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                title="Edit task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                title="Delete task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-7 py-6 space-y-6">
            {/* Description Section */}
            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            {/* Divider */}
            {(task.description) && <div className="border-t border-gray-100"></div>}

            {/* Meta Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Details</h3>
              
              {/* Due Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={`text-sm ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && (
                      <span className="ml-2 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Overdue</span>
                    )}
                  </span>
                </div>
                
                {/* Comments Count */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Activity & Comments Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Activity & Comments</h3>
              
              {/* Comments List */}
              {comments.length > 0 && (
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {getAvatarInitial(comment.author)}
                        </span>
                      </div>
                      
                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-400">{formatCommentTime(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">U</span>
                  </div>
                  
                  {/* Comment Input */}
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
