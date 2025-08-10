import todoReducer, {
  addTodo,
  updateTodo,
  deleteTodo,
  setTodos,
  setLoading,
  setError,
} from '../src/store/todoSlice';
import {Todo} from '../src/types/Todo';

// Mock todo data for testing
const mockTodo: Todo = {
  id: '1',
  text: 'Test todo',
  createdAt: new Date('2023-01-01'),
};

const initialState = {
  todos: [],
  isLoading: false,
  error: null,
};

describe('todoSlice', () => {
  // Test initial state
  it('should return the initial state', () => {
    expect(todoReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  // Test setTodos action
  it('should handle setTodos', () => {
    const todos = [mockTodo];
    const actual = todoReducer(initialState, setTodos(todos));
    expect(actual.todos).toEqual(todos);
    expect(actual.error).toBeNull();
  });

  // Test addTodo action
  it('should handle addTodo', () => {
    const todoText = 'New todo';
    const previousState = {...initialState};
    const actual = todoReducer(previousState, addTodo({text: todoText}));
    
    expect(actual.todos).toHaveLength(1);
    expect(actual.todos[0].text).toBe(todoText);
    expect(actual.todos[0].id).toBeDefined();
    expect(actual.todos[0].createdAt).toBeDefined();
    expect(actual.error).toBeNull();
  });

  // Test updateTodo action
  it('should handle updateTodo', () => {
    const previousState = {
      ...initialState,
      todos: [mockTodo],
    };
    const updatedText = 'Updated todo';
    const actual = todoReducer(
      previousState,
      updateTodo({id: '1', text: updatedText}),
    );

    expect(actual.todos[0].text).toBe(updatedText);
    expect(actual.todos[0].id).toBe('1');
    expect(actual.error).toBeNull();
  });

  // Test updateTodo with non-existent todo
  it('should not update non-existent todo', () => {
    const previousState = {
      ...initialState,
      todos: [mockTodo],
    };
    const actual = todoReducer(
      previousState,
      updateTodo({id: '999', text: 'Should not update'}),
    );

    expect(actual.todos).toEqual(previousState.todos);
  });

  // Test deleteTodo action
  it('should handle deleteTodo', () => {
    const previousState = {
      ...initialState,
      todos: [mockTodo],
    };
    const actual = todoReducer(previousState, deleteTodo('1'));

    expect(actual.todos).toHaveLength(0);
    expect(actual.error).toBeNull();
  });

  // Test setLoading action
  it('should handle setLoading', () => {
    const actual = todoReducer(initialState, setLoading(true));
    expect(actual.isLoading).toBe(true);
  });

  // Test setError action
  it('should handle setError', () => {
    const errorMessage = 'Test error';
    const actual = todoReducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
  });
});