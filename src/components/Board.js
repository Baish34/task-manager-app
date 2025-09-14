// Board.js
import React, { useState } from 'react';
import List from './List';

const Board = ({ state, dispatch }) => {
  const currentBoard = state.boards.find(board => board.id === state.currentBoardId);
  const [newListName, setNewListName] = useState('');
  const [showAddList, setShowAddList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentBoard) return null;

  const handleAddList = () => {
    if (!newListName.trim()) return;
    dispatch({ type: 'ADD_LIST', payload: { name: newListName } });
    setNewListName('');
    setShowAddList(false);
  };

  // Filter lists based on search query
  const filteredLists = currentBoard.lists.map(list => ({
    ...list,
    tasks: list.tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_BOARD', payload: { boardId: null } })}
              className="px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base self-start"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{currentBoard.name}</h1>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Lists Container */}
      <div className="p-3 sm:p-6 overflow-x-auto">
        <div className="flex space-x-4 sm:space-x-6 min-h-96 pb-4">
          {filteredLists.map(list => (
            <List key={list.id} list={list} dispatch={dispatch} searchQuery={searchQuery} />
          ))}
          
          {/* Add List Section */}
          {showAddList ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 w-72 sm:w-80 flex-shrink-0 shadow-sm">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name..."
                className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={handleAddList} 
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex-1 text-sm"
                >
                  Add List
                </button>
                <button 
                  onClick={() => setShowAddList(false)} 
                  className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddList(true)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl p-4 sm:p-6 w-72 sm:w-80 flex-shrink-0 flex items-center justify-center font-medium transition-colors text-sm sm:text-base"
            >
              + Add New List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;