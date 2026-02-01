import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Settings, RefreshCw, Code2, Github, Trophy } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { trackerData, isLoading, fetchTrackerData, updateUsernames } = useTrackerStore();
  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState({
    leetcodeUsername: user?.leetcodeUsername || '',
    githubUsername: user?.githubUsername || '',
    codeforcesUsername: user?.codeforcesUsername || ''
  });

  useEffect(() => {
    fetchTrackerData();
  }, [fetchTrackerData]);

  const handleSaveUsernames = async (e) => {
    e.preventDefault();
    await updateUsernames(formData);
    setShowSettings(false);
  };

  // Mock Heatmap Generation
  const generateHeatmap = () => {
    const days = Array.from({ length: 90 }, () => Math.floor(Math.random() * 4));
    return (
      <div className="flex gap-1 flex-wrap">
        {days.map((level, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-sm ${
              level === 0 ? 'bg-dark-700/50' : 
              level === 1 ? 'bg-primary-500/30' : 
              level === 2 ? 'bg-primary-500/60' : 'bg-primary-500'
            }`}
            title={`Day ${i + 1}: ${level} contributions`}
          />
        ))}
      </div>
    );
  };

  const lcCount = trackerData?.leetcode;
  const lcChartData = lcCount ? [
    { name: 'Easy', value: lcCount.easy || 0 },
    { name: 'Medium', value: lcCount.medium || 0 },
    { name: 'Hard', value: lcCount.hard || 0 }
  ] : [];

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 backdrop-blur-md bg-dark-800/40 p-4 rounded-2xl border border-white/5 shadow-glass">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
              Overview
            </h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => fetchTrackerData()}
              className="p-2 rounded-xl bg-dark-700/50 hover:bg-dark-700 border border-white/10 transition-colors flex items-center justify-center text-gray-300"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-primary-400' : ''}`} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl bg-dark-700/50 hover:bg-dark-700 border border-white/10 transition-colors flex items-center justify-center text-gray-300"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => logout()}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="mb-8 p-6 backdrop-blur-md bg-dark-800/60 rounded-2xl border border-white/10 shadow-lg relative z-20">
            <h2 className="text-xl font-semibold mb-4 text-white">Configure API Usernames</h2>
            <form onSubmit={handleSaveUsernames} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">LeetCode Username</label>
                <input 
                  type="text" 
                  value={formData.leetcodeUsername} 
                  onChange={(e) => setFormData({...formData, leetcodeUsername: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. neetcode"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub Username</label>
                <input 
                  type="text" 
                  value={formData.githubUsername} 
                  onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Codeforces Handle</label>
                <input 
                  type="text" 
                  value={formData.codeforcesUsername} 
                  onChange={(e) => setFormData({...formData, codeforcesUsername: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white font-medium hover:opacity-90">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* LeetCode */}
          <div className="p-6 backdrop-blur-md bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass flex flex-col h-72">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#ffa116]/10 rounded-lg">
                <Code2 className="text-[#ffa116] w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">LeetCode</h3>
            </div>
            {trackerData?.leetcode ? (
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-white">{trackerData.leetcode.all}</span>
                  <span className="text-xs text-gray-400">Solved</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lcChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {lcChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444'][index % 3]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col text-gray-500">
                <p>No account linked</p>
                <button onClick={() => setShowSettings(true)} className="text-primary-400 text-sm mt-2 hover:underline">Connect account</button>
              </div>
            )}
          </div>

          {/* Codeforces */}
          <div className="p-6 backdrop-blur-md bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass flex flex-col h-72">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Trophy className="text-blue-500 w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Codeforces</h3>
            </div>
            {trackerData?.codeforces ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-500">
                    {trackerData.codeforces.rating}
                  </span>
                  <p className="text-sm tracking-widest text-gray-400 uppercase mt-1">{trackerData.codeforces.rank}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <p className="text-xs text-gray-500 mb-1">Max Rating</p>
                    <p className="text-lg font-semibold">{trackerData.codeforces.maxRating}</p>
                  </div>
                  <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <p className="text-xs text-gray-500 mb-1">Max Rank</p>
                    <p className="text-sm font-semibold truncate capitalize">{trackerData.codeforces.maxRank}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col text-gray-500">
                <p>No account linked</p>
              </div>
            )}
          </div>

          {/* GitHub */}
          <div className="p-6 backdrop-blur-md bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass flex flex-col h-72">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-500/10 rounded-lg">
                <Github className="text-gray-300 w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">GitHub Open Source</h3>
            </div>
            {trackerData?.github ? (
              <div className="flex-1 flex flex-col justify-center gap-4">
                 <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <span className="text-gray-400">Total Repos</span>
                    <span className="text-2xl font-bold text-white">{trackerData.github.publicRepos}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <span className="text-gray-400">Total Stars</span>
                    <span className="text-2xl font-bold text-[#f59e0b]">{trackerData.github.totalStars}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <span className="text-gray-400">Followers</span>
                    <span className="text-2xl font-bold text-accent-400">{trackerData.github.followers}</span>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col text-gray-500">
                <p>No account linked</p>
              </div>
            )}
          </div>
        </div>

        {/* HeatmapRow */}
        <div className="p-6 backdrop-blur-md bg-dark-800/40 rounded-2xl border border-white/5 shadow-glass w-full overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Consistency Heatmap (90 Days)</h3>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-max">
                {generateHeatmap()}
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
