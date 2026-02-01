import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useTrackerStore = create((set) => ({
  trackerData: null,
  isLoading: false,

  fetchTrackerData: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/tracker/data');
      set({ trackerData: res.data });
    } catch (error) {
      toast.error('Failed to load tracker stats');
    } finally {
      set({ isLoading: false });
    }
  },

  updateUsernames: async (usernames) => {
    try {
      await api.put('/tracker/usernames', usernames);
      toast.success('Usernames saved successfully');
      // refetch after updating
      const res = await api.get('/tracker/data');
      set({ trackerData: res.data });
    } catch (error) {
      toast.error('Failed to update usernames');
    }
  }
}));

export default useTrackerStore;
