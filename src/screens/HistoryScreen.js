import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTimer } from '../context/TimerContext';
import { formatDuration } from '../utils/timeUtils';
import * as FileSystem from 'expo-file-system';

const HistoryScreen = () => {
  const { isDarkMode } = useTheme();
  const { history, clearHistory } = useTimer();
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Group history by date
  const groupedHistory = useMemo(() => {
    const groups = {};
    history.forEach(item => {
      const date = new Date(item.completedAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  }, [history]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(history.map(item => item.category))];
    return cats;
  }, [history]);

  // Filter history based on selected category
  const filteredHistory = useMemo(() => {
    if (selectedFilter === 'All') {
      return groupedHistory;
    }
    
    const filtered = {};
    Object.entries(groupedHistory).forEach(([date, items]) => {
      const filteredItems = items.filter(item => item.category === selectedFilter);
      if (filteredItems.length > 0) {
        filtered[date] = filteredItems;
      }
    });
    return filtered;
  }, [groupedHistory, selectedFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = history.length;
    const totalTime = history.reduce((sum, item) => sum + item.duration, 0);
    const categories = new Set(history.map(item => item.category));
    
    return { total, totalTime, uniqueCategories: categories.size };
  }, [history]);

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

  const handleExportHistory = async () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalCompleted: history.length,
        history: history.map(item => ({
          ...item,
          completedAt: new Date(item.completedAt).toLocaleString(),
        })),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `timer_history_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      await Share.share({
        url: fileUri,
        title: 'Timer History Export',
        message: 'Here is your exported timer history data.',
      });
    } catch (error) {
      console.log('Error exporting history:', error);
      Alert.alert('Error', 'Failed to export history. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }
    ]}>
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
            Completed
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[
            styles.statNumber,
            { color: '#4CAF50' }
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
        <View style={styles.statItem}>
          <Text style={[
            styles.statNumber,
            { color: '#2196F3' }
          ]}>
            {stats.uniqueCategories}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDarkMode ? '#ccc' : '#666' }
          ]}>
            Categories
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
              selectedFilter === category && {
                backgroundColor: isDarkMode ? '#4CAF50' : '#4CAF50',
              }
            ]}
            onPress={() => setSelectedFilter(category)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === category && { color: '#fff' }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* History List */}
      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {Object.keys(filteredHistory).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[
              styles.emptyStateText,
              { color: isDarkMode ? '#ccc' : '#666' }
            ]}>
              {selectedFilter === 'All' 
                ? 'No completed timers yet. Start a timer to see history!'
                : `No completed timers in ${selectedFilter} category.`
              }
            </Text>
          </View>
        ) : (
          Object.entries(filteredHistory).map(([date, items]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[
                styles.dateHeader,
                { color: isDarkMode ? '#fff' : '#000' }
              ]}>
                {formatDate(date)}
              </Text>
              {items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.historyItem,
                    { backgroundColor: isDarkMode ? '#333' : '#fff' }
                  ]}
                >
                  <View style={styles.historyItemHeader}>
                    <Text style={[
                      styles.timerName,
                      { color: isDarkMode ? '#fff' : '#000' }
                    ]}>
                      {item.timerName}
                    </Text>
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(item.category) }
                    ]}>
                      <Text style={styles.categoryText}>
                        {item.category}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.historyItemDetails}>
                    <Text style={[
                      styles.durationText,
                      { color: isDarkMode ? '#ccc' : '#666' }
                    ]}>
                      Duration: {formatDuration(item.duration)}
                    </Text>
                    <Text style={[
                      styles.timeText,
                      { color: isDarkMode ? '#ccc' : '#666' }
                    ]}>
                      Completed: {formatTime(item.completedAt)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[
        styles.actionButtons,
        { backgroundColor: isDarkMode ? '#2d2d2d' : '#fff' }
      ]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          onPress={handleExportHistory}
        >
          <Text style={styles.actionButtonText}>Export</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f44336' }]}
          onPress={handleClearHistory}
        >
          <Text style={styles.actionButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getCategoryColor = (category) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 18,
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
  historyList: {
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
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  historyItem: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 14,
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
});

export default HistoryScreen; 