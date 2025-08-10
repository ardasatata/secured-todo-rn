import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {Todo} from '../types/Todo';
import {loadTodos} from '../utils/storage';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {addTodo, updateTodo, deleteTodo, setTodos} from '../store/todoSlice';
import {useAuthentication} from '../hooks/useAuthentication';
import {TodoItem} from '../components/TodoItem';

export default function TodoListScreen() {
  // Get todos from Redux store instead of local state
  const todos = useAppSelector(state => state.todos.todos);
  const dispatch = useAppDispatch();

  // Authentication hook for CRUD operations
  const { authenticate, isAuthenticating } = useAuthentication();

  // Local component state for input and editing
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

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
  };

  const cancelEditing = () => {
    setEditingId(null);
    setInputText('');
  };

  // Render function for FlatList - now uses extracted TodoItem component
  const renderTodoItem = ({item}: {item: Todo}) => (
    <TodoItem
      item={item}
      isEditing={editingId === item.id}
      onEdit={startEditing}
      onDelete={handleDeleteTodo}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={editingId ? 'Update todo...' : 'Add a new todo...'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={editingId ? handleUpdateTodo : handleAddTodo}
            returnKeyType={editingId ? 'done' : 'send'}
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
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
