import React, { useState } from 'react';
import axios from 'axios';

function CollaboratorManager({ project, onProjectUpdate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/projects/${project._id}/collaborators`,
        { email: email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onProjectUpdate) {
        onProjectUpdate(response.data.project);
      }
      
      setEmail('');
    } catch (error) {
      console.error('Error adding collaborator:', error);
      setError(error.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorEmail) => {
    if (!window.confirm(`Remove ${collaboratorEmail} from collaborators?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/api/projects/${project._id}/collaborators/${encodeURIComponent(collaboratorEmail)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onProjectUpdate) {
        onProjectUpdate(response.data.project);
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
      alert(error.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>
      
      {/* Add Collaborator Form */}
      <form onSubmit={handleAddCollaborator} className="mb-6">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
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

      {/* Collaborators List */}
      <div className="space-y-2">
        {project.collaborators?.length > 0 ? (
          project.collaborators.map((collaborator, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {collaborator.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{collaborator}</p>
                  <p className="text-xs text-gray-500">Collaborator</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveCollaborator(collaborator)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="Remove collaborator"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            No collaborators added yet
          </p>
        )}
      </div>
    </div>
  );
}

export default CollaboratorManager;
