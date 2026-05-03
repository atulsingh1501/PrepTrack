import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useSkillStore = create((set) => ({
  skills: [],
  isLoading: false,

  fetchSkills: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/skills');
      set({ skills: res.data });
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      set({ isLoading: false });
    }
  },

  addSkill: async (data) => {
    try {
      const res = await api.post('/skills', data);
      set((state) => ({ skills: [...state.skills, res.data] }));
      toast.success('Skill added');
    } catch (error) {
      toast.error('Failed to add skill');
    }
  },

  updateSkill: async (id, data) => {
    try {
      const res = await api.put(`/skills/${id}`, data);
      set((state) => ({
        skills: state.skills.map((s) => (s._id === id ? res.data : s)),
      }));
    } catch (error) {
      toast.error('Failed to update skill');
    }
  },

  deleteSkill: async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      set((state) => ({ skills: state.skills.filter((s) => s._id !== id) }));
      toast.success('Skill removed');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  },
}));

export default useSkillStore;
