import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useProjectStore = create((set) => ({
  projects: [],
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/projects');
      set({ projects: res.data });
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      set({ isLoading: false });
    }
  },

  addProject: async (data) => {
    try {
      const res = await api.post('/projects', data);
      set((state) => ({ projects: [...state.projects, res.data] }));
      toast.success('Project added');
    } catch (error) {
      toast.error('Failed to add project');
    }
  },

  updateProject: async (id, data) => {
    try {
      const res = await api.put(`/projects/${id}`, data);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? res.data : p)),
      }));
      toast.success('Project updated');
    } catch (error) {
      toast.error('Failed to update project');
    }
  },

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({ projects: state.projects.filter((p) => p._id !== id) }));
      toast.success('Project removed');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  },
}));

export default useProjectStore;
