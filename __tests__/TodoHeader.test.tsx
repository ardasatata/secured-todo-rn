import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {TodoHeader} from '../src/components/TodoHeader';
import {ThemeProvider} from '../src/providers/ThemeProvider';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock react-navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Wrapper component that provides theme context
const TestWrapper = ({children}: {children: React.ReactNode}) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('TodoHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default title', () => {
    const {getByTestId} = render(
      <TestWrapper>
        <TodoHeader />
      </TestWrapper>
    );

    expect(getByTestId('todo-header')).toBeTruthy();
    expect(getByTestId('header-title')).toBeTruthy();
    expect(getByTestId('header-title').props.children).toBe('My Todos');
    expect(getByTestId('settings-button')).toBeTruthy();
    expect(getByTestId('settings-icon')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Todo Title';
    const {getByTestId} = render(
      <TestWrapper>
        <TodoHeader title={customTitle} />
      </TestWrapper>
    );

    expect(getByTestId('header-title').props.children).toBe(customTitle);
  });

  it('navigates to Settings when settings button is pressed', () => {
    const {getByTestId} = render(
      <TestWrapper>
        <TodoHeader />
      </TestWrapper>
    );

    fireEvent.press(getByTestId('settings-button'));
    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });

  it('calls custom onSettingsPress when provided', () => {
    const mockOnSettingsPress = jest.fn();
    const {getByTestId} = render(
      <TestWrapper>
        <TodoHeader onSettingsPress={mockOnSettingsPress} />
      </TestWrapper>
    );

    fireEvent.press(getByTestId('settings-button'));
    expect(mockOnSettingsPress).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders settings icon with correct props', () => {
    const {getByTestId} = render(
      <TestWrapper>
        <TodoHeader />
      </TestWrapper>
    );

    const settingsIcon = getByTestId('settings-icon');
    expect(settingsIcon.props.name).toBe('settings-outline');
    expect(settingsIcon.props.size).toBe(32);
  });

  it('applies correct styles from theme', () => {
    const {getByTestId} = render(
      <TestWrapper>
        <TodoHeader />
      </TestWrapper>
    );

    const header = getByTestId('todo-header');
    const title = getByTestId('header-title');

    expect(header.props.style).toBeTruthy();
    expect(title.props.style).toBeTruthy();
  });
});
