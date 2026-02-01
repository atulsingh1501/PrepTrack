import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/tasks');
      set({ tasks: res.data });
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [...state.tasks, res.data] }));
      toast.success('Task added');
    } catch (error) {
      toast.error('Failed to add task');
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === id ? res.data : task))
      }));
    } catch (error) {
      toast.error('Failed to update task');
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id)
      }));
      toast.success('Task removed');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  }
}));

export default useTaskStore;
