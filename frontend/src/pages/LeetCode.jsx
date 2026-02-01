import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import toast from 'react-hot-toast';

const diffClass = { Easy: 'diff-easy', Medium: 'diff-med', Hard: 'diff-hard' };
const statusBadge = { Solved: 'badge-green', Revisit: 'badge-amber', Pending: 'badge-red' };

export default function LeetCode() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', difficulty: 'Medium', status: 'Solved' });
  const [loading, setLoading] = useState(true);

  const fetchProblems = () => {
    API.get('/leetcode').then(({ data }) => setProblems(data)).finally(() => setLoading(false));
  };

  useEffect(fetchProblems, []);

  const addProblem = async () => {
    if (!form.name.trim()) return;
    try {
      const { data } = await API.post('/leetcode', form);
      setProblems(prev => [data, ...prev]);
      setForm({ name: '', difficulty: 'Medium', status: 'Solved' });
      toast.success('Problem added!');
    } catch { toast.error('Failed to add problem'); }
  };

  const deleteProblem = async (id) => {
    try {
      await API.delete(`/leetcode/${id}`);
      setProblems(prev => prev.filter(p => p._id !== id));
      toast.success('Problem removed');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'all' ? problems : problems.filter(p => p.difficulty === filter);

  const count = (diff) => problems.filter(p => p.difficulty === diff).length;

  return (
    <div className="app">
      <Navbar />
      <main className="page">

        {/* Difficulty Stats */}
        <div className="grid3" style={{ marginBottom: '1.25rem' }}>
          {[['Easy', 80, 'stat-val', 'var(--c-green)', 'bar-green'],
            ['Medium', 100, 'stat-val', 'var(--c-amber)', 'bar-amber'],
            ['Hard', 20, 'stat-val', 'var(--c-red)', 'bar-red']
          ].map(([diff, target, cls, color, bar]) => (
            <div className="card-sm" style={{ textAlign: 'center' }} key={diff}>
              <div className="stat-label">{diff}</div>
              <div className={cls} style={{ color }}>{count(diff)}</div>
              <div style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 4 }}>/ {target} target</div>
              <div className="progress-wrap">
                <div className={`progress-bar ${bar}`} style={{ width: `${Math.min((count(diff) / target) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Problem List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="section-title" style={{ margin: 0 }}>Problems ({problems.length} total)</div>
            <select className="select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="icon">📋</div>No problems yet. Add your first one!</div>
          ) : (
            <div id="leet-list">
              {filtered.map(p => (
                <div className="leet-row" key={p._id} data-diff={p.difficulty}>
                  <span className={`diff ${diffClass[p.difficulty]}`}>{p.difficulty}</span>
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span className={`badge ${statusBadge[p.status]}`}>{p.status}</span>
                  <button className="btn-danger" onClick={() => deleteProblem(p._id)}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="input-row">
            <input id="leet-inp" className="inp" placeholder="Problem name..."
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addProblem()} />
            <select id="leet-diff" className="select" value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: e.target.value })}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select className="select" value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Solved</option>
              <option>Revisit</option>
              <option>Pending</option>
            </select>
            <button id="leet-add" className="btn" onClick={addProblem}>Add</button>
          </div>
        </div>

      </main>
    </div>
  );
}
