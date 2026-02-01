import React, { useEffect, useState } from 'react';
import useGoalStore from '../store/useGoalStore';
import { Target, Flag, Trash2, Plus } from 'lucide-react';

const Goals = () => {
  const { goals, fetchGoals, addGoal, updateProgress, deleteGoal } = useGoalStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', companyTarget: '', targetDate: '' });

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addGoal(formData);
    setShowForm(false);
  };

  const getRingColor = (progress) => {
    if(progress < 30) return '#ef4444'; // Red
    if(progress < 70) return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  return (
    <div className="min-h-screen p-10 text-white relative">
       {/* Background Decor */}
       <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 bg-dark-800/40 p-6 rounded-2xl border border-white/5 shadow-glass relative z-10">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-green-500/10 rounded-xl">
             <Target className="w-8 h-8 text-green-400" />
           </div>
           <div>
             <h1 className="text-3xl font-bold">Placement Goals</h1>
             <p className="text-gray-400 text-sm mt-1">Track your progress to your dream companies</p>
           </div>
         </div>
         <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 font-bold">
            <Plus className="w-5 h-5"/> Add Goal
         </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-dark-800/60 backdrop-blur-md rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in relative z-10 shadow-xl">
           <div>
             <label className="text-sm text-gray-400">Goal Description</label>
             <input type="text" placeholder="e.g. Master DP & Graphs" required onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 w-full bg-dark-900 border border-white/10 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
           </div>
           <div>
             <label className="text-sm text-gray-400">Target Company</label>
             <input type="text" placeholder="e.g. Google" required onChange={e => setFormData({...formData, companyTarget: e.target.value})} className="mt-1 w-full bg-dark-900 border border-white/10 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
           </div>
           <div>
             <label className="text-sm text-gray-400">Target Date</label>
             <input type="date" required onChange={e => setFormData({...formData, targetDate: e.target.value})} className="mt-1 w-full bg-dark-900 border border-white/10 p-3 rounded-xl outline-none invert-[0.8] mix-blend-lighten focus:ring-2 focus:ring-green-500" />
           </div>
           <div className="md:col-span-3 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="bg-white text-dark-900 font-bold rounded-xl px-6 py-2 hover:bg-gray-200 transition-all shadow-lg">Lock it in</button>
           </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
         {goals.length === 0 && <p className="text-gray-500 col-span-3 text-center p-10 border border-white/5 border-dashed rounded-xl">No active goals. Set your sights high!</p>}
         {goals.map(g => (
            <div key={g._id} className="p-6 bg-dark-800/40 border border-white/5 shadow-glass rounded-2xl flex flex-col items-center group relative overflow-hidden">
                {/* Top Border Color Bar */}
                <div className={`absolute top-0 left-0 w-full h-1`} style={{ backgroundColor: getRingColor(g.progress) }}></div>
                <button onClick={() => deleteGoal(g._id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5"/></button>
                
                <h3 className="text-xl font-bold mt-2 text-center text-gray-200">{g.title}</h3>
                <span className="mt-2 text-sm px-3 py-1 bg-dark-900 border border-white/10 rounded-full flex items-center gap-2 text-gray-300"><Flag className="w-3 h-3 text-green-400"/> {g.companyTarget}</span>
                
                {/* Progress Wheel */}
                <div className="relative w-32 h-32 mt-6 mb-4 flex items-center justify-center">
                   <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={getRingColor(g.progress)} strokeWidth="3" strokeDasharray={`${g.progress}, 100`} />
                   </svg>
                   <span className="absolute text-2xl font-bold text-white">{g.progress}%</span>
                </div>

                <div className="w-full mt-auto pt-4 border-t border-white/5">
                   <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Update Progress:</p>
                   <input type="range" min="0" max="100" value={g.progress} onChange={(e) => updateProgress(g._id, parseInt(e.target.value))} className="w-full accent-green-500 cursor-pointer" />
                </div>
            </div>
         ))}
      </div>
    </div>
  );
};
export default Goals;
