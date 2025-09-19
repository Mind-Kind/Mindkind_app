// Utility functions for the MindKind application

/**
 * Creates a URL for a page based on the page name
 * @param {string} pageName - The name of the page
 * @returns {string} - The URL path for the page
 */
export const createPageUrl = (pageName) => {
  const pageMap = {
    'Dashboard': '/',
    'MoodTracker': '/mood-tracker',
    'Journal': '/journal',
    'Meditations': '/meditations',
    'AudioLibrary': '/audio-library',
    'AIChat': '/ai-chat',
    'Challenges': '/challenges',
    'ChallengeDetail': '/challenge-detail'
  };

  return pageMap[pageName] || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
};

/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format string (optional)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'MMM d, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Generates a unique ID
 * @returns {string} - A unique identifier
 */
export const generateId = () => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
