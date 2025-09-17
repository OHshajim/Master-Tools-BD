import { formatDistanceToNow } from 'date-fns';

/**
 * Formats a date string to a more readable format including time
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  }).format(date);
};

/**
 * Formats a date string to a relative time format (e.g., "4 minutes ago")
 */
export const formatRelativeDate = (dateString?: string) => {
  if (!dateString) return '';
  
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (err) {
    return '';
  }
};
