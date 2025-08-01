import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

/**
 * TimerContext - React Context for managing timer state across the app
 * Provides timer data, history, and all timer-related functions to child components
 */
const TimerContext = createContext();

/**
 * Configure notification settings for the app
 * Sets up how notifications should be displayed and handled
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,    // Show notification alert
    shouldPlaySound: true,    // Play notification sound
    shouldSetBadge: false,    // Don't set app badge
  }),
});

/**
 * ACTIONS - Object containing all action types for the timer reducer
 * Each action type corresponds to a specific timer operation
 */
const ACTIONS = {
  SET_TIMERS: 'SET_TIMERS',           // Set all timers from storage
  ADD_TIMER: 'ADD_TIMER',             // Add a new timer
  UPDATE_TIMER: 'UPDATE_TIMER',       // Update existing timer properties
  DELETE_TIMER: 'DELETE_TIMER',       // Remove a timer
  START_TIMER: 'START_TIMER',         // Start timer countdown
  PAUSE_TIMER: 'PAUSE_TIMER',         // Pause timer countdown
  RESET_TIMER: 'RESET_TIMER',         // Reset timer to original state
  COMPLETE_TIMER: 'COMPLETE_TIMER',   // Mark timer as completed
  UPDATE_TIME: 'UPDATE_TIME',         // Update timer remaining time
  ADD_HISTORY: 'ADD_HISTORY',         // Add completed timer to history
  SET_HISTORY: 'SET_HISTORY',         // Set history from storage
  CLEAR_HISTORY: 'CLEAR_HISTORY',     // Clear all history
};

/**
 * initialState - Initial state object for the timer reducer
 * Contains empty arrays for timers and history, and intervals object
 */
const initialState = {
  timers: [],      // Array of timer objects
  history: [],     // Array of completed timer history
  intervals: {},   // Object to store timer intervals (not currently used)
};

/**
 * timerReducer - Reducer function that handles all timer state changes
 * Takes current state and action, returns new state based on action type
 * 
 * @param {Object} state - Current timer state
 * @param {Object} action - Action object with type and payload
 * @returns {Object} New state after applying the action
 */
function timerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TIMERS:
      // Set all timers from storage
      return { ...state, timers: action.payload };
    
    case ACTIONS.ADD_TIMER:
      // Add new timer with unique ID
      return { 
        ...state, 
        timers: [...state.timers, { ...action.payload, id: Date.now().toString() }] 
      };
    
    case ACTIONS.UPDATE_TIMER:
      // Update specific timer properties
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload.id ? { ...timer, ...action.payload } : timer
        ),
      };
    
    case ACTIONS.DELETE_TIMER:
      // Remove timer by ID
      return {
        ...state,
        timers: state.timers.filter(timer => timer.id !== action.payload),
      };
    
    case ACTIONS.START_TIMER:
      // Start timer countdown
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload 
            ? { ...timer, status: 'running', startTime: Date.now() }
            : timer
        ),
      };
    
    case ACTIONS.PAUSE_TIMER:
      // Pause timer countdown
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload 
            ? { ...timer, status: 'paused' }
            : timer
        ),
      };
    
    case ACTIONS.RESET_TIMER:
      // Reset timer to original state
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload 
            ? { 
                ...timer, 
                status: 'stopped', 
                remainingTime: timer.duration,
                startTime: null,
                halfAlertTriggered: false
              }
            : timer
        ),
      };
    
    case ACTIONS.COMPLETE_TIMER:
      // Mark timer as completed
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload 
            ? { ...timer, status: 'completed', remainingTime: 0 }
            : timer
        ),
      };
    
    case ACTIONS.UPDATE_TIME:
      // Update timer remaining time and halfway alert status
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload.id 
            ? { 
                ...timer, 
                remainingTime: action.payload.remainingTime,
                halfAlertTriggered: action.payload.halfAlertTriggered || timer.halfAlertTriggered
              }
            : timer
        ),
      };
    
    case ACTIONS.ADD_HISTORY:
      // Add completed timer to history (at beginning of array)
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    
    case ACTIONS.SET_HISTORY:
      // Set history from storage
      return { ...state, history: action.payload };
    
    case ACTIONS.CLEAR_HISTORY:
      // Clear all history
      return { ...state, history: [] };
    
    default:
      // Return current state if action type is not recognized
      return state;
  }
}

