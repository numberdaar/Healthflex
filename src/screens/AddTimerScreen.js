import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTimer } from '../context/TimerContext';

const AddTimerScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { addTimer } = useTimer();
  
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const predefinedCategories = [
    'Workout',
    'Study',
    'Break',
    'Cooking',
    'Reading',
    'Meditation',
    'Other'
  ];

  const predefinedDurations = [
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '15 minutes', value: 900 },
    { label: '20 minutes', value: 1200 },
    { label: '25 minutes', value: 1500 },
    { label: '30 minutes', value: 1800 },
    { label: '45 minutes', value: 2700 },
    { label: '1 hour', value: 3600 },
  ];

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name');
      return false;
    }
    
    if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in seconds');
      return false;
    }

    const selectedCategory = category === 'Other' ? customCategory : category;
    if (!selectedCategory.trim()) {
      Alert.alert('Error', 'Please select or enter a category');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const selectedCategory = category === 'Other' ? customCategory : category;
    const timerData = {
      name: name.trim(),
      duration: parseInt(duration),
      remainingTime: parseInt(duration),
      category: selectedCategory,
      status: 'stopped',
      halfAlertTriggered: false,
    };

    addTimer(timerData);
    Alert.alert(
      'Success',
      'Timer created successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleDurationSelect = (seconds) => {
    setDuration(seconds.toString());
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    if (selectedCategory !== 'Other') {
      setCustomCategory('');
    }
  };

  return (
    <ScrollView style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }
    ]}>
      <View style={styles.content}>
        {/* Timer Name */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            Timer Name
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? '#333' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#555' : '#ddd'
              }
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter timer name"
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
            maxLength={50}
          />
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            Duration (seconds)
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? '#333' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#555' : '#ddd'
              }
            ]}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration in seconds"
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
            keyboardType="numeric"
          />
          
          <Text style={[
            styles.sectionSubtitle,
            { color: isDarkMode ? '#ccc' : '#666' }
          ]}>
            Quick Select:
          </Text>
          <View style={styles.quickSelectGrid}>
            {predefinedDurations.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickSelectButton,
                  duration === item.value.toString() && {
                    backgroundColor: isDarkMode ? '#4CAF50' : '#4CAF50',
                  }
                ]}
                onPress={() => handleDurationSelect(item.value)}
              >
                <Text style={[
                  styles.quickSelectText,
                  duration === item.value.toString() && { color: '#fff' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            Category
          </Text>
          
          <View style={styles.categoryGrid}>
            {predefinedCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && {
                    backgroundColor: isDarkMode ? '#4CAF50' : '#4CAF50',
                  }
                ]}
                onPress={() => handleCategorySelect(cat)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat && { color: '#fff' }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {category === 'Other' && (
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ddd',
                  marginTop: 12
                }
              ]}
              value={customCategory}
              onChangeText={setCustomCategory}
              placeholder="Enter custom category"
              placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
              maxLength={30}
            />
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#4CAF50' }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Create Timer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  quickSelectButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quickSelectText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 80,
    alignItems: 'center',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTimerScreen; 