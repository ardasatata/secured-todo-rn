import { TodoRepository, ITodoRepository } from '../repositories/TodoRepository';

const todoRepository: ITodoRepository = new TodoRepository();

export const storageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  if (action.type && typeof action.type === 'string' && action.type.startsWith('todos/')) {
    const state = store.getState();
    todoRepository.saveTodos(state.todos.todos).catch((error: Error) => {
      console.error('Failed to save todos to repository:', error);
    });
  }

  return result;
};
