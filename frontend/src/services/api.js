// frontend/src/services/api.js
import axios from 'axios';

/**
 * Axios Instance Configuration
 * Base configuration for all API calls
 */

// Get API base URL from environment variable or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout (AI requests can take time)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Request Interceptor
 * Runs before every request is sent
 */
api.interceptors.request.use(
  (config) => {
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('📦 Request Data:', config.data);
      }
    }

    // Add authentication token if available (for future auth implementation)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Runs after every response is received
 */
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`);
      console.log('📨 Response Data:', response.data);
    }

    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error [${status}]:`, data?.message || error.message);

      // Handle specific error codes
      switch (status) {
        case 400:
          console.error('Bad Request:', data?.message);
          break;
        case 401:
          console.error('Unauthorized - Please login again');
          // Clear auth token and redirect to login (for future auth)
          localStorage.removeItem('authToken');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden - Access denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Too many requests - Please try again later');
          break;
        case 500:
          console.error('Internal Server Error');
          break;
        case 503:
          console.error('Service Unavailable');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ Network Error: No response from server');
      console.error('Please check your internet connection or server status');
    } else {
      // Error in request setup
      console.error('❌ Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API Helper Methods
 */

/**
 * Health check endpoint
 * @returns {Promise} Server health status
 */
api.healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic GET request with error handling
 * @param {string} url - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} Response data
 */
api.getRequest = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic POST request with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} Response data
 */
api.postRequest = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic PUT request with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} Response data
 */
api.putRequest = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic DELETE request with error handling
 * @param {string} url - API endpoint
 * @returns {Promise} Response data
 */
api.deleteRequest = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload file with progress tracking
 * @param {string} url - API endpoint
 * @param {FormData} formData - File data
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Response data
 */
api.uploadFile = async (url, formData, onProgress) => {
  try {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Batch requests (multiple requests in parallel)
 * @param {Array} requests - Array of request promises
 * @returns {Promise} Array of results
 */
api.batchRequests = async (requests) => {
  try {
    const results = await Promise.allSettled(requests);
    return results.map((result, index) => ({
      index,
      status: result.status,
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Retry failed request with exponential backoff
 * @param {Function} requestFn - Request function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Response data
 */
api.retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        const waitTime = delay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
};

/**
 * Cancel token for aborting requests
 * @returns {Object} Cancel token source
 */
api.createCancelToken = () => {
  return axios.CancelToken.source();
};

/**
 * Check if error is due to request cancellation
 * @param {Error} error - Error object
 * @returns {boolean} True if cancelled
 */
api.isCancel = (error) => {
  return axios.isCancel(error);
};

/**
 * Get base URL
 * @returns {string} API base URL
 */
api.getBaseURL = () => {
  return API_BASE_URL;
};

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
api.setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Clear authentication token
 */
api.clearAuthToken = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Format error message for display
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
api.formatError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    return 'Network error - Please check your connection';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// Export the configured axios instance
export default api;