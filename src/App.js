import React, { useReducer, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { reducer, initialState } from './reducer';
import Dashboard from './components/Dashboard';
import Board from './components/Board';
import './App.css';

const STORAGE_KEY = 'taskManagerState';
const THEME_KEY = 'taskManagerTheme';

function App() {
  // Initialize state from localStorage
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initial;
  });

  // Initialize theme from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Persist theme changes to localStorage and apply dark mode class
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Handle drag and drop events
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    dispatch({
      type: 'MOVE_TASK',
      payload: {
        sourceListId: source.droppableId,
        destinationListId: destination.droppableId,
        taskId: draggableId,
        destinationIndex: destination.index,
      },
    });
  };

  return (
    <div className={`App ${theme === 'dark' ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen`}>
      {/* Enhanced Theme Toggle Button - Made Responsive */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
      >
        {theme === 'light' ? (
          <>
            <span className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-xs sm:text-sm">🌙</span>
            <span className="hidden xs:inline">Dark</span>
          </>
        ) : (
          <>
            <span className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-xs sm:text-sm">☀️</span>
            <span className="hidden xs:inline">Light</span>
          </>
        )}
      </button>

      {/* Render Board or Dashboard */}
      {state.currentBoardId ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Board state={state} dispatch={dispatch} />
        </DragDropContext>
      ) : (
        <Dashboard state={state} dispatch={dispatch} />
      )}
    </div>
  );
}

export default App;