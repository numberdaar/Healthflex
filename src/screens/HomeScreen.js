import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTimer } from '../context/TimerContext';
import CategoryGroup from '../components/CategoryGroup';
import { formatDuration } from '../utils/timeUtils';

const HomeScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { timers, clearHistory } = useTimer();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedTimer, setCompletedTimer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Group timers by category
  const groupedTimers = useMemo(() => {
    const groups = {};
    timers.forEach(timer => {
      if (!groups[timer.category]) {
        groups[timer.category] = [];
      }
      groups[timer.category].push(timer);
    });
    return groups;
  }, [timers]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = ['All', ...Object.keys(groupedTimers)];
    return cats;
  }, [groupedTimers]);

  // Filter timers based on selected category
  const filteredTimers = useMemo(() => {
    if (selectedCategory === 'All') {
      return groupedTimers;
    }
    return { [selectedCategory]: groupedTimers[selectedCategory] || [] };
  }, [groupedTimers, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = timers.length;
    const running = timers.filter(t => t.status === 'running').length;
    const completed = timers.filter(t => t.status === 'completed').length;
    const totalTime = timers.reduce((sum, t) => sum + t.duration, 0);
    
    return { total, running, completed, totalTime };
  }, [timers]);

  const handleAddTimer = () => {
    navigation.navigate('AddTimer');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all timer history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  const showCompletionMessage = (timer) => {
    setCompletedTimer(timer);
    setShowCompletionModal(true);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }
    ]}>
      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: isDarkMode ? '#2d2d2d' : '#fff' }
      ]}>
        <Text style={[
          styles.title,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>
          HealthFlex Timer
        </Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={styles.themeButtonText}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={[
        styles.statsContainer,
        { backgroundColor: isDarkMode ? '#333' : '#fff' }
      ]}>
        <View style={styles.statItem}>
          <Text style={[
            styles.statNumber,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            {stats.total}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDarkMode ? '#ccc' : '#666' }
          ]}>
            Total Timers
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[
            styles.statNumber,
            { color: '#4CAF50' }
          ]}>
            {stats.running}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDarkMode ? '#ccc' : '#666' }
          ]}>
            Running
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[
            styles.statNumber,
            { color: '#2196F3' }
          ]}>
            {stats.completed}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDarkMode ? '#ccc' : '#666' }
          ]}>
            Completed
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[
            styles.statNumber,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            {formatDuration(stats.totalTime)}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDarkMode ? '#ccc' : '#666' }
          ]}>
            Total Time
          </Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && {
                backgroundColor: isDarkMode ? '#4CAF50' : '#4CAF50',
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCategory === category && { color: '#fff' }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Timer List */}
      <ScrollView style={styles.timerList} showsVerticalScrollIndicator={false}>
        {Object.keys(filteredTimers).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[
              styles.emptyStateText,
              { color: isDarkMode ? '#ccc' : '#666' }
            ]}>
              {selectedCategory === 'All' 
                ? 'No timers yet. Create your first timer!'
                : `No timers in ${selectedCategory} category.`
              }
            </Text>
          </View>
        ) : (
          Object.entries(filteredTimers).map(([category, timers]) => (
            <CategoryGroup
              key={category}
              category={category}
              timers={timers}
            />
          ))
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[
        styles.actionButtons,
        { backgroundColor: isDarkMode ? '#2d2d2d' : '#fff' }
      ]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={handleAddTimer}
        >
          <Text style={styles.actionButtonText}>+ Add Timer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          onPress={handleViewHistory}
        >
          <Text style={styles.actionButtonText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? '#333' : '#fff' }
          ]}>
            <Text style={[
              styles.modalTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>
              🎉 Timer Complete!
            </Text>
            <Text style={[
              styles.modalMessage,
              { color: isDarkMode ? '#ccc' : '#666' }
            ]}>
              Congratulations! You've completed "{completedTimer?.name}"
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => setShowCompletionModal(false)}
            >
              <Text style={styles.modalButtonText}>Great!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
  },
  themeButtonText: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timerList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 24,
    borderRadius: 12,
    marginHorizontal: 32,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 