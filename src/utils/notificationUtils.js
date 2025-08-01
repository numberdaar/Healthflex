import * as Notifications from 'expo-notifications';

/**
 * requestNotificationPermissions - Requests permission to send notifications
 * Checks current permission status and requests permission if not already granted
 * Used before sending any notifications to ensure user has given permission
 * 
 * @returns {Promise<boolean>} True if permission granted, false otherwise
 * 
 * Permission flow:
 * 1. Check existing permission status
 * 2. If not granted, request permission from user
 * 3. Return true if granted, false if denied
 */
export const requestNotificationPermissions = async () => {
  // Get current permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  // If permission not already granted, request it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  // Check if permission was granted
  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }
  
  return true;
};

/**
 * scheduleNotification - Schedules a notification for a specific time in the future
 * Used for timer completion notifications and scheduled alerts
 * 
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {number} seconds - Seconds from now to show notification (0 = immediate)
 * @returns {Promise<void>}
 * 
 * Examples:
 * - scheduleNotification("Timer Complete", "Your workout timer is done!", 60) - Shows in 1 minute
 * - scheduleNotification("Halfway Point", "You're halfway there!", 0) - Shows immediately
 */
export const scheduleNotification = async (title, body, seconds = 0) => {
  try {
    // Check if we have permission to send notifications
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title,        // Notification title
        body,         // Notification message
        sound: true,  // Play notification sound
      },
      trigger: seconds > 0 ? { seconds } : null, // Trigger after specified seconds, or immediately if 0
    });
  } catch (error) {
    console.log('Error scheduling notification:', error);
  }
};

/**
 * sendImmediateNotification - Sends a notification immediately
 * Used for halfway alerts and instant notifications
 * 
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @returns {Promise<void>}
 * 
 * Examples:
 * - sendImmediateNotification("Halfway Point!", "You're halfway through your workout!")
 * - sendImmediateNotification("Timer Complete", "Your timer has finished!")
 */
export const sendImmediateNotification = async (title, body) => {
  try {
    // Check if we have permission to send notifications
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Send immediate notification (trigger: null means show immediately)
    await Notifications.scheduleNotificationAsync({
      content: {
        title,        // Notification title
        body,         // Notification message
        sound: true,  // Play notification sound
      },
      trigger: null,  // null trigger means immediate notification
    });
  } catch (error) {
    console.log('Error sending immediate notification:', error);
  }
}; 