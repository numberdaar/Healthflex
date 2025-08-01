import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AddTimerScreen from './src/screens/AddTimerScreen';
import { ThemeContext } from './src/context/ThemeContext';
import { TimerProvider } from './src/context/TimerContext';

// Create stack navigator for screen navigation
const Stack = createStackNavigator();

/**
 * Main App component - Entry point of the application
 * Manages theme state, navigation setup, and provides context to child components
 */
export default function App() {
  // State to track if dark mode is enabled
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * useEffect hook that runs when component mounts
   * Loads the saved theme preference from AsyncStorage
   */
  useEffect(() => {
    // Load theme preference from storage when app starts
    loadThemePreference();
  }, []);

  /**
   * loadThemePreference - Async function to load saved theme from AsyncStorage
   * Reads the 'theme' key from storage and sets the dark mode state accordingly
   * Handles errors gracefully by logging to console
   */
  const loadThemePreference = async () => {
    try {
      // Get saved theme from AsyncStorage
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        // Set dark mode based on saved preference ('dark' = true, 'light' = false)
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  /**
   * toggleTheme - Async function to switch between light and dark themes
   * Updates the isDarkMode state and saves the new preference to AsyncStorage
   * Handles errors gracefully by logging to console
   */
  const toggleTheme = async () => {
    // Toggle the current theme state
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      // Save the new theme preference to AsyncStorage
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  return (
    // ThemeContext.Provider wraps the entire app to provide theme state to all components
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {/* TimerProvider wraps the app to provide timer state management */}
      <TimerProvider>
        {/* NavigationContainer enables navigation between screens */}
        <NavigationContainer>
          {/* Main container with theme-aware background color */}
          <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
            {/* StatusBar with theme-aware style */}
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            {/* Stack Navigator for screen management */}
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                // Header styling based on current theme
                headerStyle: {
                  backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
                },
                headerTintColor: isDarkMode ? '#ffffff' : '#000000',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              {/* Home screen - Main timer list and management */}
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'HealthFlex Timer' }}
              />
              {/* Add Timer screen - Form to create new timers */}
              <Stack.Screen 
                name="AddTimer" 
                component={AddTimerScreen} 
                options={{ title: 'Add Timer' }}
              />
              {/* History screen - Display completed timer history */}
              <Stack.Screen 
                name="History" 
                component={HistoryScreen} 
                options={{ title: 'Timer History' }}
              />
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </TimerProvider>
    </ThemeContext.Provider>
  );
}

/**
 * styles - StyleSheet object defining the main container styles
 * container: Takes full screen space with flex: 1
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up all available space
  },
}); 