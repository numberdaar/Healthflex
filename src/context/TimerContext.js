import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const TimerContext = createContext();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Action types
const ACTIONS = {
  SET_TIMERS: 'SET_TIMERS',
  ADD_TIMER: 'ADD_TIMER',
  UPDATE_TIMER: 'UPDATE_TIMER',
  DELETE_TIMER: 'DELETE_TIMER',
  START_TIMER: 'START_TIMER',
  PAUSE_TIMER: 'PAUSE_TIMER',
  RESET_TIMER: 'RESET_TIMER',
  COMPLETE_TIMER: 'COMPLETE_TIMER',
  UPDATE_TIME: 'UPDATE_TIME',
  ADD_HISTORY: 'ADD_HISTORY',
  SET_HISTORY: 'SET_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
};

// Initial state
const initialState = {
  timers: [],
  history: [],
  intervals: {},
};

// Reducer function
function timerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TIMERS:
      return { ...state, timers: action.payload };
    
    case ACTIONS.ADD_TIMER:
      return { 
        ...state, 
        timers: [...state.timers, { ...action.payload, id: Date.now().toString() }] 
      };
    
    case ACTIONS.UPDATE_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload.id ? { ...timer, ...action.payload } : timer
        ),
      };
    
    case ACTIONS.DELETE_TIMER:
      return {
        ...state,
        timers: state.timers.filter(timer => timer.id !== action.payload),
      };
    
    case ACTIONS.START_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload 
            ? { ...timer, status: 'running', startTime: Date.now() }
            : timer
        ),
      };
    
    case ACTIONS.PAUSE_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload 
            ? { ...timer, status: 'paused' }
            : timer
        ),
      };
    
    case ACTIONS.RESET_TIMER:
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
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload 
            ? { ...timer, status: 'completed', remainingTime: 0 }
            : timer
        ),
      };
    
    case ACTIONS.UPDATE_TIME:
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
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    
    case ACTIONS.SET_HISTORY:
      return { ...state, history: action.payload };
    
    case ACTIONS.CLEAR_HISTORY:
      return { ...state, history: [] };
    
    default:
      return state;
  }
}

export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load timers and history from storage on app start
  useEffect(() => {
    loadTimers();
    loadHistory();
  }, []);

  // Save timers to storage whenever they change
  useEffect(() => {
    saveTimers();
  }, [state.timers]);

  // Save history to storage whenever it changes
  useEffect(() => {
    saveHistory();
  }, [state.history]);

  const loadTimers = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem('timers');
      if (savedTimers) {
        const timers = JSON.parse(savedTimers);
        dispatch({ type: ACTIONS.SET_TIMERS, payload: timers });
      }
    } catch (error) {
      console.log('Error loading timers:', error);
    }
  };

  const saveTimers = async () => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(state.timers));
    } catch (error) {
      console.log('Error saving timers:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('timerHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        dispatch({ type: ACTIONS.SET_HISTORY, payload: history });
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem('timerHistory', JSON.stringify(state.history));
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  const addTimer = (timerData) => {
    dispatch({ type: ACTIONS.ADD_TIMER, payload: timerData });
  };

  const updateTimer = (timerData) => {
    dispatch({ type: ACTIONS.UPDATE_TIMER, payload: timerData });
  };

  const deleteTimer = (timerId) => {
    dispatch({ type: ACTIONS.DELETE_TIMER, payload: timerId });
  };

  const startTimer = (timerId) => {
    dispatch({ type: ACTIONS.START_TIMER, payload: timerId });
  };

  const pauseTimer = (timerId) => {
    dispatch({ type: ACTIONS.PAUSE_TIMER, payload: timerId });
  };

  const resetTimer = (timerId) => {
    dispatch({ type: ACTIONS.RESET_TIMER, payload: timerId });
  };

  const completeTimer = (timerId) => {
    const timer = state.timers.find(t => t.id === timerId);
    if (timer) {
      dispatch({ type: ACTIONS.COMPLETE_TIMER, payload: timerId });
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

  const updateTimerTime = (timerId, remainingTime, halfAlertTriggered = false) => {
    dispatch({ 
      type: ACTIONS.UPDATE_TIME, 
      payload: { id: timerId, remainingTime, halfAlertTriggered } 
    });
  };

  const clearHistory = () => {
    dispatch({ type: ACTIONS.CLEAR_HISTORY });
  };

  const startAllTimersInCategory = (category) => {
    state.timers
      .filter(timer => timer.category === category && timer.status !== 'completed')
      .forEach(timer => startTimer(timer.id));
  };

  const pauseAllTimersInCategory = (category) => {
    state.timers
      .filter(timer => timer.category === category && timer.status === 'running')
      .forEach(timer => pauseTimer(timer.id));
  };

  const resetAllTimersInCategory = (category) => {
    state.timers
      .filter(timer => timer.category === category)
      .forEach(timer => resetTimer(timer.id));
  };

  const value = {
    timers: state.timers,
    history: state.history,
    addTimer,
    updateTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    updateTimerTime,
    clearHistory,
    startAllTimersInCategory,
    pauseAllTimersInCategory,
    resetAllTimersInCategory,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}; 