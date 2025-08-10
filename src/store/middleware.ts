import { saveTodos } from '../utils/storage';

// Middleware to automatically save todos to AsyncStorage when state changes
export const storageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Save todos to storage after any todo-related action
  if (action.type && typeof action.type === 'string' && action.type.startsWith('todos/')) {
    const state = store.getState();
    saveTodos(state.todos.todos).catch((error: Error) => {
      console.error('Failed to save todos to storage:', error);
    });
  }
  
  return result;
};