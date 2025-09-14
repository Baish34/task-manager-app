import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';

const List = ({ list, dispatch, searchQuery }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(list.name);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const handleRename = () => {
    if (!newName.trim()) return;
    dispatch({ type: 'RENAME_LIST', payload: { listId: list.id, newName } });
    setIsEditingName(false);
  };

  const handleDeleteList = () => {
    if (window.confirm('Delete this list and its tasks?')) {
      dispatch({ type: 'DELETE_LIST', payload: { listId: list.id } });
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    dispatch({ type: 'ADD_TASK', payload: { listId: list.id, title: newTaskTitle, description: newTaskDesc } });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTask(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-72 sm:w-80 flex-shrink-0 shadow-sm">
      {/* List Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        {isEditingName ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            className="w-full px-2 sm:px-3 py-1 text-base sm:text-lg font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-between">
            <h2 
              className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-words flex-1 mr-2" 
              onClick={() => setIsEditingName(true)}
            >
              {list.name}
            </h2>
            <button 
              onClick={handleDeleteList} 
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 flex-shrink-0"
            >
              <span className="text-base sm:text-lg">🗑️</span>
            </button>
          </div>
        )}
      </div>

      {/* Tasks */}
      <Droppable droppableId={list.id}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps} 
            className={`p-3 sm:p-4 min-h-32 sm:min-h-40 ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            {list.tasks.length === 0 && searchQuery ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-xs sm:text-sm">No matching tasks</p>
            ) : list.tasks.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-center py-4 italic text-xs sm:text-sm">No tasks yet</p>
            ) : (
              list.tasks.map((task, index) => (
                <Card key={task.id} task={task} index={index} listId={list.id} dispatch={dispatch} searchQuery={searchQuery} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        {showAddTask ? (
          <div className="space-y-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Description (optional)"
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={handleAddTask} 
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex-1 text-xs sm:text-sm"
              >
                Add Task
              </button>
              <button 
                onClick={() => setShowAddTask(false)} 
                className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowAddTask(true)} 
            className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600 text-xs sm:text-sm"
          >
            + Add a task
          </button>
        )}
      </div>
    </div>
  );
};

export default List;