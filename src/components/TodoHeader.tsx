import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../hooks/useTheme';

interface TodoHeaderProps {
  title?: string;
  onSettingsPress?: () => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  title = 'My Todos',
  onSettingsPress,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      navigation.navigate('Settings' as never);
    }
  };

  return (
    <View style={styles.header} testID="todo-header">
      <Text style={styles.headerTitle} testID="header-title">
        {title}
      </Text>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
        testID="settings-button"
      >
        <Ionicons
          name="settings-outline"
          size={32}
          color={theme.colors.primary}
          testID="settings-icon"
        />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.componentPadding,
    paddingVertical: theme.spacing.listItemPadding,
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    ...theme.typography.title,
    color: theme.colors.onBackground,
  },
  settingsButton: {
    padding: theme.spacing.xs,
  },
});
