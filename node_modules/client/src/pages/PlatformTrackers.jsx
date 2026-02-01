import React, { useState, useEffect } from 'react';
import useTrackerStore from '../store/useTrackerStore';
import { Code2, Github, Trophy, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PlatformTrackers = () => {
  const { trackerData, isLoading, fetchTrackerData } = useTrackerStore();
  const [activeTab, setActiveTab] = useState('leetcode');

  useEffect(() => {
    if (!trackerData) {
      fetchTrackerData();
    }
  }, [trackerData, fetchTrackerData]);

  if (isLoading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center pt-20">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const renderLeetCode = () => {
    const lc = trackerData?.leetcode;
    if (!lc) return <EmptyState platform="LeetCode" />;
    
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Code2 className="text-[#ffa116]" /> LeetCode Deep Dive</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Solved" value={lc.all} color="text-white" />
          <StatCard title="Easy" value={lc.easy} color="text-[#10b981]" />
          <StatCard title="Medium" value={lc.medium} color="text-[#f59e0b]" />
          <StatCard title="Hard" value={lc.hard} color="text-[#ef4444]" />
        </div>
        <div className="p-6 bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass">
            <h3 className="text-gray-400 mb-4">Difficulty Spread</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Easy', count: lc.easy, fill: '#10b981' },
                  { name: 'Medium', count: lc.medium, fill: '#f59e0b' },
                  { name: 'Hard', count: lc.hard, fill: '#ef4444' }
                ]}>
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    );
  };

  const renderCodeforces = () => {
    const cf = trackerData?.codeforces;
    if (!cf) return <EmptyState platform="Codeforces" />;

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Trophy className="text-blue-500" /> Codeforces Deep Dive</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Current Rating" value={cf.rating} subtitle={`Rank: ${cf.rank}`} color="text-blue-400" />
          <StatCard title="Max Rating" value={cf.maxRating} subtitle={`Peak Rank: ${cf.maxRank}`} color="text-purple-400" />
        </div>
        {/* Placeholder for future contest history graph */}
        <div className="p-6 bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass flex items-center justify-center h-64 text-gray-500">
           (Contest Rating History Graph - Coming Soon)
        </div>
      </div>
    );
  };

  const renderGithub = () => {
    const gh = trackerData?.github;
    if (!gh) return <EmptyState platform="GitHub" />;

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Github className="text-gray-300" /> GitHub Deep Dive</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Repositories" value={gh.publicRepos} color="text-white" />
          <StatCard title="Stars Earned" value={gh.totalStars} color="text-[#f59e0b]" />
          <StatCard title="Followers" value={gh.followers} color="text-accent-400" />
        </div>
        <div className="p-6 bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass text-center">
            <a href={gh.profileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
              Visit GitHub Profile <ChevronRight className="w-4 h-4" />
            </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-wrap gap-4 mb-8 p-1 bg-dark-800/50 rounded-xl inline-flex backdrop-blur-sm border border-white/5">
          <button 
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'leetcode' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('leetcode')}
          >
            LeetCode
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'codeforces' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('codeforces')}
          >
            Codeforces
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'github' ? 'bg-gray-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('github')}
          >
            GitHub
          </button>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'leetcode' && renderLeetCode()}
          {activeTab === 'codeforces' && renderCodeforces()}
          {activeTab === 'github' && renderGithub()}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, subtitle, color }) => (
  <div className="p-6 bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass">
    <p className="text-gray-400 text-sm mb-2">{title}</p>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
    {subtitle && <p className="text-gray-500 text-xs mt-2 uppercase tracking-wide">{subtitle}</p>}
  </div>
);

const EmptyState = ({ platform }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-white/5 rounded-2xl bg-dark-800/20 backdrop-blur-sm p-6 text-center">
    <p className="text-xl mb-2">No {platform} account linked</p>
    <p className="text-sm">Head back to the Dashboard settings to link your profile.</p>
  </div>
);

export default PlatformTrackers;
