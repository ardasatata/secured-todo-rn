import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { addTodo, updateTodo, toggleTodo, deleteTodo } from '../store/todoSlice';
import { useAuthentication } from './useAuthentication';
import { AUTH_MESSAGES, ALERT_MESSAGES, BUTTON_LABELS } from '../constants/messages';

interface UseTodoOperationsReturn {
  handleAddTodo: (text: string) => Promise<void>;
  handleUpdateTodo: (id: string, text: string) => Promise<void>;
  handleDeleteTodo: (id: string) => Promise<void>;
  handleToggleTodo: (id: string) => Promise<void>;
  isOperating: boolean;
}

/**
 * Custom hook that encapsulates all todo CRUD operations with authentication
 * Follows Single Responsibility Principle - handles only todo operations logic
 */
export const useTodoOperations = (): UseTodoOperationsReturn => {
  const dispatch = useAppDispatch();
  const { authenticate, isAuthenticating } = useAuthentication();
  const [isOperating, setIsOperating] = useState(false);

  /**
   * Higher-order function that wraps operations with authentication
   * Reduces code duplication by centralizing auth flow
   */
  const withAuthentication = useCallback(
    async (
      authMessage: string,
      operation: () => void | Promise<void>
    ): Promise<boolean> => {
      const isAuthenticated = await authenticate(authMessage);
      if (!isAuthenticated) {
        return false;
      }
      await operation();
      return true;
    },
    [authenticate]
  );

  /**
   * Add a new todo with authentication
   */
  const handleAddTodo = useCallback(
    async (text: string): Promise<void> => {
      if (text.trim() === '') {
        Alert.alert(ALERT_MESSAGES.ERROR_TITLE, ALERT_MESSAGES.EMPTY_TODO_ERROR);
        return;
      }

      setIsOperating(true);
      try {
        await withAuthentication(AUTH_MESSAGES.ADD_TODO, () => {
          dispatch(addTodo({ text: text.trim() }));
        });
      } finally {
        setIsOperating(false);
      }
    },
    [dispatch, withAuthentication]
  );

  /**
   * Update an existing todo with authentication
   */
  const handleUpdateTodo = useCallback(
    async (id: string, text: string): Promise<void> => {
      if (text.trim() === '') {
        Alert.alert(ALERT_MESSAGES.ERROR_TITLE, ALERT_MESSAGES.EMPTY_TODO_ERROR);
        return;
      }

      setIsOperating(true);
      try {
        await withAuthentication(AUTH_MESSAGES.UPDATE_TODO, () => {
          dispatch(updateTodo({ id, text: text.trim() }));
        });
      } finally {
        setIsOperating(false);
      }
    },
    [dispatch, withAuthentication]
  );

  /**
   * Delete a todo with confirmation and authentication
   */
  const handleDeleteTodo = useCallback(
    async (id: string): Promise<void> => {
      return new Promise((resolve) => {
        Alert.alert(
          ALERT_MESSAGES.DELETE_TITLE,
          ALERT_MESSAGES.DELETE_CONFIRM,
          [
            {
              text: BUTTON_LABELS.CANCEL,
              style: 'cancel',
              onPress: () => resolve(),
            },
            {
              text: BUTTON_LABELS.DELETE,
              style: 'destructive',
              onPress: async () => {
                setIsOperating(true);
                try {
                  await withAuthentication(AUTH_MESSAGES.DELETE_TODO, () => {
                    dispatch(deleteTodo(id));
                  });
                } finally {
                  setIsOperating(false);
                  resolve();
                }
              },
            },
          ]
        );
      });
    },
    [dispatch, withAuthentication]
  );

  /**
   * Toggle todo completion status with authentication
   */
  const handleToggleTodo = useCallback(
    async (id: string): Promise<void> => {
      setIsOperating(true);
      try {
        await withAuthentication(AUTH_MESSAGES.TOGGLE_TODO, () => {
          dispatch(toggleTodo(id));
        });
      } finally {
        setIsOperating(false);
      }
    },
    [dispatch, withAuthentication]
  );

  return {
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleToggleTodo,
    isOperating: isOperating || isAuthenticating,
  };
};
