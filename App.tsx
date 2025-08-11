import React, {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {ThemeProvider, useTheme} from './src/providers/ThemeProvider';
import AuthSetupScreen from './src/screens/AuthSetupScreen';
import TodoListScreen from './src/screens/TodoListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {loadAuthSetup} from './src/utils/authStorage';

const Stack = createStackNavigator();

const AppContent = () => {
  const { isDark, theme } = useTheme();
  const [isAuthSetup, setIsAuthSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthSetup();
  }, []);

  const checkAuthSetup = async () => {
    try {
      const authSetup = await loadAuthSetup();
      setIsAuthSetup(authSetup);
    } catch (error) {
      console.error('Error checking auth setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSetup = () => {
    setIsAuthSetup(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthSetup ? (
            <Stack.Screen
              name="AuthSetup"
              options={{headerShown: false}}
            >
              {props => <AuthSetupScreen {...props} onAuthSetup={handleAuthSetup} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name="TodoList"
                component={TodoListScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  title: 'Settings',
                  headerBackTitle: '',
                  headerTintColor: theme.colors.primary,
                  headerStyle: {
                    backgroundColor: theme.colors.background,
                  },
                  headerTitleStyle: {
                    color: theme.colors.onBackground,
                  },
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
