import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Checkbox from 'expo-checkbox';
import {MaterialIcons} from '@expo/vector-icons';
import {Todo} from '../types/Todo';
import {useTheme} from '../hooks/useTheme';
import {AnimatedStrikethrough} from './AnimatedStrikethrough';

// Props interface for TodoItem component
interface TodoItemProps {
  item: Todo;
  isEditing: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

// Reusable TodoItem component
// Displays a single todo with edit and delete functionality
export const TodoItem: React.FC<TodoItemProps> = ({
  item,
  isEditing,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.todoItem, isEditing && styles.todoItemEditing]}>
      {/* Checkbox for completion toggle */}
      <Checkbox
        style={styles.checkbox}
        value={item.completed}
        onValueChange={() => onToggle(item.id)}
        color={item.completed ? theme.colors.primary : undefined}
      />

      {/* Todo content - tappable to start editing */}
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => onEdit(item)}
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
      >
        <MaterialIcons
          name="close"
          size={18}
          color={theme.colors.onPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.listItemPadding,
    borderRadius: theme.spacing.borderRadius.md,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    ...theme.spacing.shadow.small,
  },
  todoItemEditing: {
    backgroundColor: theme.colors.todoEditing,
    borderColor: theme.colors.todoEditingBorder,
    borderWidth: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.md,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
  },
  completedText: {
    color: theme.colors.todoCompleted,
    opacity: 0.7,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    width: 30,
    height: 30,
    borderRadius: theme.spacing.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
});
