import React, { useState, useEffect, useMemo } from 'react';
import useGoalStore from '../store/useGoalStore';
import { 
  Target, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, 
  Clock, X, PlusCircle, MinusCircle 
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import confetti from 'canvas-confetti';

const CATEGORIES = ['Applications', 'Problems', 'Skills', 'Rounds', 'Other'];

const QUOTES = [
  "What you do today can improve all your tomorrows.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it."
];

export default function Goals() {
  const { goals, isLoading, fetchGoals, addGoal, updateGoal, deleteGoal } = useGoalStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', category: 'Problems', targetValue: 100, currentValue: 0, unit: 'problems', dueDate: ''
  });

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    fetchGoals();
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
  }, [fetchGoals]);

  // Derived Stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.currentValue >= g.targetValue).length;
  const inProgressGoals = goals.filter(g => g.currentValue > 0 && g.currentValue < g.targetValue).length;
  const overdueGoals = goals.filter(g => g.dueDate && isPast(new Date(g.dueDate)) && !isToday(new Date(g.dueDate)) && g.currentValue < g.targetValue).length;

  const averageCompletion = useMemo(() => {
    if (goals.length === 0) return 0;
    const sum = goals.reduce((acc, g) => acc + Math.min(100, (g.currentValue / g.targetValue) * 100), 0);
    return Math.round(sum / goals.length);
  }, [goals]);

  // Readiness Ring Animation
  useEffect(() => {
    setTimeout(() => setAnimatedProgress(averageCompletion), 300);
  }, [averageCompletion]);

  const getRingColor = (val) => {
    if (val >= 70) return 'text-emerald-500';
    if (val >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title, category: goal.category, 
        targetValue: goal.targetValue, currentValue: goal.currentValue, 
        unit: goal.unit || 'units', dueDate: goal.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '', category: 'Problems', targetValue: 100, currentValue: 0, unit: 'problems', dueDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, targetValue: Number(formData.targetValue), currentValue: Number(formData.currentValue) };
    if (editingGoal) await updateGoal(editingGoal._id, payload);
    else await addGoal(payload);
    setIsModalOpen(false);
  };

  const handleIncrement = async (goal, amount) => {
    const newVal = Math.max(0, goal.currentValue + amount);
    if (newVal === goal.targetValue && goal.currentValue < goal.targetValue) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    await updateGoal(goal._id, { currentValue: newVal });
  };

  const getProgressColor = (current, target) => {
    const p = (current / target) * 100;
    if (p >= 100) return 'bg-emerald-500';
    if (p > 0) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
        
        {/* Header & Ring */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-dark-900 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

          <div className="flex-1 space-y-4 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white flex items-center justify-center md:justify-start gap-3">
              <Target className="w-10 h-10 text-indigo-400" /> Goal Tracker
            </h1>
            <p className="text-gray-400 font-medium text-lg max-w-lg mx-auto md:mx-0">
              Set targets. Track progress. Own your placement journey.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              <button onClick={() => handleOpenModal()} className="btn-primary shadow-glow-indigo">
                <Plus className="w-5 h-5" /> New Goal
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center z-10">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r={radius} className="stroke-white/10" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="80" cy="80" r={radius} 
                  className={`transition-all duration-1500 ease-out ${getRingColor(animatedProgress)}`} 
                  strokeWidth="12" fill="transparent" 
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{animatedProgress}%</span>
              </div>
            </div>
            <p className="mt-3 font-bold text-gray-400 tracking-wide uppercase text-sm">Readiness</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-indigo-500">
            <p className="text-gray-400 text-sm font-bold uppercase">Total Goals</p>
            <p className="text-3xl font-black text-white mt-1">{totalGoals}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <p className="text-gray-400 text-sm font-bold uppercase">Completed</p>
            <p className="text-3xl font-black text-white mt-1">{completedGoals}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500">
            <p className="text-gray-400 text-sm font-bold uppercase">In Progress</p>
            <p className="text-3xl font-black text-white mt-1">{inProgressGoals}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-rose-500">
            <p className="text-gray-400 text-sm font-bold uppercase">Overdue</p>
            <p className="text-3xl font-black text-white mt-1">{overdueGoals}</p>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading && goals.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 text-center py-20 text-gray-500">Loading goals...</div>
          ) : goals.length > 0 ? (
            goals.map(goal => {
              const p = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              const isDone = goal.currentValue >= goal.targetValue;
              const isLate = goal.dueDate && isPast(new Date(goal.dueDate)) && !isToday(new Date(goal.dueDate)) && !isDone;

              return (
                <div key={goal._id} className="glass-card p-6 rounded-3xl group relative border border-white/5 hover:border-white/10 transition-colors flex flex-col h-full">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-xs font-semibold text-gray-400 mb-2">
                        {goal.category}
                      </span>
                      <h3 className={`text-xl font-bold ${isDone ? 'text-gray-400 line-through decoration-emerald-500/50' : 'text-white'}`}>{goal.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 p-1 rounded-lg border border-white/5">
                      <button onClick={() => handleOpenModal(goal)} className="p-1.5 text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteGoal(goal._id)} className="p-1.5 text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-2 mt-auto pt-4">
                    <p className="text-3xl font-black text-white tracking-tight">
                      {goal.currentValue} <span className="text-lg text-gray-500 font-bold">/ {goal.targetValue}</span>
                    </p>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Achieved
                      </span>
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">{p}%</span>
                    )}
                  </div>

                  <div className="w-full bg-dark-900 rounded-full h-2.5 mb-5 border border-white/5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(goal.currentValue, goal.targetValue)}`} style={{ width: `${p}%` }} />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-4">
                      {goal.dueDate && (
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${isLate ? 'text-rose-400 bg-rose-500/10 px-2 py-1 rounded' : 'text-gray-500'}`}>
                          {isLate ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {format(new Date(goal.dueDate), 'MMM d, yyyy')}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-gray-500 uppercase">{goal.unit}</span>
                    </div>

                    {!isDone && (
                      <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-1 border border-white/5">
                        <button onClick={() => handleIncrement(goal, -1)} className="p-1 text-gray-400 hover:text-white"><MinusCircle className="w-5 h-5" /></button>
                        <button onClick={() => handleIncrement(goal, 1)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-md transition-colors">+1</button>
                        <button onClick={() => handleIncrement(goal, 5)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-md transition-colors">+5</button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-1 lg:col-span-2 glass-card rounded-3xl p-16 text-center border border-dashed border-white/10">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No goals set yet</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">Setting clear, measurable goals is the first step to securing your placement.</p>
              <button onClick={() => handleOpenModal()} className="btn-primary mx-auto">Create Your First Goal</button>
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="text-center py-8">
          <p className="text-lg font-medium text-gray-500 italic">"{QUOTES[quoteIndex]}"</p>
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay z-50">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md p-6 relative animate-fade-up shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-6">{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Goal Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-base" placeholder="e.g. Solve 100 DP problems" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-base cursor-pointer">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Current Value</label>
                  <input type="number" required min="0" value={formData.currentValue} onChange={e => setFormData({...formData, currentValue: e.target.value})} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Target Value</label>
                  <input type="number" required min="1" value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: e.target.value})} className="input-base" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Unit</label>
                  <input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="input-base" placeholder="e.g. problems, companies" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Due Date (Optional)</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="input-base" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
