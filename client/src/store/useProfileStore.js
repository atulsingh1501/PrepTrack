import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useProfileStore = create((set) => ({
  profiles: [],
  isLoading: false,

  fetchProfiles: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/profiles');
      set({ profiles: res.data });
    } catch (error) { toast.error('Failed to load profiles'); }
    finally { set({ isLoading: false }); }
  },

  addProfile: async (data) => {
    try {
      const res = await api.post('/profiles', data);
      set((state) => ({ profiles: [...state.profiles, res.data] }));
      toast.success('Profile added');
    } catch (error) { toast.error('Failed to add profile'); }
  },

  updateProfile: async (id, data) => {
    try {
      const res = await api.put(`/profiles/${id}`, data);
      set((state) => ({
        profiles: state.profiles.map(p => p._id === id ? res.data : p)
      }));
      toast.success('Profile updated');
    } catch (error) { toast.error('Failed to update profile'); }
  },

  deleteProfile: async (id) => {
    try {
      await api.delete(`/profiles/${id}`);
      set((state) => ({ profiles: state.profiles.filter(p => p._id !== id) }));
      toast.success('Deleted');
    } catch (error) { toast.error('Failed to delete profile'); }
  },

  reorderProfiles: (newOrder) => set({ profiles: newOrder }),
}));

export default useProfileStore;
