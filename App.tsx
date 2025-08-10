import React, {useState, useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthSetupScreen from './src/screens/AuthSetupScreen';
import TodoListScreen from './src/screens/TodoListScreen';
import {loadAuthSetup} from './src/utils/storage';

const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
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
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthSetup ? (
          <Stack.Screen name="AuthSetup">
            {props => <AuthSetupScreen {...props} onAuthSetup={handleAuthSetup} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="TodoList" component={TodoListScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
