import React, { useEffect, useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  Code2, CheckSquare, Target, Zap, Lightbulb, Plus, X,
  TrendingUp, Flame, ChevronRight, Brain, Loader2, LogOut
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useTaskStore from '../store/useTaskStore';
import useGoalStore from '../store/useGoalStore';
import useSkillStore from '../store/useSkillStore';
import useTrackerStore from '../store/useTrackerStore';
import toast from 'react-hot-toast';

// ─── helpers ────────────────────────────────────────────────────────────────
const getHour = () => new Date().getHours();
const greeting = () =>
  getHour() < 12 ? 'Good morning' : getHour() < 17 ? 'Good afternoon' : 'Good evening';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Build last-7-days labels
const last7 = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return DAYS[d.getDay()];
});

// Build 91-day heatmap data (mock seeded)
const buildHeatmap = (tasks = []) => {
  const map = {};
  tasks.forEach((t) => {
    if (t.isCompleted && t.updatedAt) {
      const key = t.updatedAt.slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    }
  });
  return Array.from({ length: 91 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (90 - i));
    const key = d.toISOString().slice(0, 10);
    const v = map[key] || 0;
    // seed a few mock non-zero days so it looks interesting
    const seed = ((i * 13 + 7) % 5);
    return { key, v: v || (seed < 2 ? 0 : seed < 3 ? 1 : seed < 4 ? 2 : 3) };
  });
};

// Color for heatmap level 0-3
const heatColor = (v) => {
  if (v === 0) return 'bg-dark-800';
  if (v === 1) return 'bg-indigo-500/30';
  if (v === 2) return 'bg-indigo-500/60';
  return 'bg-indigo-500';
};

