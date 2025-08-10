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
import {saveTodos, loadTodos} from '../utils/storage';

export default function TodoListScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadTodosFromStorage();
  }, []);

  const loadTodosFromStorage = async () => {
    const loadedTodos = await loadTodos();
    setTodos(loadedTodos);
  };

  const saveTodosToStorage = async (newTodos: Todo[]) => {
    await saveTodos(newTodos);
  };

  const addTodo = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a todo item');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      createdAt: new Date(),
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodosToStorage(updatedTodos);
    setInputText('');
  };

  const updateTodo = () => {
    if (inputText.trim() === '' || !editingId) {
      Alert.alert('Error', 'Please enter a todo item');
      return;
    }

    const updatedTodos = todos.map(todo =>
      todo.id === editingId ? {...todo, text: inputText.trim()} : todo
    );

    setTodos(updatedTodos);
    saveTodosToStorage(updatedTodos);
    setInputText('');
    setEditingId(null);
  };

  const deleteTodo = (id: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTodos = todos.filter(todo => todo.id !== id);
            setTodos(updatedTodos);
            saveTodosToStorage(updatedTodos);
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

  const renderTodoItem = ({item}: {item: Todo}) => (
    <View style={[
      styles.todoItem, 
      editingId === item.id && styles.todoItemEditing
    ]}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => startEditing(item)}
      >
        <Text style={styles.todoText}>{item.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Todos</Text>
        </View>

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
            placeholder={editingId ? "Update todo..." : "Add a new todo..."}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={editingId ? updateTodo : addTodo}
            returnKeyType={editingId ? "done" : "send"}
          />
          <TouchableOpacity
            style={[styles.actionButton, editingId && styles.updateButton]}
            onPress={editingId ? updateTodo : addTodo}
          >
            <Text style={styles.actionButtonText}>
              {editingId ? "Update" : "Add"}
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  todoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 4,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  todoItemEditing: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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