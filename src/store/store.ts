import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import { storageMiddleware } from './middleware';

// Configure the Redux store
// Redux Toolkit's configureStore sets up good defaults automatically:
// - Redux DevTools Extension support
// - Thunk middleware for async actions
// - Development checks for common mistakes
export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  // Add our storage middleware and fix for non-serializable Date objects
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['todos/setTodos', 'todos/addTodo'],
        // Ignore these paths in the state
        ignoredPaths: ['todos.todos'],
      },
    }).concat(storageMiddleware),
});

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