// AI suggestion logic
const buildSuggestion = (tasks, goals, skills) => {
  const done = tasks.filter((t) => t.isCompleted).length;
  const pending = tasks.filter((t) => !t.isCompleted).length;
  const completedGoals = goals.filter((g) => g.progress >= 100).length;
  const weak = skills.filter((s) => s.level === 'Weak' || s.level === 'Learning').length;

  if (pending > 5) return `You have ${pending} pending tasks. Focus on completing high-priority ones today!`;
  if (weak > 0) return `${weak} skill${weak > 1 ? 's' : ''} marked Weak/Learning. Dedicate 30 min to strengthen them.`;
  if (completedGoals === goals.length && goals.length > 0) return "All goals completed! 🎉 Set new stretch goals to keep leveling up.";
  if (done === 0) return "You haven't completed any tasks yet today. Start with the easiest one to build momentum!";
  return "You're on a roll! Try solving a Hard LeetCode problem today to push your limits. 💪";
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Sk = ({ className = '' }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

// ─── Readiness Ring ──────────────────────────────────────────────────────────
const ReadinessRing = ({ pct }) => {
  const r = 54;
  const circ = 2 * Math.PI * r; // ~339
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#6366f1';

  return (
    <div className="relative flex items-center justify-center">
      <svg width={140} height={140} className="-rotate-90">
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
        <circle
          cx={70} cy={70} r={r} fill="none"
          stroke={color} strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s ease-out, stroke 0.5s' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-white">{pct}%</span>
        <span className="text-xs text-gray-400 mt-0.5">Ready</span>
      </div>
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, accent, loading }) => (
  <div className={`glass-card-hover rounded-2xl p-5 flex gap-4 items-start`}>
    <div className={`p-3 rounded-xl ${accent.bg}`}>
      <Icon className={`w-5 h-5 ${accent.text}`} />
    </div>
    {loading ? (
      <div className="flex-1 space-y-2">
        <Sk className="h-7 w-16" />
        <Sk className="h-3 w-24" />
      </div>
    ) : (
      <div className="flex-1 min-w-0">
        <p className={`text-2xl font-black ${accent.text}`}>{value}</p>
        <p className="text-sm text-gray-400 mt-0.5 truncate">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    )}
  </div>
);

// ─── Quick-Add Modal ──────────────────────────────────────────────────────────
const QuickAddModal = ({ onClose }) => {
  const [tab, setTab] = useState('task');
  const [task, setTask] = useState({ title: '', priority: 'Medium' });
  const { addTask } = useTaskStore();

  const submit = async (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    await addTask(task);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white">Quick Add</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-5 bg-dark-900 rounded-xl p-1">
          {['task', 'note'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'task' && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Task Title</label>
              <input
                autoFocus
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className="input-base"
                placeholder="e.g. Revise DP patterns..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                className="input-base appearance-none"
              >
                {['Low', 'Medium', 'High'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center">Add Task</button>
            </div>
          </form>
        )}

        {tab === 'note' && (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p className="text-sm">Use the <span className="text-indigo-400 font-medium">Study Hub</span> to add detailed notes.</p>
            <button onClick={onClose} className="mt-4 btn-primary mx-auto">Go to Study Hub</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-white/10 rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { tasks, isLoading: taskLoad, fetchTasks } = useTaskStore();
  const { goals, isLoading: goalLoad, fetchGoals } = useGoalStore();
  const { skills, isLoading: skillLoad, fetchSkills } = useSkillStore();
  const { trackerData, fetchTrackerData } = useTrackerStore();

  const [showModal, setShowModal] = useState(false);
  const [readiness, setReadiness] = useState(0);
  const ringRef = useRef(false);

  const loading = taskLoad || goalLoad || skillLoad;

  useEffect(() => {
    fetchTasks();
    fetchGoals();
    fetchSkills();
    fetchTrackerData();
  }, []);

  // Animate readiness ring after data loads
  useEffect(() => {
    if (!loading && !ringRef.current) {
      ringRef.current = true;
      const pct = calcReadiness();
      setTimeout(() => setReadiness(pct), 300);
    }
  }, [loading]);

  const todayStr = new Date().toDateString();
  const todayTasks = tasks.filter((t) => new Date(t.updatedAt || t.createdAt).toDateString() === todayStr);
  const doneTodayCount = todayTasks.filter((t) => t.isCompleted).length;
  const completedGoals = goals.filter((g) => g.progress >= 100).length;
  const goalPct = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;
  const strongSkills = skills.filter((s) => s.level === 'Strong').length;

  const lcData = trackerData?.leetcode;
  const lcTotal = lcData ? (lcData.easy || 0) + (lcData.medium || 0) + (lcData.hard || 0) : 0;

  const calcReadiness = () => {
    let score = 0;
    if (lcTotal > 0) score += Math.min(30, Math.round((lcTotal / 200) * 30));
    if (goals.length > 0) score += Math.min(25, Math.round(goalPct * 0.25));
    if (skills.length > 0) score += Math.min(25, Math.round((strongSkills / Math.max(skills.length, 1)) * 25));
    if (doneTodayCount > 0) score += Math.min(20, doneTodayCount * 5);
    return Math.min(score, 99);
  };

  // Weekly bar chart data (mock with LC counts seeded)
  const weeklyData = last7.map((day, i) => ({
    day,
    Easy: Math.floor(Math.random() * 4) + (lcData?.easy ? 1 : 0),
    Medium: Math.floor(Math.random() * 3),
    Hard: Math.floor(Math.random() * 2),
  }));

  const heatmap = buildHeatmap(tasks);
  const suggestion = buildSuggestion(tasks, goals, skills);

  const streak = 7; // Could be computed from task data

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Background glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── 1. Greeting Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-2xl px-6 py-5">
          <div>
            <h1 className="text-2xl font-black text-white">
              {greeting()}, {user?.name?.split(' ')[0] || 'Coder'} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              You're on a <span className="text-amber-400 font-bold">{streak}-day streak</span> 🔥
              &nbsp;·&nbsp; {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" /> Quick Add
            </button>
            <button
              onClick={() => logout()}
              className="p-2.5 rounded-xl bg-dark-800 border border-white/5 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 2. Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Code2} label="LeetCode Solved" value={lcTotal || '—'}
            sub={lcData ? `${lcData.easy || 0}E · ${lcData.medium || 0}M · ${lcData.hard || 0}H` : 'Link your account'}
            accent={{ bg: 'bg-amber-500/10', text: 'text-amber-400' }}
            loading={loading}
          />
          <StatCard
            icon={CheckSquare} label="Tasks Done Today" value={doneTodayCount}
            sub={`${tasks.filter(t => !t.isCompleted).length} pending`}
            accent={{ bg: 'bg-emerald-500/10', text: 'text-emerald-400' }}
            loading={loading}
          />
          <StatCard
            icon={Target} label="Goals Completed" value={`${goalPct}%`}
            sub={`${completedGoals} of ${goals.length} goals`}
            accent={{ bg: 'bg-indigo-500/10', text: 'text-indigo-400' }}
            loading={loading}
          />
          <StatCard
            icon={Zap} label="Strong Skills" value={strongSkills}
            sub={`${skills.length} skills tracked`}
            accent={{ bg: 'bg-rose-500/10', text: 'text-rose-400' }}
            loading={loading}
          />
        </div>

        {/* ── 3 + 5. Heatmap + Readiness ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Heatmap */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Activity Heatmap
              </h2>
              <span className="text-xs text-gray-500">Last 91 days</span>
            </div>

            <div className="flex gap-1 flex-wrap">
              {heatmap.map((d, i) => (
                <div
                  key={i}
                  className={`heatmap-cell ${heatColor(d.v)}`}
                  title={`${d.key}: ${d.v} activities`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-gray-500">Less</span>
              {[0, 1, 2, 3].map((v) => (
                <div key={v} className={`w-3 h-3 rounded-sm ${heatColor(v)}`} />
              ))}
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>

          {/* Readiness Ring */}
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
            <h2 className="text-base font-bold text-white self-start">Readiness Score</h2>
            {loading ? (
              <Sk className="w-[140px] h-[140px] rounded-full" />
            ) : (
              <ReadinessRing pct={readiness} />
            )}
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-400">
                Based on tasks, goals & skills
              </p>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                readiness >= 75 ? 'bg-emerald-500/10 text-emerald-400' :
                readiness >= 50 ? 'bg-amber-500/10 text-amber-400' :
                'bg-indigo-500/10 text-indigo-400'
              }`}>
                {readiness >= 75 ? '🚀 Interview Ready' : readiness >= 50 ? '📈 Keep Grinding' : '🌱 Just Starting'}
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 + 6. Weekly Chart + AI Suggestion ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Weekly Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" /> Weekly Problems
              </h2>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Easy</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Medium</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />Hard</span>
              </div>
            </div>
            {loading ? (
              <Sk className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} barSize={10} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="Easy" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Medium" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Hard" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* AI Suggestion + Quick Links */}
          <div className="flex flex-col gap-4">
            {/* AI Card */}
            <div className="glass-card rounded-2xl p-5 flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-bold text-white">AI Suggestion</span>
                <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">Smart</span>
              </div>
              {loading ? (
                <div className="space-y-2">
                  <Sk className="h-4 w-full" />
                  <Sk className="h-4 w-3/4" />
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed">{suggestion}</p>
              )}
            </div>

            {/* Quick nav */}
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Jump</p>
              {[
                { label: 'Daily Agenda', href: '/agenda', color: 'text-emerald-400' },
                { label: 'Goals', href: '/goals', color: 'text-indigo-400' },
                { label: 'Study Hub', href: '/study', color: 'text-amber-400' },
                { label: 'Platform Trackers', href: '/trackers', color: 'text-rose-400' },
              ].map(({ label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-dark-700/50 transition-all group"
                >
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── 7. Floating Quick-Add Button ── */}
      <button
        id="dashboard-fab"
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-indigo-600 to-primary-500 rounded-full flex items-center justify-center shadow-glow-indigo hover:scale-110 active:scale-95 transition-all duration-200 z-40"
        title="Quick Add"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Modal */}
      {showModal && <QuickAddModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
