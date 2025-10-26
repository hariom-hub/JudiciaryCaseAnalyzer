import { UI_CONSTANTS, VALIDATION_MESSAGES } from './constants';

/**
 * Date Formatting Helpers
 */

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('en-US', options);
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now - d;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Text Formatting Helpers
 */

// Truncate text to specified length
export const truncateText = (text, maxLength = UI_CONSTANTS.TRUNCATE_LENGTH) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Capitalize first letter
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Convert string to title case
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Remove extra whitespace
export const sanitizeText = (text) => {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
};

// Convert snake_case to Title Case
export const snakeToTitle = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validation Helpers
 */

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate case text length
export const validateCaseText = (text) => {
  if (!text || text.trim().length === 0) {
    return { valid: false, message: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }
  
  const length = text.trim().length;
  
  if (length < UI_CONSTANTS.MIN_TEXT_LENGTH) {
    return { valid: false, message: VALIDATION_MESSAGES.CASE_TEXT_TOO_SHORT };
  }
  
  if (length > UI_CONSTANTS.MAX_TEXT_LENGTH) {
    return { valid: false, message: VALIDATION_MESSAGES.CASE_TEXT_TOO_LONG };
  }
  
  return { valid: true, message: '' };
};

// Validate required field
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

// Validate API key format (basic check)
export const validateApiKey = (key) => {
  if (!key || key.trim().length === 0) {
    return { valid: false, message: VALIDATION_MESSAGES.API_KEY_REQUIRED };
  }
  
  if (key.length < 20) {
    return { valid: false, message: 'API key appears to be invalid' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Array and Object Helpers
 */

// Sort array of objects by key
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (!value) return false;
      return value.toString().toLowerCase().includes(term);
    });
  });
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Remove duplicates from array
export const removeDuplicates = (array) => {
  return [...new Set(array)];
};

/**
 * API and Error Helpers
 */

// Extract error message from error object
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || error.response.data?.error || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred';
  }
};

// Create query string from object
export const createQueryString = (params) => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return filteredParams ? `?${filteredParams}` : '';
};

/**
 * Number and Statistics Helpers
 */

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Round to decimal places
export const roundToDecimal = (num, decimals = 2) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Storage Helpers
 */

// Safely get from localStorage
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

// Safely set to localStorage
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
    return false;
  }
};

// Remove from localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
    return false;
  }
};

// Clear all localStorage
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
    return false;
  }
};

/**
 * ID Generation
 */

// Generate random ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce Function
 */

// Debounce function calls
export const debounce = (func, delay = UI_CONSTANTS.DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * File Helpers
 */

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Color Helpers
 */

// Get status color based on case status
export const getStatusColor = (status) => {
  const colorMap = {
    'Pending': 'warning',
    'In Progress': 'info',
    'Completed': 'success',
    'Closed': 'secondary',
    'Appealed': 'primary'
  };
  return colorMap[status] || 'secondary';
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colorMap = {
    'Low': 'success',
    'Medium': 'info',
    'High': 'warning',
    'Urgent': 'danger'
  };
  return colorMap[priority] || 'secondary';
};

/**
 * Copy to Clipboard
 */

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: 'Copied to clipboard!' };
  } catch (error) {
    return { success: false, message: 'Failed to copy to clipboard' };
  }
};

/**
 * Download Helpers
 */

// Download text as file
export const downloadAsFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  formatDate,
  formatDateTime,
  getRelativeTime,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  sanitizeText,
  snakeToTitle,
  isValidEmail,
  validateCaseText,
  validateRequired,
  validateApiKey,
  sortByKey,
  filterBySearch,
  groupBy,
  removeDuplicates,
  getErrorMessage,
  createQueryString,
  formatNumber,
  calculatePercentage,
  roundToDecimal,
  getFromStorage,
  setToStorage,
  removeFromStorage,
  clearStorage,
  generateId,
  debounce,
  formatFileSize,
  getStatusColor,
  getPriorityColor,
  copyToClipboard,
  downloadAsFile
};