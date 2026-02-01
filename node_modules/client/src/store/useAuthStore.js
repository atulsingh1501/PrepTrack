import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // Endpoint to get me/profile using access token (if available) or it'll trigger refresh interceptor
      // Since we don't have token initially on refresh, we try refresh first
      const refreshRes = await api.post('/auth/refresh');
      const token = refreshRes.data.accessToken;
      
      set({ accessToken: token, isAuthenticated: true });
      
      // fetch profile
      const userRes = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: userRes.data });
      
    } catch (error) {
      set({ user: null, accessToken: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      set({ 
        user: res.data, 
        accessToken: res.data.accessToken,
        isAuthenticated: true 
      });
      toast.success('Registration successful. Welcome!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      set({ 
        user: res.data, 
        accessToken: res.data.accessToken,
        isAuthenticated: true 
      });
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async (automatic = false) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // ignore
    } finally {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      if (automatic) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.success('Logged out');
      }
    }
  }
}));

export default useAuthStore;
