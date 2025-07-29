export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const calculateProgress = (remainingTime, totalTime) => {
  if (totalTime === 0) return 0;
  return ((totalTime - remainingTime) / totalTime) * 100;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'running':
      return '#4CAF50';
    case 'paused':
      return '#FF9800';
    case 'completed':
      return '#2196F3';
    case 'stopped':
    default:
      return '#9E9E9E';
  }
};

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