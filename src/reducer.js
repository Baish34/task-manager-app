import { v4 as uuidv4 } from 'uuid';

const initialState = {
  boards: [],
  currentBoardId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload || initialState;

    case 'CREATE_BOARD': {
      const newBoard = {
        id: uuidv4(),
        name: action.payload.name,
        lists: [
          { id: uuidv4(), name: 'To Do', tasks: [] },
          { id: uuidv4(), name: 'In Progress', tasks: [] },
          { id: uuidv4(), name: 'Done', tasks: [] },
        ],
      };
      return {
        ...state,
        boards: [...state.boards, newBoard],
        currentBoardId: newBoard.id,
      };
    }

    case 'DELETE_BOARD': {
      const updatedBoards = state.boards.filter(board => board.id !== action.payload.boardId);
      return {
        ...state,
        boards: updatedBoards,
        currentBoardId: updatedBoards.length > 0 ? updatedBoards[0].id : null,
      };
    }

    case 'SET_CURRENT_BOARD':
      return { ...state, currentBoardId: action.payload.boardId };

    case 'ADD_LIST': {
      const updatedBoards = state.boards.map(board => {
        if (board.id === state.currentBoardId) {
          return {
            ...board,
            lists: [...board.lists, { id: uuidv4(), name: action.payload.name, tasks: [] }],
          };
        }
        return board;
      });
      return { ...state, boards: updatedBoards };
    }

    case 'RENAME_LIST': {
      const updatedBoards = state.boards.map(board => {
        if (board.id === state.currentBoardId) {
          const updatedLists = board.lists.map(list => {
            if (list.id === action.payload.listId) {
              return { ...list, name: action.payload.newName };
            }
            return list;
          });
          return { ...board, lists: updatedLists };
        }
        return board;
      });
      return { ...state, boards: updatedBoards };
    }

    case 'DELETE_LIST': {
      const updatedBoards = state.boards.map(board => {
        if (board.id === state.currentBoardId) {
          const updatedLists = board.lists.filter(list => list.id !== action.payload.listId);
          return { ...board, lists: updatedLists };
        }
        return board;
      });
      return { ...state, boards: updatedBoards };
    }

    case 'ADD_TASK': {
      const updatedBoards = state.boards.map(board => {
        if (board.id === state.currentBoardId) {
          const updatedLists = board.lists.map(list => {
            if (list.id === action.payload.listId) {
              return {
                ...list,
                tasks: [...list.tasks, { id: uuidv4(), title: action.payload.title, description: action.payload.description || '' }],
              };
            }
            return list;
          });
          return { ...board, lists: updatedLists };
        }
        return board;
      });
      return { ...state, boards: updatedBoards };
    }

    case 'EDIT_TASK': {
      const updatedBoards = state.boards.map(board => {
        if (board.id === state.currentBoardId) {
          const updatedLists = board.lists.map(list => {
            const updatedTasks = list.tasks.map(task => {
              if (task.id === action.payload.taskId) {
                return { ...task, title: action.payload.title, description: action.payload.description };
              }
              return task;
            });
            return { ...list, tasks: updatedTasks };
          });
          return { ...board, lists: updatedLists };
        }
        return board;
      });
      return { ...state, boards: updatedBoards };
    }

    case 'DELETE_TASK': {
      const updatedBoards = state.boards.map(board => {
        if (board.id === state.currentBoardId) {
          const updatedLists = board.lists.map(list => {
            const updatedTasks = list.tasks.filter(task => task.id !== action.payload.taskId);
            return { ...list, tasks: updatedTasks };
          });
          return { ...board, lists: updatedLists };
        }
        return board;
      });
      return { ...state, boards: updatedBoards };
    }

    case 'MOVE_TASK': {
      const { sourceListId, destinationListId, taskId, destinationIndex } = action.payload;
      let taskToMove;
      const updatedBoards = state.boards.map(board => {
        if (board.id === state.currentBoardId) {
          const updatedLists = board.lists.map(list => {
            if (list.id === sourceListId) {
              const [removedTask, ...remainingTasks] = list.tasks.filter(task => {
                if (task.id === taskId) {
                  taskToMove = task;
                  return false;
                }
                return true;
              });
              return { ...list, tasks: remainingTasks };
            }
            return list;
          }).map(list => {
            if (list.id === destinationListId && taskToMove) {
              const newTasks = [...list.tasks];
              newTasks.splice(destinationIndex, 0, taskToMove);
              return { ...list, tasks: newTasks };
            }
            return list;
          });
          return { ...board, lists: updatedLists };
        }
        return board;
      });
      return { ...state, boards: updatedBoards };
    }

    default:
      return state;
  }
};

export { reducer, initialState };