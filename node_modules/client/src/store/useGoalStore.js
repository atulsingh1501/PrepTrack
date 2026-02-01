import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useGoalStore = create((set) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/goals');
      set({ goals: res.data });
    } catch (error) { toast.error('Failed to load goals'); }
    finally { set({ isLoading: false }); }
  },

  addGoal: async (data) => {
    try {
      const res = await api.post('/goals', data);
      set((state) => ({ goals: [...state.goals, res.data] }));
      toast.success('Goal added');
    } catch (error) { toast.error('Failed to add goal'); }
  },

  updateProgress: async (id, newProgress) => {
    try {
      const res = await api.put(`/goals/${id}`, { progress: newProgress });
      set((state) => ({ goals: state.goals.map(g => g._id === id ? res.data : g) }));
      toast.success('Progress updated');
    } catch (error) { toast.error('Failed to update progress'); }
  },

  deleteGoal: async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      set((state) => ({ goals: state.goals.filter(g => g._id !== id) }));
      toast.success('Deleted');
    } catch (error) { toast.error('Failed to delete goal'); }
  }
}));
export default useGoalStore;
