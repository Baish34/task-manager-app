import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Card = ({ task, index, listId, dispatch, searchQuery }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description);

  const handleEdit = () => {
    if (!editedTitle.trim()) return;
    dispatch({ type: 'EDIT_TASK', payload: { taskId: task.id, title: editedTitle, description: editedDesc } });
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: { taskId: task.id } });
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</span>');
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
            }`}
          >
            <h3
              className="font-semibold text-gray-800 dark:text-white mb-2 leading-tight"
              dangerouslySetInnerHTML={{ __html: highlightText(task.title, searchQuery) }}
            />
            {task.description && (
              <p
                className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightText(task.description, searchQuery) }}
              />
            )}
            <div className="flex space-x-3 text-sm">
              <button 
                onClick={() => setShowEditModal(true)} 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete} 
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Draggable>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Task</h3>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task Title"
              className="w-full px-4 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              placeholder="Description (optional)"
              rows="3"
              className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex space-x-3">
              <button 
                onClick={handleEdit} 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex-1"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
