import React, { useState, useEffect } from 'react';
import useProfileStore from '../store/useProfileStore';
import { 
  Code2, Github, Trophy, BookOpen, Terminal, Linkedin, 
  Plus, Edit2, Trash2, X, ExternalLink, GripVertical, Copy,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PLATFORMS = {
  LeetCode: { icon: Code2, color: 'text-[#ffa116]', bg: 'bg-[#ffa116]/10', border: 'border-t-[#ffa116]' },
  GitHub: { icon: Github, color: 'text-gray-300', bg: 'bg-gray-500/10', border: 'border-t-gray-400' },
  Codeforces: { icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-t-blue-500' },
  GeeksForGeeks: { icon: BookOpen, color: 'text-[#2f8d46]', bg: 'bg-[#2f8d46]/10', border: 'border-t-[#2f8d46]' },
  HackerRank: { icon: Terminal, color: 'text-[#00ea64]', bg: 'bg-[#00ea64]/10', border: 'border-t-[#00ea64]' },
  LinkedIn: { icon: Linkedin, color: 'text-[#0a66c2]', bg: 'bg-[#0a66c2]/10', border: 'border-t-[#0a66c2]' }
};

const SortableProfileCard = ({ profile, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: profile._id });
  const [copied, setCopied] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const pData = PLATFORMS[profile.platform] || PLATFORMS.GitHub;
  const Icon = pData.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`glass-card rounded-2xl flex flex-col relative group border-t-4 ${pData.border} hover:-translate-y-1 transition-all overflow-hidden`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} {...listeners} 
        className="absolute top-3 left-3 p-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => onEdit(profile)} className="p-1.5 bg-dark-900 rounded-md text-gray-400 hover:text-white">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(profile._id)} className="p-1.5 bg-dark-900 rounded-md text-gray-400 hover:text-rose-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 pt-10 flex flex-col items-center text-center flex-1">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${pData.bg}`}>
          <Icon className={`w-8 h-8 ${pData.color}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{profile.platform}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 font-mono text-sm bg-dark-900 px-3 py-1 rounded-full border border-white/5">
            @{profile.username}
          </span>
          <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors" title="Copy Username">
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Optional Stats Rendering */}
        {profile.stats && Object.keys(profile.stats).length > 0 && (
          <div className="w-full grid grid-cols-2 gap-2 mb-6 mt-2">
            {Object.entries(profile.stats).map(([key, val]) => (
              <div key={key} className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{key}</p>
                <p className="text-lg font-black text-white">{val}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 w-full border-t border-white/5">
          <a 
            href={profile.url} target="_blank" rel="noreferrer" 
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
          >
            Visit Profile <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default function PlatformTrackers() {
  const { profiles, isLoading, fetchProfiles, addProfile, updateProfile, deleteProfile, reorderProfiles } = useProfileStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    platform: 'LeetCode', username: '', url: '', statKey1: '', statVal1: '', statKey2: '', statVal2: ''
  });

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = profiles.findIndex(p => p._id === active.id);
      const newIndex = profiles.findIndex(p => p._id === over.id);
      reorderProfiles(arrayMove(profiles, oldIndex, newIndex));
      // Optionally PUT the new order to the backend here
    }
  };

  const handleOpenModal = (profile = null) => {
    if (profile) {
      setEditingProfile(profile);
      const keys = Object.keys(profile.stats || {});
      setFormData({
        platform: profile.platform,
        username: profile.username,
        url: profile.url,
        statKey1: keys[0] || '', statVal1: profile.stats?.[keys[0]] || '',
        statKey2: keys[1] || '', statVal2: profile.stats?.[keys[1]] || ''
      });
    } else {
      setEditingProfile(null);
      setFormData({ platform: 'LeetCode', username: '', url: '', statKey1: '', statVal1: '', statKey2: '', statVal2: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stats = {};
    if (formData.statKey1 && formData.statVal1) stats[formData.statKey1] = formData.statVal1;
    if (formData.statKey2 && formData.statVal2) stats[formData.statKey2] = formData.statVal2;
    
    const payload = {
      platform: formData.platform,
      username: formData.username,
      url: formData.url,
      stats
    };

    if (editingProfile) await updateProfile(editingProfile._id, payload);
    else await addProfile(payload);
    
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Code2 className="w-8 h-8 text-indigo-400" /> Platform Trackers
            </h1>
            <p className="text-gray-400 mt-1 font-medium">Manage all your coding and professional profiles in one place.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary shadow-glow-indigo shrink-0">
            <Plus className="w-5 h-5" /> Add Profile
          </button>
        </div>

        {/* Grid */}
        {isLoading && profiles.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profiles.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={profiles.map(p => p._id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map(p => (
                  <SortableProfileCard 
                    key={p._id} 
                    profile={p} 
                    onEdit={handleOpenModal}
                    onDelete={deleteProfile}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="glass-card rounded-3xl p-16 text-center border border-dashed border-white/10 bg-white/5 opacity-80 filter grayscale">
            <Code2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Not Connected</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Link your coding platforms to build your unified developer portfolio.</p>
            <button onClick={() => handleOpenModal()} className="btn-ghost border border-white/10 mx-auto filter-none grayscale-0 opacity-100">
              Link First Profile
            </button>
          </div>
        )}

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay z-50">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md p-6 relative animate-fade-up shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-6">{editingProfile ? 'Edit Profile' : 'Add Profile'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Platform</label>
                <select required value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="input-base cursor-pointer">
                  {Object.keys(PLATFORMS).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">@</span>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="input-base pl-8" placeholder="username" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Profile URL</label>
                <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="input-base" placeholder="https://..." />
              </div>

              <div className="pt-2 border-t border-white/5">
                <label className="block text-xs font-semibold text-gray-400 mb-3">Optional Stats (e.g. Rating: 1500)</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input value={formData.statKey1} onChange={e => setFormData({...formData, statKey1: e.target.value})} className="input-base text-sm" placeholder="Stat Name" />
                  <input value={formData.statVal1} onChange={e => setFormData({...formData, statVal1: e.target.value})} className="input-base text-sm" placeholder="Value" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={formData.statKey2} onChange={e => setFormData({...formData, statKey2: e.target.value})} className="input-base text-sm" placeholder="Stat Name" />
                  <input value={formData.statVal2} onChange={e => setFormData({...formData, statVal2: e.target.value})} className="input-base text-sm" placeholder="Value" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