/**
 * TimerProvider - Context provider component that wraps the app
 * Manages timer state, provides timer functions, and handles data persistence
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export function TimerProvider({ children }) {
  // Use reducer to manage timer state
  const [state, dispatch] = useReducer(timerReducer, initialState);

  /**
   * useEffect - Load timers and history from storage when component mounts
   * Runs only once when the app starts
   */
  useEffect(() => {
    loadTimers();
    loadHistory();
  }, []);

  /**
   * useEffect - Save timers to storage whenever timers array changes
   * Automatically persists timer data to AsyncStorage
   */
  useEffect(() => {
    saveTimers();
  }, [state.timers]);

  /**
   * useEffect - Save history to storage whenever history array changes
   * Automatically persists history data to AsyncStorage
   */
  useEffect(() => {
    saveHistory();
  }, [state.history]);

  /**
   * loadTimers - Async function to load saved timers from AsyncStorage
   * Retrieves timer data from storage and dispatches SET_TIMERS action
   * Handles errors gracefully by logging to console
   */
  const loadTimers = async () => {
    try {
      // Get saved timers from AsyncStorage
      const savedTimers = await AsyncStorage.getItem('timers');
      if (savedTimers) {
        // Parse JSON and update state
        const timers = JSON.parse(savedTimers);
        dispatch({ type: ACTIONS.SET_TIMERS, payload: timers });
      }
    } catch (error) {
      console.log('Error loading timers:', error);
    }
  };

  /**
   * saveTimers - Async function to save timers to AsyncStorage
   * Converts timers array to JSON and saves to storage
   * Handles errors gracefully by logging to console
   */
  const saveTimers = async () => {
    try {
      // Convert timers array to JSON string and save
      await AsyncStorage.setItem('timers', JSON.stringify(state.timers));
    } catch (error) {
      console.log('Error saving timers:', error);
    }
  };

  /**
   * loadHistory - Async function to load saved history from AsyncStorage
   * Retrieves history data from storage and dispatches SET_HISTORY action
   * Handles errors gracefully by logging to console
   */
  const loadHistory = async () => {
    try {
      // Get saved history from AsyncStorage
      const savedHistory = await AsyncStorage.getItem('timerHistory');
      if (savedHistory) {
        // Parse JSON and update state
        const history = JSON.parse(savedHistory);
        dispatch({ type: ACTIONS.SET_HISTORY, payload: history });
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  /**
   * saveHistory - Async function to save history to AsyncStorage
   * Converts history array to JSON and saves to storage
   * Handles errors gracefully by logging to console
   */
  const saveHistory = async () => {
    try {
      // Convert history array to JSON string and save
      await AsyncStorage.setItem('timerHistory', JSON.stringify(state.history));
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  /**
   * addTimer - Function to add a new timer
   * Dispatches ADD_TIMER action with timer data
   * 
   * @param {Object} timerData - Timer data object (name, duration, category)
   */
  const addTimer = (timerData) => {
    dispatch({ type: ACTIONS.ADD_TIMER, payload: timerData });
  };

  /**
   * updateTimer - Function to update existing timer properties
   * Dispatches UPDATE_TIMER action with updated timer data
   * 
   * @param {Object} timerData - Updated timer data with ID
   */
  const updateTimer = (timerData) => {
    dispatch({ type: ACTIONS.UPDATE_TIMER, payload: timerData });
  };

  /**
   * deleteTimer - Function to remove a timer
   * Dispatches DELETE_TIMER action with timer ID
   * 
   * @param {string} timerId - ID of timer to delete
   */
  const deleteTimer = (timerId) => {
    dispatch({ type: ACTIONS.DELETE_TIMER, payload: timerId });
  };

  /**
   * startTimer - Function to start timer countdown
   * Dispatches START_TIMER action with timer ID
   * 
   * @param {string} timerId - ID of timer to start
   */
  const startTimer = (timerId) => {
    dispatch({ type: ACTIONS.START_TIMER, payload: timerId });
  };

  /**
   * pauseTimer - Function to pause timer countdown
   * Dispatches PAUSE_TIMER action with timer ID
   * 
   * @param {string} timerId - ID of timer to pause
   */
  const pauseTimer = (timerId) => {
    dispatch({ type: ACTIONS.PAUSE_TIMER, payload: timerId });
  };

  /**
   * resetTimer - Function to reset timer to original state
   * Dispatches RESET_TIMER action with timer ID
   * 
   * @param {string} timerId - ID of timer to reset
   */
  const resetTimer = (timerId) => {
    dispatch({ type: ACTIONS.RESET_TIMER, payload: timerId });
  };

  /**
   * completeTimer - Function to mark timer as completed
   * Dispatches COMPLETE_TIMER and ADD_HISTORY actions
   * Adds completed timer to history with completion timestamp
   * 
   * @param {string} timerId - ID of timer to complete
   */
  const completeTimer = (timerId) => {
    // Find the timer to get its details
    const timer = state.timers.find(t => t.id === timerId);
    if (timer) {
      // Mark timer as completed
      dispatch({ type: ACTIONS.COMPLETE_TIMER, payload: timerId });
      // Add to history with completion details
      dispatch({ 
        type: ACTIONS.ADD_HISTORY, 
        payload: {
          id: Date.now().toString(),
          timerName: timer.name,
          category: timer.category,
          duration: timer.duration,
          completedAt: new Date().toISOString(),
        }
      });
    }
  };

  /**
   * updateTimerTime - Function to update timer remaining time
   * Dispatches UPDATE_TIME action with new time and halfway alert status
   * 
   * @param {string} timerId - ID of timer to update
   * @param {number} remainingTime - New remaining time in seconds
   * @param {boolean} halfAlertTriggered - Whether halfway alert was triggered
   */
  const updateTimerTime = (timerId, remainingTime, halfAlertTriggered = false) => {
    dispatch({ 
      type: ACTIONS.UPDATE_TIME, 
      payload: { id: timerId, remainingTime, halfAlertTriggered } 
    });
  };

  /**
   * clearHistory - Function to clear all history entries
   * Dispatches CLEAR_HISTORY action
   */
  const clearHistory = () => {
    dispatch({ type: ACTIONS.CLEAR_HISTORY });
  };

  /**
   * startAllTimersInCategory - Function to start all timers in a category
   * Filters timers by category and starts each non-completed timer
   * 
   * @param {string} category - Category name to start timers for
   */
  const startAllTimersInCategory = (category) => {
    state.timers
      .filter(timer => timer.category === category && timer.status !== 'completed')
      .forEach(timer => startTimer(timer.id));
  };

  /**
   * pauseAllTimersInCategory - Function to pause all running timers in a category
   * Filters timers by category and pauses each running timer
   * 
   * @param {string} category - Category name to pause timers for
   */
  const pauseAllTimersInCategory = (category) => {
    state.timers
      .filter(timer => timer.category === category && timer.status === 'running')
      .forEach(timer => pauseTimer(timer.id));
  };

  /**
   * resetAllTimersInCategory - Function to reset all timers in a category
   * Filters timers by category and resets each timer
   * 
   * @param {string} category - Category name to reset timers for
   */
  const resetAllTimersInCategory = (category) => {
    state.timers
      .filter(timer => timer.category === category)
      .forEach(timer => resetTimer(timer.id));
  };

  /**
   * value - Object containing all timer state and functions
   * This is what gets provided to child components through context
   */
  const value = {
    timers: state.timers,                    // Array of all timers
    history: state.history,                  // Array of completed timer history
    addTimer,                                // Function to add new timer
    updateTimer,                             // Function to update timer
    deleteTimer,                             // Function to delete timer
    startTimer,                              // Function to start timer
    pauseTimer,                              // Function to pause timer
    resetTimer,                              // Function to reset timer
    completeTimer,                           // Function to complete timer
    updateTimerTime,                         // Function to update timer time
    clearHistory,                            // Function to clear history
    startAllTimersInCategory,                // Function to start all timers in category
    pauseAllTimersInCategory,                // Function to pause all timers in category
    resetAllTimersInCategory,                // Function to reset all timers in category
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

/**
 * useTimer - Custom hook to access timer context
 * Returns the timer context object containing timers, history, and all timer functions
 * Throws an error if used outside of a TimerProvider
 * 
 * @returns {Object} Timer context with timers, history, and all timer functions
 * @throws {Error} If used outside of TimerProvider
 */
export const useTimer = () => {
  // Get the timer context from React.useContext
  const context = useContext(TimerContext);
  
  // Check if context exists (component is wrapped in TimerProvider)
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  
  // Return the timer context object
  return context;
}; 