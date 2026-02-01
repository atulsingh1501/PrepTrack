import React, { useEffect, useState } from 'react';
import useResourceStore from '../store/useResourceStore';
import useNoteStore from '../store/useNoteStore';
import { BookOpen, FileText, Upload, Plus, Download, Trash2, Link } from 'lucide-react';

const StudyHub = () => {
  const { resources, fetchResources, addResource, deleteResource } = useResourceStore();
  const { notes, fetchNotes, addNote, deleteNote } = useNoteStore();
  const [tab, setTab] = useState('resources');
  
  // Forms
  const [rTitle, setRTitle] = useState('');
  const [rType, setRType] = useState('PDF');
  const [rUrl, setRUrl] = useState('');
  const [rTopic, setRTopic] = useState('');
  const [rFile, setRFile] = useState(null);

  const [nTitle, setNTitle] = useState('');
  const [nSubject, setNSubject] = useState('DSA');
  const [nContent, setNContent] = useState('');

  useEffect(() => {
    fetchResources();
    fetchNotes();
  }, [fetchResources, fetchNotes]);

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', rTitle);
    formData.append('type', rType);
    formData.append('topic', rTopic);
    if (rType === 'PDF' && rFile) formData.append('file', rFile);
    if (rUrl) formData.append('url', rUrl);

    await addResource(formData);
    setRTitle(''); setRUrl(''); setRFile(null);
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    await addNote({ title: nTitle, subject: nSubject, content: nContent });
    setNTitle(''); setNContent('');
  };

  return (
    <div className="min-h-screen p-10 text-white">
      <div className="flex flex-wrap gap-4 mb-8 p-1 bg-dark-800/50 rounded-xl inline-flex backdrop-blur-sm border border-white/5">
        <button onClick={() => setTab('resources')} className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${tab === 'resources' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 hover:text-white'}`}><BookOpen className="w-5 h-5"/> Library</button>
        <button onClick={() => setTab('notes')} className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${tab === 'notes' ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' : 'text-gray-400 hover:text-white'}`}><FileText className="w-5 h-5"/> Notes</button>
      </div>

      {tab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="lg:col-span-1 bg-dark-800/40 p-6 rounded-2xl border border-white/5 shadow-glass h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Upload className="text-primary-400 w-5 h-5"/> Upload Resource</h2>
            <form onSubmit={handleResourceSubmit} className="space-y-4">
               <div><label className="text-sm text-gray-400">Title</label><input type="text" value={rTitle} onChange={e=>setRTitle(e.target.value)} required className="w-full bg-dark-900 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-primary-500"/></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm text-gray-400">Type</label><select value={rType} onChange={e=>setRType(e.target.value)} className="w-full bg-dark-900 border border-white/10 p-3 rounded-xl mt-1 outline-none appearance-none cursor-pointer"><option>PDF</option><option>Video</option><option>Article</option></select></div>
                 <div><label className="text-sm text-gray-400">Topic</label><input type="text" value={rTopic} onChange={e=>setRTopic(e.target.value)} placeholder="e.g. Trees" required className="w-full bg-dark-900 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-primary-500"/></div>
               </div>
               
               {rType === 'PDF' ? (
                 <div><label className="text-sm text-gray-400">Upload File</label><input type="file" onChange={e => setRFile(e.target.files[0])} accept=".pdf,.doc,.docx" required className="w-full bg-dark-900 border border-white/10 p-2 rounded-xl mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-primary-500 file:text-white hover:file:bg-primary-600 file:cursor-pointer"/></div>
               ) : (
                 <div><label className="text-sm text-gray-400">URL</label><input type="url" value={rUrl} onChange={e=>setRUrl(e.target.value)} required className="w-full bg-dark-900 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-primary-500"/></div>
               )}
               <button type="submit" className="w-full py-3 bg-white text-dark-900 font-bold rounded-xl mt-2 hover:bg-gray-200 transition-colors">Save Resource</button>
            </form>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             {resources.length === 0 && <p className="text-gray-500 col-span-2 p-10 border border-white/5 border-dashed rounded-xl text-center">No resources yet. Upload a PDF or link a video!</p>}
             {resources.map(r => (
               <div key={r._id} className="p-5 bg-dark-800/40 border border-white/5 rounded-2xl relative group shadow-glass">
                 <span className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-dark-900 rounded-md border border-white/10 text-primary-400">{r.type}</span>
                 <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{r.topic}</p>
                 <h3 className="text-lg font-bold mb-4 pr-12 text-gray-200">{r.title}</h3>
                 <div className="flex items-center gap-3">
                   {r.filePath ? (
                     <a href={`http://localhost:5000${r.filePath}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"><Download className="w-4 h-4"/> Download</a>
                   ) : (
                     <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"><Link className="w-4 h-4"/> Open Link</a>
                   )}
                   <button onClick={() => deleteResource(r._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
           <div className="lg:col-span-1 bg-dark-800/40 p-6 rounded-2xl border border-white/5 shadow-glass h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="text-accent-400 w-5 h-5"/> New Note</h2>
            <form onSubmit={handleNoteSubmit} className="space-y-4">
               <div><label className="text-sm text-gray-400">Title</label><input type="text" value={nTitle} onChange={e=>setNTitle(e.target.value)} required className="w-full bg-dark-900 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-accent-500"/></div>
               <div><label className="text-sm text-gray-400">Subject</label><select value={nSubject} onChange={e=>setNSubject(e.target.value)} className="w-full bg-dark-900 border border-white/10 p-3 rounded-xl mt-1 outline-none appearance-none cursor-pointer"><option>DSA</option><option>Algorithms</option><option>OS</option><option>DBMS</option><option>System Design</option></select></div>
               <div><label className="text-sm text-gray-400">Content</label><textarea value={nContent} onChange={e=>setNContent(e.target.value)} required rows={6} className="w-full bg-dark-900 border border-white/10 p-3 rounded-xl mt-1 outline-none resize-none focus:ring-2 focus:ring-accent-500"></textarea></div>
               <button type="submit" className="w-full py-3 bg-white text-dark-900 font-bold rounded-xl mt-2 hover:bg-gray-200 transition-colors">Save Note</button>
            </form>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             {notes.length === 0 && <p className="text-gray-500 col-span-2 p-10 border border-white/5 border-dashed rounded-xl text-center">No notes found. Jot something down!</p>}
             {notes.map(n => (
               <div key={n._id} className="p-5 bg-dark-800/40 border border-white/5 rounded-2xl flex flex-col items-start shadow-glass relative group min-h-[160px]">
                 <span className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-accent-500/10 rounded-md border border-accent-500/20 text-accent-400">{n.subject}</span>
                 <h3 className="text-lg font-bold mb-2 pr-16 text-gray-200">{n.title}</h3>
                 <p className="text-gray-400 text-sm mb-4 whitespace-pre-wrap">{n.content}</p>
                 <div className="mt-auto pt-4 border-t border-white/5 w-full flex justify-between items-center">
                    <span className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => deleteNote(n._id)} className="text-red-400 text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default StudyHub;
