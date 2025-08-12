import { todoRepository } from '../repositories/TodoRepository';
import { Todo } from '../types/Todo';

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  await todoRepository.saveTodos(todos);
};

export const loadTodos = async (): Promise<Todo[]> => {
  return await todoRepository.loadTodos();
};

