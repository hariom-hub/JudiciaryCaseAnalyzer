import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls
 * Handles loading, error states, and provides a clean interface for API requests
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Make an API request
   * @param {string} url - API endpoint URL
   * @param {object} options - Fetch options (method, headers, body, etc.)
   * @returns {Promise} - Response data
   */
  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // If body exists and is an object, stringify it
      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }

      const response = await fetch(url, config);

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setData(responseData);
      setLoading(false);
      return responseData;

    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * GET request
   */
  const get = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'GET' });
  }, [request]);

  /**
   * POST request
   */
  const post = useCallback((url, body, options = {}) => {
    return request(url, { ...options, method: 'POST', body });
  }, [request]);

  /**
   * PUT request
   */
  const put = useCallback((url, body, options = {}) => {
    return request(url, { ...options, method: 'PUT', body });
  }, [request]);

  /**
   * PATCH request
   */
  const patch = useCallback((url, body, options = {}) => {
    return request(url, { ...options, method: 'PATCH', body });
  }, [request]);

  /**
   * DELETE request
   */
  const del = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'DELETE' });
  }, [request]);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
};

export default useApi;

/**
 * Usage Example:
 * 
 * import useApi from './hooks/useApi';
 * 
 * function MyComponent() {
 *   const api = useApi();
 * 
 *   const fetchCases = async () => {
 *     try {
 *       const cases = await api.get('/api/cases');
 *       console.log(cases);
 *     } catch (error) {
 *       console.error('Failed to fetch cases:', error);
 *     }
 *   };
 * 
 *   const createCase = async (caseData) => {
 *     try {
 *       const newCase = await api.post('/api/cases', caseData);
 *       console.log('Case created:', newCase);
 *     } catch (error) {
 *       console.error('Failed to create case:', error);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       {api.loading && <p>Loading...</p>}
 *       {api.error && <p>Error: {api.error}</p>}
 *       <button onClick={fetchCases}>Fetch Cases</button>
 *     </div>
 *   );
 * }
 */