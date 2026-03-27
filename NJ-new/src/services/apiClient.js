// API Client for making HTTP requests
import { API_ENDPOINTS } from '../config/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  // Read response body once
  let responseText = '';
  try {
    responseText = await response.text();
  } catch (e) {
    console.error('Failed to read response body:', e);
    throw new Error('Failed to read response from server');
  }

  // Try to parse as JSON
  let jsonData = null;
  if (responseText) {
    try {
      jsonData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn('Response is not valid JSON:', responseText.substring(0, 100));
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;
    
    if (jsonData && jsonData.message) {
      errorMessage = jsonData.message;
    } else if (jsonData) {
      errorMessage = `Server Error (${response.status}): ${JSON.stringify(jsonData).substring(0, 100)}`;
    } else if (responseText) {
      errorMessage = `Server Error (${response.status}): ${responseText.substring(0, 100)}`;
    }
    
    throw new Error(errorMessage);
  }

  if (!jsonData) {
    if (responseText) {
      console.warn('Could not parse JSON from response:', responseText.substring(0, 100));
      throw new Error('Backend returned invalid response format');
    }
    // Empty response is valid for some endpoints
    return null;
  }
  
  return jsonData;
}

export const apiClient = {
  // GET requests
  get: async (url, options = {}) => {
    try {
      console.log(`📡 GET ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  // POST requests
  post: async (url, data, options = {}) => {
    try {
      console.log(`📡 POST ${url}`, data);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  // PUT requests
  put: async (url, data, options = {}) => {
    try {
      console.log(`📡 PUT ${url}`, data);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  // DELETE requests
  delete: async (url, options = {}) => {
    try {
      console.log(`📡 DELETE ${url}`);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

export default apiClient;
