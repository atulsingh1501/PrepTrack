import React, { useEffect, useState } from 'react';
import useInterviewStore from '../store/useInterviewStore';
import { Briefcase, Plus, MapPin, Calendar, Star } from 'lucide-react';

const InterviewBoard = () => {
  const { interviews, fetchInterviews, addInterview, deleteInterview } = useInterviewStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ company: '', date: '', type: 'Mock', round: 'Technical', status: 'Scheduled' });

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addInterview(formData);
    setShowForm(false);
  };

  const scheduled = interviews.filter(i => i.status === 'Scheduled');
  const completed = interviews.filter(i => i.status !== 'Scheduled');

  return (
    <div className="min-h-screen p-10 text-white">
      <div className="flex justify-between items-center mb-8 bg-dark-800/40 p-6 rounded-2xl border border-white/5 shadow-glass">
         <div className="flex items-center gap-4">
           <Briefcase className="w-8 h-8 text-blue-400" />
           <h1 className="text-3xl font-bold">Interview Board</h1>
         </div>
         <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5"/> Log Interview
         </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-dark-800/60 backdrop-blur-md rounded-2xl border border-white/10 grid grid-cols-2 gap-4 animate-fade-in">
           <input type="text" placeholder="Company Name" required onChange={e => setFormData({...formData, company: e.target.value})} className="bg-dark-900 border border-white/10 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
           <input type="date" required onChange={e => setFormData({...formData, date: e.target.value})} className="bg-dark-900 border border-white/10 p-3 rounded-xl outline-none invert-[0.8] mix-blend-lighten focus:ring-2 focus:ring-blue-500" />
           <select onChange={e => setFormData({...formData, type: e.target.value})} className="bg-dark-900 border border-white/10 p-3 rounded-xl outline-none appearance-none cursor-pointer">
             <option>Mock</option><option>Actual</option>
           </select>
           <button type="submit" className="bg-white text-dark-900 font-bold rounded-xl p-3 hover:bg-gray-200 shadow-xl transition-all">Save pipeline</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
            <h2 className="text-xl font-bold text-gray-300 mb-4 border-b border-white/10 pb-2">Upcoming ({scheduled.length})</h2>
            <div className="space-y-4">
              {scheduled.map(i => (
                 <div key={i._id} className="p-4 bg-dark-800/40 border border-blue-500/30 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.1)] group">
                    <div className="flex justify-between">
                       <h3 className="text-xl font-bold">{i.company}</h3>
                       <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md font-medium uppercase tracking-wider">{i.type}</span>
                    </div>
                    <p className="flex items-center gap-2 mt-2 text-gray-400"><Calendar className="w-4 h-4"/> {new Date(i.date).toLocaleDateString()}</p>
                    <button onClick={() => deleteInterview(i._id)} className="text-red-400 text-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                 </div>
              ))}
            </div>
         </div>
         <div>
            <h2 className="text-xl font-bold text-gray-500 mb-4 border-b border-white/10 pb-2">Archived ({completed.length})</h2>
            <div className="space-y-4">
              {completed.map(i => (
                 <div key={i._id} className="p-4 bg-dark-900/50 border border-white/5 rounded-xl opacity-70 hover:opacity-100 transition-opacity">
                    <h3 className="text-lg font-bold text-gray-300">{i.company}</h3>
                    <p className="text-sm mt-1 text-gray-500">{i.status} - {i.type}</p>
                 </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};
export default InterviewBoard;
