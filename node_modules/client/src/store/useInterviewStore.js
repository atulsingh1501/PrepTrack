import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useInterviewStore = create((set) => ({
  interviews: [],
  isLoading: false,

  fetchInterviews: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/interviews');
      set({ interviews: res.data });
    } catch (error) { toast.error('Failed to load interviews'); } 
    finally { set({ isLoading: false }); }
  },

  addInterview: async (data) => {
    try {
      const res = await api.post('/interviews', data);
      set((state) => ({ interviews: [...state.interviews, res.data] }));
      toast.success('Interview logged');
    } catch (error) { toast.error('Failed to add interview'); }
  },

  updateInterview: async (id, data) => {
    try {
      const res = await api.put(`/interviews/${id}`, data);
      set((state) => ({ interviews: state.interviews.map(i => i._id === id ? res.data : i) }));
      toast.success('Updated');
    } catch (error) { toast.error('Failed to update interview'); }
  },

  deleteInterview: async (id) => {
    try {
      await api.delete(`/interviews/${id}`);
      set((state) => ({ interviews: state.interviews.filter(i => i._id !== id) }));
      toast.success('Deleted');
    } catch (error) { toast.error('Failed to delete interview'); }
  }
}));
export default useInterviewStore;
