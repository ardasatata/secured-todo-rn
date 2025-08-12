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
  Keyboard,
} from 'react-native';
import {Todo} from '../types/Todo';
import {loadTodos} from '../utils/storage';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {setTodos} from '../store/todoSlice';
import {useTodoOperations} from '../hooks/useTodoOperations';
import {useTheme} from '../providers/ThemeProvider';
import {TodoItem} from '../components/TodoItem';
import {TodoHeader} from '../components/TodoHeader';
import {MaterialIcons} from '@expo/vector-icons';

export default function TodoListScreen() {
  // Get todos from Redux store
  const todos = useAppSelector(state => state.todos.todos);
  const dispatch = useAppDispatch();

  // Todo operations with built-in authentication
  const {
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleToggleTodo,
    isOperating,
  } = useTodoOperations();

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

  // Handle add todo
  const onAddTodo = async () => {
    await handleAddTodo(inputText);
    setInputText('');
  };

  // Handle update todo
  const onUpdateTodo = async () => {
    if (!editingId) {
      return;
    }
    await handleUpdateTodo(editingId, inputText);
    setInputText('');
    setEditingId(null);
  };

  // Handle delete todo with cleanup
  const onDeleteTodo = async (id: string) => {
    await handleDeleteTodo(id);
    // Clear editing state if we're deleting the todo being edited
    if (editingId === id) {
      setEditingId(null);
      setInputText('');
    }
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


  // Calculate remaining todos count
  const remainingTodos = todos.filter(todo => !todo.completed).length;

  // Render function for FlatList - now uses extracted TodoItem component
  const renderTodoItem = ({item, index}: {item: Todo, index: number}) => (
    <TodoItem
      item={item}
      isEditing={editingId === item.id}
      onEdit={startEditing}
      onDelete={onDeleteTodo}
      onToggle={handleToggleTodo}
      index={index}
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
              <Text style={styles.counterText} testID="remaining-todos-count">
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
              onSubmitEditing={editingId ? onUpdateTodo : onAddTodo}
              returnKeyType={editingId ? 'done' : 'send'}
              multiline={true}
              maxLength={200}
              testID="todo-input"
            />
            <TouchableOpacity
              style={[styles.actionButton, editingId && styles.updateButton, isOperating && styles.buttonDisabled]}
              onPress={editingId ? onUpdateTodo : onAddTodo}
              disabled={isOperating}
              testID={editingId ? 'update-todo-button' : 'add-todo-button'}
            >
              <Text style={styles.actionButtonText}>
                {editingId ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
            {editingId && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEditing}
                testID="cancel-edit-button"
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
