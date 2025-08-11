import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Checkbox from 'expo-checkbox';
import {MaterialIcons} from '@expo/vector-icons';
import {Todo} from '../types/Todo';
import {useTheme} from '../providers/ThemeProvider';
import {AnimatedStrikethrough} from './AnimatedStrikethrough';

// Props interface for TodoItem component
interface TodoItemProps {
  item: Todo;
  isEditing: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  index?: number; // Optional index prop for testing purposes
}

// Reusable TodoItem component
// Displays a single todo with edit and delete functionality
export const TodoItem: React.FC<TodoItemProps> = ({
  item,
  isEditing,
  onEdit,
  onDelete,
  onToggle,
  index,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[
      styles.todoItem,
      isEditing && styles.todoItemEditing,
    ]}>
      {/* Checkbox for completion toggle */}
      <Checkbox
        style={styles.checkbox}
        value={item.completed}
        onValueChange={() => onToggle(item.id)}
        color={item.completed ? theme.colors.checkboxChecked : theme.colors.checkboxUnchecked}
        testID={`todo-checkbox-${index}`}
      />

      {/* Todo content - tappable to start editing */}
      <TouchableOpacity
        style={[
          styles.todoContent,
          item.completed && styles.todoItemCompleted,
        ]}
        onPress={() => onEdit(item)}
        testID={`todo-text-${index}`}
      >
        <AnimatedStrikethrough
          isCompleted={item.completed}
          textStyle={StyleSheet.flatten([
            styles.todoText,
            item.completed && styles.completedText,
          ])}
          strikethroughColor={theme.colors.todoCompleted}
        >
          {item.text}
        </AnimatedStrikethrough>
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
        testID={`delete-todo-${index}`}
      >
        <MaterialIcons
          name="close"
          size={18}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.listItemPadding,
    borderRadius: theme.spacing.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  todoItemEditing: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  todoItemCompleted: {
    opacity: 0.8,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
  },
  completedText: {
    color: theme.colors.textDisabled,
  },
  deleteButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});
