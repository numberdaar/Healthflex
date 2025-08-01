import React from 'react';

/**
 * ThemeContext - React Context for managing theme state across the app
 * Provides isDarkMode boolean and toggleTheme function to all child components
 * This context allows any component to access and modify the theme state
 */
export const ThemeContext = React.createContext();

/**
 * useTheme - Custom hook to access theme context
 * Returns the theme context object containing isDarkMode and toggleTheme
 * Throws an error if used outside of a ThemeProvider
 * 
 * @returns {Object} Theme context with { isDarkMode: boolean, toggleTheme: function }
 * @throws {Error} If used outside of ThemeProvider
 */
export const useTheme = () => {
  // Get the theme context from React.useContext
  const context = React.useContext(ThemeContext);
  
  // Check if context exists (component is wrapped in ThemeProvider)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Return the theme context object
  return context;
}; 