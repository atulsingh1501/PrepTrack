import React, { useState, useEffect, useMemo } from 'react';
import useInterviewStore from '../store/useInterviewStore';
import { 
  Calendar, Briefcase, Clock, Monitor, MapPin, 
  ChevronDown, ChevronUp, Star, Edit2, Trash2, 
  Plus, Video, Users
} from 'lucide-react';
import { format, isThisWeek } from 'date-fns';
import { DndContext, closestCorners, useDraggable, useDroppable } from '@dnd-kit/core';

const COLUMNS = [
  { id: 'Scheduled', title: 'Scheduled', color: 'border-b-blue-500' },
  { id: 'In Progress', title: 'In Progress', color: 'border-b-amber-500' },
  { id: 'Done', title: 'Done', color: 'border-b-emerald-500' }
];

const ROUND_COLORS = {
  'Technical': 'border-l-indigo-500',
  'HR': 'border-l-rose-500',
  'System Design': 'border-l-purple-500',
  'Behavioral': 'border-l-amber-500',
  'Other': 'border-l-gray-500'
};

const DraggableCard = ({ interview, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: interview._id,
    data: { interview }
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none'
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`glass-card p-5 rounded-2xl border-l-4 ${ROUND_COLORS[interview.round] || 'border-l-gray-500'} flex flex-col gap-3 relative group transition-all`}
    >
      <div 
        {...listeners} {...attributes} 
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />
      
      {/* Action Buttons (z-10 to prevent drag overlap) */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => onEdit(interview)} className="p-1.5 bg-dark-900 rounded-md text-gray-400 hover:text-white">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(interview._id)} className="p-1.5 bg-dark-900 rounded-md text-gray-400 hover:text-rose-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative z-10 pointer-events-none">
        <div className="flex flex-col gap-1 mb-2 pr-12">
          <h3 className="font-black text-white text-lg">{interview.company}</h3>
          <p className="font-semibold text-gray-400 text-sm">{interview.role}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <span className="px-2.5 py-1 bg-white/5 text-gray-300 rounded-md text-xs font-bold border border-white/5">
            {interview.round}
          </span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${interview.mode === 'Online' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            {interview.mode === 'Online' ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            {interview.mode}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-2">
          <Clock className="w-3.5 h-3.5" />
          {format(new Date(interview.date), 'MMM d, yyyy • h:mm a')}
        </div>
      </div>

      {interview.notes && (
        <div className="relative z-10 mt-1 border-t border-white/5 pt-3">
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-xs font-bold text-gray-400 hover:text-white transition-colors">
            Prep Notes {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {isExpanded && (
            <p className="mt-2 text-sm text-gray-400 italic bg-dark-950 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
              {interview.notes}
            </p>
          )}
        </div>
      )}

      {interview.status === 'Done' && interview.feedback && (
        <div className="relative z-10 mt-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-3.5 h-3.5 ${star <= (interview.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">"{interview.feedback}"</p>
        </div>
      )}
    </div>
  );
};

const DroppableColumn = ({ column, interviews, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col h-full bg-dark-900/50 rounded-3xl border border-white/5 overflow-hidden transition-colors ${isOver ? 'bg-dark-800 border-white/20' : ''}`}
    >
      <div className={`p-4 bg-dark-950 border-b-2 ${column.color} flex items-center justify-between`}>
        <h2 className="font-bold text-white text-lg">{column.title}</h2>
        <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-bold text-gray-300">
          {interviews.length}
        </span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4 min-h-[200px]">
        {interviews.map(inv => (
          <DraggableCard key={inv._id} interview={inv} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default function InterviewBoard() {
  const { interviews, isLoading, fetchInterviews, addInterview, updateInterview, deleteInterview } = useInterviewStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  
  const [formData, setFormData] = useState({
    company: '', role: '', type: 'Mock', round: 'Technical', mode: 'Online', 
    date: '', status: 'Scheduled', notes: '', rating: 0, feedback: ''
  });

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const interviewId = active.id;
    const newStatus = over.id;
    const interview = interviews.find(i => i._id === interviewId);

    if (interview && interview.status !== newStatus) {
      updateInterview(interviewId, { status: newStatus });
    }
  };

  const handleOpenModal = (interview = null) => {
    if (interview) {
      setEditingInterview(interview);
      setFormData({
        company: interview.company, role: interview.role, type: interview.type, 
        round: interview.round, mode: interview.mode, 
        date: interview.date ? new Date(interview.date).toISOString().slice(0, 16) : '', 
        status: interview.status, notes: interview.notes || '', 
        rating: interview.rating || 0, feedback: interview.feedback || ''
      });
    } else {
      setEditingInterview(null);
      setFormData({
        company: '', role: '', type: 'Mock', round: 'Technical', mode: 'Online', 
        date: '', status: 'Scheduled', notes: '', rating: 0, feedback: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingInterview) await updateInterview(editingInterview._id, formData);
    else await addInterview(formData);
    setIsModalOpen(false);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = interviews.length;
    const thisWeek = interviews.filter(i => isThisWeek(new Date(i.date))).length;
    const completed = interviews.filter(i => i.status === 'Done').length;
    const doneWithRating = interviews.filter(i => i.status === 'Done' && i.rating);
    const avgRating = doneWithRating.length ? (doneWithRating.reduce((a, b) => a + b.rating, 0) / doneWithRating.length).toFixed(1) : 0;
    
    return { total, thisWeek, completed, avgRating };
  }, [interviews]);

  return (
    <div className="h-screen flex flex-col p-6 md:p-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full animate-fade-up space-y-6">
        
        {/* Header & Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-400" /> Interview Board
            </h1>
            <p className="text-gray-400 mt-1 font-medium">Track your mock and real interviews with a Kanban workflow.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-dark-900 border border-white/5 rounded-xl p-2 gap-4 mr-4">
              <div className="px-3">
                <p className="text-[10px] uppercase font-bold text-gray-500">Scheduled</p>
                <p className="text-xl font-black text-white">{stats.total - stats.completed}</p>
              </div>
              <div className="px-3 border-l border-white/5">
                <p className="text-[10px] uppercase font-bold text-gray-500">This Week</p>
                <p className="text-xl font-black text-indigo-400">{stats.thisWeek}</p>
              </div>
              <div className="px-3 border-l border-white/5">
                <p className="text-[10px] uppercase font-bold text-gray-500">Completed</p>
                <p className="text-xl font-black text-emerald-400">{stats.completed}</p>
              </div>
              <div className="px-3 border-l border-white/5">
                <p className="text-[10px] uppercase font-bold text-gray-500">Avg Rating</p>
                <p className="text-xl font-black text-amber-400 flex items-center gap-1">{stats.avgRating} <Star className="w-3 h-3 fill-amber-400" /></p>
              </div>
            </div>
            <button onClick={() => handleOpenModal()} className="btn-primary shadow-glow-indigo shrink-0">
              <Plus className="w-5 h-5" /> Schedule Interview
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 min-h-0 overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[900px]">
            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
              {COLUMNS.map(col => (
                <DroppableColumn 
                  key={col.id} 
                  column={col} 
                  interviews={interviews.filter(i => i.status === col.id)} 
                  onEdit={handleOpenModal} 
                  onDelete={deleteInterview} 
                />
              ))}
            </DndContext>
          </div>
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay z-50">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative animate-fade-up shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-6">{editingInterview ? 'Edit Interview' : 'Schedule Interview'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Company <span className="text-rose-500">*</span></label>
                  <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="input-base" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Role <span className="text-rose-500">*</span></label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-base" placeholder="e.g. SWE Intern" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Interview Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-base cursor-pointer">
                    <option value="Mock">Mock</option>
                    <option value="Actual">Actual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Round</label>
                  <select required value={formData.round} onChange={e => setFormData({...formData, round: e.target.value})} className="input-base cursor-pointer">
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="System Design">System Design</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Mode</label>
                  <select required value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} className="input-base cursor-pointer">
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Date & Time <span className="text-rose-500">*</span></label>
                  <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-base cursor-pointer">
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Preparation Notes</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="input-base min-h-[100px] resize-y" placeholder="Any topics to focus on, links, or notes..." />
              </div>

              {formData.status === 'Done' && (
                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">Feedback & Evaluation</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Post-Interview Feedback</label>
                    <textarea value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})} className="input-base min-h-[80px]" placeholder="How did it go? What went well? What needs work?" />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Save Interview</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
