import React, { useState, useEffect, useMemo } from 'react';
import useResourceStore from '../store/useResourceStore';
import { 
  Search, FileText, Link2, FileType2, Plus, 
  Trash2, X, Globe, ExternalLink, ChevronRight, FileDown, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CATEGORIES = ['All', 'DSA', 'Core CS', 'System Design', 'HR Prep', 'Frontend', 'Backend'];
const TYPES = ['All', 'PDF', 'Link', 'Note'];

export default function StudyHub() {
  const { resources, isLoading, fetchResources, addResource, deleteResource } = useResourceStore();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeNoteDrawer, setActiveNoteDrawer] = useState(null); // stores the resource object

  // Form State
  const [formType, setFormType] = useState('Link');
  const [formData, setFormData] = useState({ title: '', category: 'DSA', url: '', content: '' });
  const [formFile, setFormFile] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchSearch = (r.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || r.category === activeCategory;
      const matchType = activeType === 'All' || r.type === activeType;
      return matchSearch && matchCat && matchType;
    });
  }, [resources, searchQuery, activeCategory, activeType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error('Title is required');

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('category', formData.category);
    payload.append('type', formType);

    if (formType === 'Link') {
      if (!formData.url) return toast.error('URL is required');
      payload.append('url', formData.url);
    } else if (formType === 'Note') {
      if (!formData.content) return toast.error('Note content is required');
      payload.append('content', formData.content);
    } else if (formType === 'PDF') {
      if (!formFile) return toast.error('PDF file is required');
      payload.append('file', formFile);
    }

    await addResource(payload);
    setIsAddModalOpen(false);
    setFormData({ title: '', category: 'DSA', url: '', content: '' });
    setFormFile(null);
  };

  const renderCard = (r) => {
    if (r.type === 'PDF') {
      return (
        <div key={r._id} className="glass-card p-5 rounded-2xl flex flex-col h-full border-t-4 border-t-rose-500 hover:-translate-y-1 transition-all group relative break-inside-avoid mb-6">
          <button onClick={() => deleteResource(r._id)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          <div className="flex items-center gap-3 mb-3 pr-8">
            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-500"><FileType2 className="w-6 h-6" /></div>
            <h3 className="font-bold text-white text-lg line-clamp-2">{r.title}</h3>
          </div>
          <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-xs font-semibold text-gray-400 w-fit mb-4">{r.category}</span>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-xs text-gray-500">{format(new Date(r.createdAt || Date.now()), 'MMM d, yyyy')}</span>
            <a href={`http://localhost:5000${r.filePath}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-rose-400 hover:text-rose-300">
              Open PDF <FileDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
    } else if (r.type === 'Link') {
      return (
        <div key={r._id} className="glass-card p-5 rounded-2xl flex flex-col h-full border-t-4 border-t-blue-500 hover:-translate-y-1 transition-all group relative break-inside-avoid mb-6">
          <button onClick={() => deleteResource(r._id)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          <div className="flex items-center gap-3 mb-3 pr-8">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500"><Globe className="w-6 h-6" /></div>
            <h3 className="font-bold text-white text-lg line-clamp-2">{r.title}</h3>
          </div>
          <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-xs font-semibold text-gray-400 w-fit mb-3">{r.category}</span>
          <p className="text-sm text-gray-500 truncate mb-4 bg-dark-900/50 p-2 rounded-lg border border-white/5">{r.url}</p>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-xs text-gray-500">{format(new Date(r.createdAt || Date.now()), 'MMM d, yyyy')}</span>
            <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-blue-400 hover:text-blue-300">
              Visit Link <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div key={r._id} className="glass-card p-5 rounded-2xl flex flex-col h-full border-l-4 border-l-amber-500 hover:-translate-y-1 transition-all group relative break-inside-avoid mb-6">
          <button onClick={() => deleteResource(r._id)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          <div className="flex items-center gap-3 mb-3 pr-8">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500"><FileText className="w-6 h-6" /></div>
            <h3 className="font-bold text-white text-lg line-clamp-2">{r.title}</h3>
          </div>
          <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-xs font-semibold text-gray-400 w-fit mb-3">{r.category}</span>
          <p className="text-sm text-gray-400 mb-4 line-clamp-4 italic">"{r.content}"</p>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-xs text-gray-500">{format(new Date(r.createdAt || Date.now()), 'MMM d, yyyy')}</span>
            <button onClick={() => setActiveNoteDrawer(r)} className="flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300">
              Read Note <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Study Hub</h1>
            <p className="text-gray-400 mt-1 font-medium">Your centralized resource library for placement prep.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary shadow-glow-indigo shrink-0">
            <Plus className="w-5 h-5" /> Add Resource
          </button>
        </div>

        {/* Filters & Search */}
        <div className="glass-card p-4 rounded-2xl flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
          <div className="flex-1 w-full xl:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" placeholder="Search resources..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="input-base pl-10 h-11 w-full"
              />
            </div>
            
            {/* Type Filter */}
            <div className="flex bg-dark-900 rounded-xl p-1 border border-white/5 w-fit">
              {TYPES.map(type => (
                <button 
                  key={type} onClick={() => setActiveType(type)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                    activeType === type ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-start xl:justify-end">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        {isLoading && resources.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredResources.map(renderCard)}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-16 text-center border border-dashed border-white/10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No resources found</h3>
            <p className="text-gray-400 mb-6 max-w-sm">You don't have any resources matching these filters. Keep building your library!</p>
            <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">Add Resource</button>
          </div>
        )}

      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay z-50">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md p-6 relative animate-fade-up shadow-2xl">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-6">Add New Resource</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-dark-950 rounded-xl p-1 border border-white/5 mb-6">
                {['Link', 'PDF', 'Note'].map(type => (
                  <button 
                    key={type} type="button" onClick={() => setFormType(type)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      formType === type ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Resource Title <span className="text-rose-500">*</span></label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-base" placeholder="e.g. React Cheatsheet" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category <span className="text-rose-500">*</span></label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-base cursor-pointer">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {formType === 'Link' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">URL Link <span className="text-rose-500">*</span></label>
                  <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="input-base" placeholder="https://..." />
                </div>
              )}

              {formType === 'Note' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Note Content <span className="text-rose-500">*</span></label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="input-base min-h-[150px] resize-y" placeholder="Write your notes here..." />
                </div>
              )}

              {formType === 'PDF' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Upload PDF <span className="text-rose-500">*</span></label>
                  <input required type="file" accept="application/pdf" onChange={e => setFormFile(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-colors file:cursor-pointer" />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Add {formType}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Side Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-dark-900 border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${activeNoteDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        {activeNoteDrawer && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-white/5 rounded text-xs font-bold text-gray-400">{activeNoteDrawer.category}</span>
                  <span className="text-xs text-gray-500">{format(new Date(activeNoteDrawer.createdAt || Date.now()), 'MMM d, yyyy')}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{activeNoteDrawer.title}</h2>
              </div>
              <button onClick={() => setActiveNoteDrawer(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                {activeNoteDrawer.content}
              </div>
            </div>
            <div className="p-6 border-t border-white/5 bg-dark-950/50">
               <button onClick={() => { deleteResource(activeNoteDrawer._id); setActiveNoteDrawer(null); }} className="w-full btn-ghost border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 justify-center">
                  <Trash2 className="w-4 h-4" /> Delete Note
               </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Drawer Overlay */}
      {activeNoteDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setActiveNoteDrawer(null)} />
      )}

    </div>
  );
}
