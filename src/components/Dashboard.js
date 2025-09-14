import React, { useState } from 'react';

const Dashboard = ({ state, dispatch }) => {
  const [newBoardName, setNewBoardName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    dispatch({ type: 'CREATE_BOARD', payload: { name: newBoardName } });
    setNewBoardName('');
    setShowCreateModal(false);
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Delete this board?')) {
      dispatch({ type: 'DELETE_BOARD', payload: { boardId } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">Task Manager Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Organize your projects with boards and lists</p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm sm:text-base"
        >
          + Create New Board
        </button>
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-xl mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Board</h3>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter board name..."
              className="w-full px-3 sm:px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              autoFocus
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleCreateBoard} 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex-1 text-sm sm:text-base"
              >
                Create Board
              </button>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {state.boards.map(board => (
          <div key={board.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 break-words">{board.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              {board.lists ? board.lists.length : 0} lists
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => dispatch({ type: 'SET_CURRENT_BOARD', payload: { boardId: board.id } })}
                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex-1 text-sm sm:text-base"
              >
                Open Board
              </button>
              <button 
                onClick={() => handleDeleteBoard(board.id)} 
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {state.boards.length === 0 && (
          <div className="col-span-full text-center py-8 sm:py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
             <span className="text-4xl sm:text-6xl block mb-2 sm:mb-4">📋</span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white mb-2">No boards yet</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">Create your first board to get started with task management</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;