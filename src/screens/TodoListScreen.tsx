import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Keyboard,
} from 'react-native';
import {Todo} from '../types/Todo';
import {loadTodos} from '../utils/storage';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {addTodo, updateTodo, toggleTodo, deleteTodo, setTodos} from '../store/todoSlice';
import {useAuthentication} from '../hooks/useAuthentication';
import {useTheme} from '../providers/ThemeProvider';
import {TodoItem} from '../components/TodoItem';
import {TodoHeader} from '../components/TodoHeader';
import {MaterialIcons} from '@expo/vector-icons';

export default function TodoListScreen() {
  // Get todos from Redux store instead of local state
  const todos = useAppSelector(state => state.todos.todos);
  const dispatch = useAppDispatch();

  // Authentication hook for CRUD operations
  const { authenticate, isAuthenticating } = useAuthentication();

  // Theme hook
  const { theme, isDark } = useTheme();

  // Local component state for input and editing
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Create styles with theme
  const styles = createStyles(theme, isDark);

  // Load todos from storage on component mount
  useEffect(() => {
    const loadInitialTodos = async () => {
      const loadedTodos = await loadTodos();
      dispatch(setTodos(loadedTodos));
    };
    loadInitialTodos();
  }, [dispatch]);

  // Add todo with authentication check
  const handleAddTodo = async () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a todo item');
      return;
    }

    // Authenticate before adding todo (as required by assignment)
    const isAuthenticated = await authenticate('Authenticate to add todo');
    if (!isAuthenticated) {
      return; // Don't proceed if authentication failed
    }

    // Dispatch action to Redux store
    dispatch(addTodo({ text: inputText.trim() }));
    setInputText('');
  };

  // Update todo with authentication check
  const handleUpdateTodo = async () => {
    if (inputText.trim() === '' || !editingId) {
      Alert.alert('Error', 'Please enter a todo item');
      return;
    }

    // Authenticate before updating todo (as required by assignment)
    const isAuthenticated = await authenticate('Authenticate to update todo');
    if (!isAuthenticated) {
      return; // Don't proceed if authentication failed
    }

    // Dispatch update action to Redux store
    dispatch(updateTodo({ id: editingId, text: inputText.trim() }));

    setInputText('');
    setEditingId(null);
  };

  // Delete todo with authentication check
  const handleDeleteTodo = async (id: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Authenticate before deleting todo (as required by assignment)
            const isAuthenticated = await authenticate('Authenticate to delete todo');
            if (!isAuthenticated) {
              return; // Don't proceed if authentication failed
            }

            // Dispatch delete action to Redux store
            dispatch(deleteTodo(id));

            // Clear editing state if we're deleting the todo being edited
            if (editingId === id) {
              setEditingId(null);
              setInputText('');
            }
          },
        },
      ]
    );
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setInputText(todo.text);
    // Auto-focus input to trigger keyboard
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setInputText('');
    Keyboard.dismiss();
  };

  // Toggle todo completion with authentication check
  const handleToggleTodo = async (id: string) => {
    const isAuthenticated = await authenticate('Authenticate to toggle todo completion');
    if (!isAuthenticated) {
      return;
    }
    dispatch(toggleTodo(id));
  };

  // Calculate remaining todos count
  const remainingTodos = todos.filter(todo => !todo.completed).length;

  // Render function for FlatList - now uses extracted TodoItem component
  const renderTodoItem = ({item}: {item: Todo}) => (
    <TodoItem
      item={item}
      isEditing={editingId === item.id}
      onEdit={startEditing}
      onDelete={handleDeleteTodo}
      onToggle={handleToggleTodo}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TodoHeader />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 90}
      >

        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={todos.length === 0 ? styles.emptyList : undefined}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No todos yet. Add one below!</Text>
          }
          ListFooterComponent={
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
              Your remaining todos: {remainingTodos}
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder={editingId ? 'Update todo...' : 'Add a new todo...'}
              placeholderTextColor={theme.colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={editingId ? handleUpdateTodo : handleAddTodo}
              returnKeyType={editingId ? 'done' : 'send'}
              multiline={true}
              maxLength={200}
            />
            <TouchableOpacity
              style={[styles.actionButton, editingId && styles.updateButton, isAuthenticating && styles.buttonDisabled]}
              onPress={editingId ? handleUpdateTodo : handleAddTodo}
              disabled={isAuthenticating}
            >
              <Text style={styles.actionButtonText}>
                {editingId ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
            {editingId && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEditing}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: theme.spacing.componentPadding,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textDisabled,
    textAlign: 'center',
  },
  inputContainer: {
    padding: theme.spacing.componentPadding,
    backgroundColor: theme.colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 0,
    paddingVertical: theme.spacing.buttonPadding,
    ...theme.typography.body,
    minHeight: 45,
    maxHeight: 100,
    textAlignVertical: 'top',
    color: theme.colors.onSurface,
    backgroundColor: 'transparent',
  },
  actionButton: {
    backgroundColor: isDark ? theme.colors.black : theme.colors.primary,
    paddingHorizontal: theme.spacing.componentPadding,
    paddingVertical: theme.spacing.buttonPadding,
    borderRadius: theme.spacing.borderRadius.sm,
    marginLeft: theme.spacing.sm,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? theme.colors.borderLight : 'transparent',
  },
  updateButton: {
    backgroundColor: isDark ? theme.colors.black : theme.colors.primary,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? theme.colors.borderLight : 'transparent',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.6,
  },
  actionButtonText: {
    color: isDark ? theme.colors.white : theme.colors.onPrimary,
    ...theme.typography.button,
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.buttonPadding,
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    paddingVertical: theme.spacing.listItemPadding,
    borderBottomColor: theme.colors.border,
  },
  counterText: {
    ...theme.typography.subtitle,
    color: theme.colors.onSurface,
    textAlign: 'left',
  },
});
