import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../lib/axios";
import ConfirmModal from './ConfirmModal';

function CollaboratorManager({ project, onProjectUpdate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [collaboratorToRemove, setCollaboratorToRemove] = useState(null);

  // Get current user info on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(tokenPayload.userId);
      
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setCurrentUserEmail(storedEmail.toLowerCase());
      }
    }
  }, []);

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post(
        `/projects/${project._id}/collaborators`,
        { email: email.trim() }
      );

      // Refetch full project details to get populated owner and collaborator data
      const projectResponse = await axiosInstance.get(`/projects/${project._id}`);
      if (onProjectUpdate && projectResponse.data) {
        onProjectUpdate(projectResponse.data);
      }
      
      // Clear email only on success
      setEmail('');
    } catch (error) {
      console.error('Error adding collaborator:', error);
      // Set error message from backend response
      const errorMessage = error.response?.data?.message || 'Failed to add collaborator';
      setError(errorMessage);
      
      // Do NOT update project state on error
      // Do NOT clear email on error so user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = (email) => {
    setCollaboratorToRemove(email);
    setShowRemoveModal(true);
  };

  const confirmRemoveCollaborator = async () => {
    try {
      await axiosInstance.delete(
        `/projects/${project._id}/collaborators/${encodeURIComponent(collaboratorToRemove)}`
      );

      // Refetch full project details to get populated owner and collaborator data
      const projectResponse = await axiosInstance.get(`/projects/${project._id}`);
      if (onProjectUpdate && projectResponse.data) {
        onProjectUpdate(projectResponse.data);
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
      alert(error.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  const isOwner = project.owner?._id === currentUserId || project.owner === currentUserId;

  // Debug logging to track owner detection
  console.log('CollaboratorManager Debug:', {
    currentUserId,
    projectOwnerId: project.owner?._id,
    isOwner,
    projectOwnerName: project.owner?.name,
    projectOwnerEmail: project.owner?.email
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>
      
      {/* Add Collaborator Form - Only for owners */}
      {isOwner && (
        <form onSubmit={handleAddCollaborator} className="mb-6">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear error when user starts typing
                if (error) {
                  setError('');
                }
              }}
              placeholder="Enter collaborator email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </form>
      )}

      {/* Non-owner message */}
      {!isOwner && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            Only the project owner can add collaborators.
          </p>
        </div>
      )}

      {/* Collaborators List */}
      <div className="space-y-2">
        {/* Owner */}
        {project.owner && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {project.owner.name?.charAt(0).toUpperCase() || project.owner.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {project.owner._id === currentUserId ? 'You' : (project.owner.name || 'Unknown')}
                </p>
                <p className="text-xs text-gray-500">{project.owner.email}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Owner
              </span>
            </div>
          </div>
        )}

        {/* Collaborators */}
        {project.collaboratorUsers?.length > 0 ? (
          project.collaboratorUsers.map((collaborator) => {
            const isCurrentUser = collaborator.email.toLowerCase() === currentUserEmail;
            const isOwner = project.owner?._id === currentUserId;
            
            return (
              <div
                key={collaborator._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {collaborator.name?.charAt(0).toUpperCase() || collaborator.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isCurrentUser ? 'You' : (collaborator.name || 'Unknown')}
                    </p>
                    <p className="text-xs text-gray-500">{collaborator.email}</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    Collaborator
                  </span>
                </div>
                {/* Remove button - only show for owners and not for current user */}
                {isOwner && !isCurrentUser && (
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator.email)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Remove collaborator"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })
        ) : (
          !project.owner && (
            <p className="text-center text-gray-500 py-4">
              No collaborators added yet
            </p>
          )
        )}
      </div>

      {/* Remove Collaborator Confirmation Modal */}
      <ConfirmModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={confirmRemoveCollaborator}
        title="Remove Collaborator"
        message={`Remove ${collaboratorToRemove} from collaborators?`}
        confirmText="Remove Collaborator"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </div>
  );
}

export default CollaboratorManager;
