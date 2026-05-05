import React, { useState } from "react";
import axios from "axios";

function BoardManagement({ project, onBoardsUpdate, onClose }) {
  const [boards, setBoards] = useState(project.boards || []);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddBoard = async () => {
    if (!newBoardName.trim()) {
      setErrors({ name: "Board name is required" });
      return;
    }

    if (newBoardName.trim().length < 2) {
      setErrors({ name: "Board name must be at least 2 characters" });
      return;
    }

    if (boards.some(board => board.name.toLowerCase() === newBoardName.trim().toLowerCase())) {
      setErrors({ name: "Board already exists" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/projects/${project._id}`,
        {
          ...project,
          boards: [...boards, {
            name: newBoardName.trim(),
            color: "#" + Math.floor(Math.random()*16777215).toString(16),
            createdAt: new Date()
          }]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBoards(response.data.project.boards);
      onBoardsUpdate(response.data.project.boards);
      setNewBoardName("");
      setErrors({});
    } catch (error) {
      console.error("Error adding board:", error);
      setErrors({ submit: "Failed to add board" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (boardName) => {
    if (!window.confirm(`Are you sure you want to delete the "${boardName}" board?`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/projects/${project._id}`,
        {
          ...project,
          boards: boards.filter(board => board.name !== boardName)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBoards(response.data.project.boards);
      onBoardsUpdate(response.data.project.boards);
    } catch (error) {
      console.error("Error deleting board:", error);
      setErrors({ submit: "Failed to delete board" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddBoard();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Manage Boards</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add New Board */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Board</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => {
                setNewBoardName(e.target.value);
                setErrors({});
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter board name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleAddBoard}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Board"}
            </button>
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Current Boards */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Current Boards</h3>
          <div className="space-y-2">
            {boards.map((board) => (
              <div
                key={board.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: board.color }}
                  />
                  <span className="font-medium text-gray-900">{board.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteBoard(board.name)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {boards.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No boards yet. Create your first board above!</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardManagement;
