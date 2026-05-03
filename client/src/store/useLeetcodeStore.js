import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useLeetcodeStore = create((set) => ({
  problems: [],
  isLoading: false,

  fetchProblems: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/leetcode');
      set({ problems: res.data });
    } catch (error) {
      toast.error('Failed to load problems');
    } finally {
      set({ isLoading: false });
    }
  },

  addProblem: async (data) => {
    try {
      const res = await api.post('/leetcode', data);
      set((state) => ({ problems: [res.data, ...state.problems] }));
      toast.success('Problem logged successfully');
    } catch (error) {
      toast.error('Failed to log problem');
    }
  },

  updateProblem: async (id, data) => {
    try {
      const res = await api.put(`/leetcode/${id}`, data);
      set((state) => ({
        problems: state.problems.map((p) => (p._id === id ? res.data : p)),
      }));
      toast.success('Problem updated');
    } catch (error) {
      toast.error('Failed to update problem');
    }
  },

  deleteProblem: async (id) => {
    try {
      await api.delete(`/leetcode/${id}`);
      set((state) => ({ problems: state.problems.filter((p) => p._id !== id) }));
      toast.success('Problem removed');
    } catch (error) {
      toast.error('Failed to delete problem');
    }
  },
}));

export default useLeetcodeStore;
