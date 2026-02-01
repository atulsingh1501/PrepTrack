import axios from 'axios';

// Base instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Crucial for sending/receiving cookies
});

// Response interceptor setup
export const setupInterceptors = (store) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 and it's not a retry or auth route itself
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/')
      ) {
        originalRequest._retry = true;
        try {
          // Attempt to refresh token
          const res = await api.post('/auth/refresh');
          const newAccessToken = res.data.accessToken;
          
          // Inform store
          store.getState().setAccessToken(newAccessToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          store.getState().logout(true); // pass flag that it was automatic
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  // Request interceptor to attach access token
  api.interceptors.request.use((config) => {
    const token = store.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));
};

export default api;
