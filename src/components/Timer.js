import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTimer } from '../context/TimerContext';
import { formatTime, calculateProgress, getStatusColor, getStatusText } from '../utils/timeUtils';
import { sendImmediateNotification } from '../utils/notificationUtils';

const Timer = ({ timer }) => {
  const { isDarkMode } = useTheme();
  const { startTimer, pauseTimer, resetTimer, completeTimer, updateTimerTime } = useTimer();
  const intervalRef = useRef(null);

  const {
    id,
    name,
    duration,
    remainingTime,
    status,
    category,
    halfAlertTriggered = false,
  } = timer;

  const progress = calculateProgress(remainingTime, duration);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        updateTimerTime(id, Math.max(0, remainingTime - 1), halfAlertTriggered);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, remainingTime, id]);

  useEffect(() => {
    // Check for timer completion
    if (remainingTime <= 0 && status === 'running') {
      completeTimer(id);
      sendImmediateNotification(
        'Timer Complete!',
        `Your timer "${name}" has finished!`
      );
    }

    // Check for halfway alert
    if (!halfAlertTriggered && remainingTime <= duration / 2 && status === 'running') {
      updateTimerTime(id, remainingTime, true);
      sendImmediateNotification(
        'Halfway Point!',
        `You're halfway through "${name}"!`
      );
    }
  }, [remainingTime, status, id, duration, halfAlertTriggered]);

  const handleStart = () => {
    if (remainingTime > 0) {
      startTimer(id);
    }
  };

  const handlePause = () => {
    pauseTimer(id);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Timer',
      'Are you sure you want to reset this timer?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => resetTimer(id) },
      ]
    );
  };

  const getButtonColor = (buttonType) => {
    if (isDarkMode) {
      return buttonType === 'primary' ? '#4CAF50' : '#666';
    }
    return buttonType === 'primary' ? '#4CAF50' : '#ccc';
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#333' : '#fff' }
    ]}>
      <View style={styles.header}>
        <Text style={[
          styles.name,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>
          {name}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(status) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(status)}
          </Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={[
          styles.timeText,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>
          {formatTime(remainingTime)}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[
          styles.progressBar,
          { backgroundColor: isDarkMode ? '#555' : '#e0e0e0' }
        ]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: getStatusColor(status),
              }
            ]}
          />
        </View>
        <Text style={[
          styles.progressText,
          { color: isDarkMode ? '#ccc' : '#666' }
        ]}>
          {Math.round(progress)}%
        </Text>
      </View>

      <View style={styles.controls}>
        {status === 'running' ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getButtonColor('secondary') }]}
            onPress={handlePause}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getButtonColor('primary') }]}
            onPress={handleStart}
            disabled={remainingTime <= 0}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: getButtonColor('secondary') }]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={[
        styles.categoryText,
        { color: isDarkMode ? '#ccc' : '#666' }
      ]}>
        Category: {category}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Timer; 