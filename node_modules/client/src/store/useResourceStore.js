import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useResourceStore = create((set) => ({
  resources: [],
  isLoading: false,

  fetchResources: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/resources');
      set({ resources: res.data });
    } catch (error) { toast.error('Failed to load resources'); }
    finally { set({ isLoading: false }); }
  },

  addResource: async (formData) => {
    try {
      const res = await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // essential for multer
      });
      set((state) => ({ resources: [...state.resources, res.data] }));
      toast.success('Resource added');
    } catch (error) { toast.error(error.response?.data?.message || 'Upload failed'); }
  },

  deleteResource: async (id) => {
    try {
      await api.delete(`/resources/${id}`);
      set((state) => ({ resources: state.resources.filter(r => r._id !== id) }));
      toast.success('Deleted');
    } catch (error) { toast.error('Failed to delete resource'); }
  }
}));
export default useResourceStore;
