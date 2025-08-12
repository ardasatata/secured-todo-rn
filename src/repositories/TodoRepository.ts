import { IStorage } from '../interfaces/IStorage';
import { storageService } from '../services/StorageService';
import { Todo } from '../types/Todo';

export interface ITodoRepository {
  saveTodos(todos: Todo[]): Promise<void>;
  loadTodos(): Promise<Todo[]>;
}

class TodoRepository implements ITodoRepository {
  private readonly TODOS_KEY = '@todos';
  private storage: IStorage;

  constructor(storage: IStorage = storageService) {
    this.storage = storage;
  }

  async saveTodos(todos: Todo[]): Promise<void> {
    await this.storage.setItem(this.TODOS_KEY, todos);
  }

  async loadTodos(): Promise<Todo[]> {
    try {
      const todos = await this.storage.getItem<Todo[]>(this.TODOS_KEY);
      if (!todos) {
        return [];
      }

      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    } catch (error) {
      console.error('Error loading todos from repository:', error);
      return [];
    }
  }
}

// Export singleton instance
export const todoRepository = new TodoRepository();

// Also export class for testing purposes
export { TodoRepository };
