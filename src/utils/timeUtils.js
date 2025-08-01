/**
 * formatTime - Converts total seconds to MM:SS or HH:MM:SS format
 * Used for displaying timer countdown in a readable format
 * 
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (e.g., "02:05" or "01:30:45")
 * 
 * Examples:
 * - 125 seconds → "02:05"
 * - 3661 seconds → "01:01:01"
 * - 45 seconds → "00:45"
 */
export const formatTime = (seconds) => {
  // Calculate hours, minutes, and seconds from total seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // If there are hours, show HH:MM:SS format
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  // Otherwise show MM:SS format
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * formatDuration - Converts seconds to human-readable duration format
 * Used for displaying timer duration in a user-friendly way
 * 
 * @param {number} seconds - Total seconds to format
 * @returns {string} Human-readable duration (e.g., "1h 30m 15s" or "45m 30s")
 * 
 * Examples:
 * - 3661 seconds → "1h 1m 1s"
 * - 1830 seconds → "30m 30s"
 * - 45 seconds → "45s"
 */
export const formatDuration = (seconds) => {
  // Calculate hours, minutes, and seconds from total seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Return appropriate format based on duration length
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

/**
 * calculateProgress - Calculates the percentage of time completed
 * Used for progress bars and visual indicators
 * 
 * @param {number} remainingTime - Time remaining in seconds
 * @param {number} totalTime - Total timer duration in seconds
 * @returns {number} Percentage completed (0-100)
 * 
 * Examples:
 * - 30 seconds remaining, 60 total → 50%
 * - 0 seconds remaining, 60 total → 100%
 * - 60 seconds remaining, 60 total → 0%
 */
export const calculateProgress = (remainingTime, totalTime) => {
  // Prevent division by zero
  if (totalTime === 0) return 0;
  // Calculate percentage: (completed time / total time) * 100
  return ((totalTime - remainingTime) / totalTime) * 100;
};

/**
 * getStatusColor - Returns hex color based on timer status
 * Used for styling timer components and progress indicators
 * 
 * @param {string} status - Timer status ('running', 'paused', 'completed', 'stopped')
 * @returns {string} Hex color code for the status
 * 
 * Color mapping:
 * - 'running' → Green (#4CAF50) - Active timer
 * - 'paused' → Orange (#FF9800) - Paused timer
 * - 'completed' → Blue (#2196F3) - Finished timer
 * - 'stopped' → Gray (#9E9E9E) - Inactive timer
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'running':
      return '#4CAF50';  // Green for active timer
    case 'paused':
      return '#FF9800';  // Orange for paused timer
    case 'completed':
      return '#2196F3';  // Blue for completed timer
    case 'stopped':
    default:
      return '#9E9E9E';  // Gray for stopped/inactive timer
  }
};

/**
 * getStatusText - Returns human-readable text based on timer status
 * Used for displaying timer status in the UI
 * 
 * @param {string} status - Timer status ('running', 'paused', 'completed', 'stopped')
 * @returns {string} Human-readable status text
 * 
 * Text mapping:
 * - 'running' → "Running"
 * - 'paused' → "Paused"
 * - 'completed' → "Completed"
 * - 'stopped' → "Stopped"
 */
export const getStatusText = (status) => {
  switch (status) {
    case 'running':
      return 'Running';
    case 'paused':
      return 'Paused';
    case 'completed':
      return 'Completed';
    case 'stopped':
    default:
      return 'Stopped';
  }
}; 