import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTimer } from '../context/TimerContext';
import Timer from './Timer';

const CategoryGroup = ({ category, timers }) => {
  const { isDarkMode } = useTheme();
  const { startAllTimersInCategory, pauseAllTimersInCategory, resetAllTimersInCategory } = useTimer();
  const [isExpanded, setIsExpanded] = useState(true);
  const [animation] = useState(new Animated.Value(1));

  const runningTimers = timers.filter(timer => timer.status === 'running');
  const pausedTimers = timers.filter(timer => timer.status === 'paused');
  const completedTimers = timers.filter(timer => timer.status === 'completed');

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const handleStartAll = () => {
    startAllTimersInCategory(category);
  };

  const handlePauseAll = () => {
    pauseAllTimersInCategory(category);
  };

  const handleResetAll = () => {
    resetAllTimersInCategory(category);
  };

  const getCategoryColor = () => {
    const colors = {
      'Workout': '#FF6B6B',
      'Study': '#4ECDC4',
      'Break': '#45B7D1',
      'Cooking': '#96CEB4',
      'Reading': '#FFEAA7',
      'Meditation': '#DDA0DD',
      'Other': '#A8A8A8',
    };
    return colors[category] || colors['Other'];
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa' }
    ]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[
            styles.categoryIndicator,
            { backgroundColor: getCategoryColor() }
          ]} />
          <Text style={[
            styles.categoryTitle,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            {category}
          </Text>
          <Text style={[
            styles.timerCount,
            { color: isDarkMode ? '#ccc' : '#666' }
          ]}>
            ({timers.length} timers)
          </Text>
        </View>
        
        <View style={styles.statusIndicators}>
          {runningTimers.length > 0 && (
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
          )}
          {pausedTimers.length > 0 && (
            <View style={[styles.statusDot, { backgroundColor: '#FF9800' }]} />
          )}
          {completedTimers.length > 0 && (
            <View style={[styles.statusDot, { backgroundColor: '#2196F3' }]} />
          )}
        </View>
      </TouchableOpacity>

      <Animated.View style={[
        styles.content,
        {
          maxHeight: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000],
          }),
          opacity: animation,
        }
      ]}>
        {isExpanded && (
          <>
            <View style={styles.bulkActions}>
              <TouchableOpacity
                style={[styles.bulkButton, { backgroundColor: '#4CAF50' }]}
                onPress={handleStartAll}
                disabled={runningTimers.length === timers.length}
              >
                <Text style={styles.bulkButtonText}>Start All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.bulkButton, { backgroundColor: '#FF9800' }]}
                onPress={handlePauseAll}
                disabled={runningTimers.length === 0}
              >
                <Text style={styles.bulkButtonText}>Pause All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.bulkButton, { backgroundColor: '#666' }]}
                onPress={handleResetAll}
              >
                <Text style={styles.bulkButtonText}>Reset All</Text>
              </TouchableOpacity>
            </View>

            {timers.map(timer => (
              <Timer key={timer.id} timer={timer} />
            ))}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  timerCount: {
    fontSize: 14,
  },
  statusIndicators: {
    flexDirection: 'row',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    overflow: 'hidden',
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  bulkButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  bulkButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CategoryGroup; 