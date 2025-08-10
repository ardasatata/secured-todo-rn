import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Todo} from '../types/Todo';

// Props interface for TodoItem component
interface TodoItemProps {
  item: Todo;
  isEditing: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

// Reusable TodoItem component
// Displays a single todo with edit and delete functionality
export const TodoItem: React.FC<TodoItemProps> = ({
  item,
  isEditing,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={[styles.todoItem, isEditing && styles.todoItemEditing]}>
      {/* Todo content - tappable to start editing */}
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => onEdit(item)}
      >
        <Text style={styles.todoText}>{item.text}</Text>
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
