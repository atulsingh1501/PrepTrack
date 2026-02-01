import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useNoteStore = create((set) => ({
  notes: [],
  isLoading: false,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/notes');
      set({ notes: res.data });
    } catch (error) { toast.error('Failed to load notes'); }
    finally { set({ isLoading: false }); }
  },

  addNote: async (data) => {
    try {
      const res = await api.post('/notes', data);
      set((state) => ({ notes: [...state.notes, res.data] }));
      toast.success('Note saved');
    } catch (error) { toast.error('Failed to add note'); }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({ notes: state.notes.filter(n => n._id !== id) }));
      toast.success('Deleted');
    } catch (error) { toast.error('Failed to delete note'); }
  }
}));
export default useNoteStore;
