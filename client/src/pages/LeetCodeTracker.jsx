import React, { useState, useEffect, useMemo } from 'react';
import useLeetcodeStore from '../store/useLeetcodeStore';
import { 
  Plus, Search, Filter, Edit2, Trash2, X, Code2, 
  CheckCircle2, Clock, XCircle, ChevronRight, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
  Medium: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  Hard: 'bg-rose-500/20 text-rose-500 border-rose-500/30',
};

const STATUS_COLORS = {
  Solved: 'bg-teal-500/20 text-teal-400',
  Revisit: 'bg-amber-500/20 text-amber-400',
  Skip: 'bg-gray-500/20 text-gray-400',
};

const STATUS_ICONS = {
  Solved: CheckCircle2,
  Revisit: Clock,
  Skip: XCircle,
};

const TOPICS = [
  'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack',
  'Binary Search', 'Linked List', 'Trees', 'Tries', 'Heap / Priority Queue',
  'Backtracking', 'Graphs', 'Advanced Graphs', '1-D DP', '2-D DP',
  'Greedy', 'Intervals', 'Math & Geometry', 'Bit Manipulation'
];

export default function LeetCodeTracker() {
  const { problems, isLoading, fetchProblems, addProblem, updateProblem, deleteProblem } = useLeetcodeStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    title: '', link: '', difficulty: 'Medium', status: 'Solved', topic: 'Arrays & Hashing', notes: ''
  });

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Derived Stats
  const stats = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach(p => {
      if (p.status === 'Solved' || p.status === 'Revisit') {
        if (counts[p.difficulty] !== undefined) counts[p.difficulty]++;
      }
    });
    return counts;
  }, [problems]);

  // Derived Filtered Problems
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = diffFilter === 'All' || p.difficulty === diffFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchTopic = topicFilter === 'All' || p.topic === topicFilter;
      return matchSearch && matchDiff && matchStatus && matchTopic;
    });
  }, [problems, searchQuery, diffFilter, statusFilter, topicFilter]);

  const handleOpenModal = (problem = null) => {
    if (problem) {
      setEditingProblem(problem);
      setFormData({
        title: problem.title,
        link: problem.link || '',
        difficulty: problem.difficulty,
        status: problem.status,
        topic: problem.topic || TOPICS[0],
        notes: problem.notes || '',
      });
    } else {
      setEditingProblem(null);
      setFormData({
        title: '', link: '', difficulty: 'Medium', status: 'Solved', topic: TOPICS[0], notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProblem) {
      await updateProblem(editingProblem._id, formData);
    } else {
      await addProblem(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      await deleteProblem(id);
    }
  };

  // Progress goals for the UI
  const goals = { Easy: 50, Medium: 100, Hard: 25 };

  return (
    <div className="min-h-screen p-6 md:p-10 relative">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Code2 className="w-8 h-8 text-[#ffa116]" /> LeetCode Tracker
            </h1>
            <p className="text-gray-400 mt-1 font-medium">Master Data Structures and Algorithms</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary shadow-glow-indigo shrink-0"
          >
            <Plus className="w-5 h-5" /> Log Problem
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Easy', 'Medium', 'Hard'].map((diff) => {
            const count = stats[diff] || 0;
            const target = goals[diff];
            const progress = Math.min((count / target) * 100, 100);
            return (
              <div key={diff} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${DIFFICULTY_COLORS[diff]}`}>
                    {diff}
                  </span>
                  <span className="text-2xl font-black">{count}</span>
                </div>
                <div className="w-full bg-dark-900 rounded-full h-2 mb-2 border border-white/5">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      diff === 'Easy' ? 'bg-emerald-500' : diff === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium">Target: {count} / {target}</p>
              </div>
            );
          })}
        </div>

        {/* Filter Bar (Sticky) */}
        <div className="sticky top-0 z-30 glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-xl mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-10 h-11"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="input-base h-11 w-auto py-0 cursor-pointer" value={diffFilter} onChange={e => setDiffFilter(e.target.value)}>
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select className="input-base h-11 w-auto py-0 cursor-pointer" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Revisit">Revisit</option>
              <option value="Skip">Skip</option>
            </select>
            <select className="input-base h-11 w-auto py-0 cursor-pointer max-w-[200px]" value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
              <option value="All">All Topics</option>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-semibold text-sm text-gray-400">#</th>
                  <th className="p-4 font-semibold text-sm text-gray-400">Title</th>
                  <th className="p-4 font-semibold text-sm text-gray-400">Difficulty</th>
                  <th className="p-4 font-semibold text-sm text-gray-400">Topic</th>
                  <th className="p-4 font-semibold text-sm text-gray-400">Status</th>
                  <th className="p-4 font-semibold text-sm text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && problems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading problems...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProblems.length > 0 ? (
                  filteredProblems.map((p, index) => {
                    const StatusIcon = STATUS_ICONS[p.status];
                    return (
                      <tr key={p._id} className="group hover:bg-white/5 transition-colors">
                        <td className="p-4 text-sm text-gray-500 font-mono">{index + 1}</td>
                        <td className="p-4">
                          {p.link ? (
                            <a href={p.link} target="_blank" rel="noreferrer" className="font-semibold hover:text-indigo-400 hover:underline transition-colors line-clamp-1">
                              {p.title}
                            </a>
                          ) : (
                            <span className="font-semibold line-clamp-1">{p.title}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${DIFFICULTY_COLORS[p.difficulty]}`}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 whitespace-nowrap">
                            {p.topic || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_COLORS[p.status]}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-rose-500/20 rounded-lg text-gray-400 hover:text-rose-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                          <Code2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xl font-bold text-white mb-2">No problems found</p>
                        <p className="max-w-xs mx-auto mb-6">You haven't logged any LeetCode problems matching these filters yet.</p>
                        <button onClick={() => handleOpenModal()} className="btn-primary">
                          <Plus className="w-5 h-5" /> Log First Problem
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => handleOpenModal()}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-glow-indigo flex items-center justify-center text-white z-40 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Log Problem Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative animate-fade-up shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingProblem ? 'Edit Problem' : 'Log Problem'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Problem Title <span className="text-rose-500">*</span></label>
                <input 
                  type="text" required 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="input-base" placeholder="e.g. Two Sum"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">LeetCode URL</label>
                <input 
                  type="url" 
                  value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})}
                  className="input-base" placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Difficulty</label>
                  <select 
                    value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    className="input-base cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="input-base cursor-pointer"
                  >
                    <option value="Solved">Solved</option>
                    <option value="Revisit">Revisit</option>
                    <option value="Skip">Skip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Topic</label>
                <select 
                  value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}
                  className="input-base cursor-pointer"
                >
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Notes</label>
                <textarea 
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="input-base min-h-[100px] resize-y" placeholder="Key insights, time/space complexity..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProblem ? 'Save Changes' : 'Log Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
