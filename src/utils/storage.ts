import { TodoRepository, ITodoRepository } from '../repositories/TodoRepository';
import { Todo } from '../types/Todo';

const todoRepository: ITodoRepository = new TodoRepository();

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  await todoRepository.saveTodos(todos);
};

export const loadTodos = async (): Promise<Todo[]> => {
  return await todoRepository.loadTodos();
};

