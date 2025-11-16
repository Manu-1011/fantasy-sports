// ====== api client config =====
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports';

export const apiClient = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  }
};

