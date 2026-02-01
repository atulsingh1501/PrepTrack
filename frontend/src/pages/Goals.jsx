import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import toast from 'react-hot-toast';

const colorMap = {
  green: 'bar-green', amber: 'bar-amber', red: 'bar-red', purple: 'bar-purple'
};
const badgeMap = {
  green: 'badge-green', amber: 'badge-amber', red: 'badge-red', purple: 'badge-purple'
};

export default function Goals() {
  const [goals, setGoals]   = useState([]);
  const [form, setForm]     = useState({ name: '', icon: '🎯', target: '', current: 0, color: 'green' });
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/goals').then(({ data }) => setGoals(data)).finally(() => setLoading(false));
  }, []);

  const addGoal = async () => {
    if (!form.name.trim() || !form.target) return;
    try {
      const { data } = await API.post('/goals', { ...form, target: Number(form.target), current: Number(form.current) });
      setGoals(prev => [data, ...prev]);
      setForm({ name: '', icon: '🎯', target: '', current: 0, color: 'green' });
      setShowAdd(false);
      toast.success('Goal added!');
    } catch { toast.error('Failed to add goal'); }
  };

  const deleteGoal = async (id) => {
    try {
      await API.delete(`/goals/${id}`);
      setGoals(prev => prev.filter(g => g._id !== id));
      toast.success('Goal removed');
    } catch { toast.error('Failed'); }
  };

  const updateGoalProgress = async (goal, delta) => {
    const next = Math.max(0, Math.min(goal.current + delta, goal.target));
    try {
      const { data } = await API.patch(`/goals/${goal._id}`, { current: next });
      setGoals(prev => prev.map(g => g._id === goal._id ? data : g));
    } catch {}
  };

  const overallPct = goals.length === 0 ? 0 :
    Math.round(goals.reduce((acc, g) => acc + Math.min((g.current / g.target) * 100, 100), 0) / goals.length);

  const circumference = 2 * Math.PI * 64; // r=64
  const offset = circumference - (overallPct / 100) * circumference;

  return (
    <div className="app">
      <Navbar />
      <main className="page">
        <div className="grid2">

          {/* Goal List */}
          <div className="card">
            <div className="section-title">Placement Goals</div>

            {loading ? (
              <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : goals.length === 0 ? (
              <div className="empty-state"><div className="icon">🎯</div>No goals yet. Add your first one!</div>
            ) : (
              goals.map(g => {
                const pct = Math.round(Math.min((g.current / g.target) * 100, 100));
                return (
                  <div className="goal-row" key={g._id}>
                    <div className="goal-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>{g.icon}</div>
                    <div className="goal-info">
                      <div className="goal-name">{g.name}</div>
                      <div className="goal-sub">{g.current} / {g.target}</div>
                      <div className="progress-wrap">
                        <div className={`progress-bar ${colorMap[g.color]}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={`badge ${badgeMap[g.color]}`}>{pct}%</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button className="btn-sm" style={{ padding: '2px 8px' }} onClick={() => updateGoalProgress(g, 1)}>+</button>
                      <button className="btn-sm" style={{ padding: '2px 8px' }} onClick={() => updateGoalProgress(g, -1)}>−</button>
                    </div>
                    <button className="btn-danger" onClick={() => deleteGoal(g._id)}>✕</button>
                  </div>
                );
              })
            )}

            {showAdd ? (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="input-row">
                  <input className="inp" placeholder="Goal name..." value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} style={{ flex: 2 }} />
                  <input className="inp" placeholder="Icon (emoji)" value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })} style={{ flex: 0.4, minWidth: 60 }} />
                </div>
                <div className="input-row">
                  <input className="inp" type="number" placeholder="Current" value={form.current}
                    onChange={e => setForm({ ...form, current: e.target.value })} />
                  <input className="inp" type="number" placeholder="Target" value={form.target}
                    onChange={e => setForm({ ...form, target: e.target.value })} />
                  <select className="select" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}>
                    <option value="green">Green</option>
                    <option value="amber">Amber</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn" style={{ flex: 1 }} onClick={addGoal}>Save Goal</button>
                  <button className="btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setShowAdd(true)}>
                + Add New Goal
              </button>
            )}
          </div>

          {/* Readiness Ring */}
          <div className="card">
            <div className="section-title">Overall Placement Readiness</div>

            <div className="ring-wrap">
              <svg className="ring" width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="64" fill="none" stroke="#2e2e3e" strokeWidth="14" />
                <circle cx="80" cy="80" r="64" fill="none" stroke="url(#ringGrad)" strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform="rotate(-90 80 80)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3a0" />
                    <stop offset="100%" stopColor="#6c63ff" />
                  </linearGradient>
                </defs>
                <text x="80" y="76" textAnchor="middle" fill="#e8e8f0"
                  fontSize="28" fontWeight="600" fontFamily="Space Grotesk">{overallPct}%</text>
                <text x="80" y="96" textAnchor="middle" fill="#8888a0"
                  fontSize="12" fontFamily="Space Grotesk">Ready</text>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
              <div className="card-sm">
                <div className="stat-label">Target Companies</div>
                <div className="stat-val" style={{ fontSize: 20 }}>5</div>
              </div>
              <div className="card-sm">
                <div className="stat-label">Days to Season</div>
                <div className="stat-val" style={{ fontSize: 20, color: 'var(--c-amber)' }}>48</div>
              </div>
            </div>

            <div className="ai-box">
              <div className="ai-label">FORECAST</div>
              <div className="ai-suggest" style={{ fontSize: 12 }}>
                {overallPct >= 80
                  ? <>You're <strong>very well prepared</strong>! Target top companies with confidence.</>
                  : overallPct >= 50
                    ? <>At current pace, you'll reach <strong>80% readiness</strong> in ~3 weeks.
                        Focus on <strong>weaker goals</strong> for max impact.</>
                    : <>You have a solid start! Keep grinding and update your goals daily.</>
                }
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
