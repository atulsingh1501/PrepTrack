import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import toast from 'react-hot-toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SAMPLE_WEEK = [4, 3, 5, 2, 5, 3, 0];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [inp, setInp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/tasks').then(({ data }) => setTasks(data)).finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!inp.trim()) return;
    try {
      const { data } = await API.post('/tasks', { text: inp.trim(), category: 'Custom' });
      setTasks(prev => [data, ...prev]);
      setInp('');
      toast.success('Task added!');
    } catch { toast.error('Failed to add task'); }
  };

  const toggleTask = async (task) => {
    try {
      const { data } = await API.patch(`/tasks/${task._id}`, { done: !task.done });
      setTasks(prev => prev.map(t => t._id === task._id ? data : t));
    } catch { toast.error('Failed to update task'); }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const max   = Math.max(...SAMPLE_WEEK, 1);

  return (
    <div className="app">
      <Navbar />
      <main className="page">
        <div className="grid2">

          {/* Today's Tasks */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="section-title" style={{ margin: 0 }}>Today's Tasks</div>
              <span className="badge badge-green" id="task-count">{done} / {total} done</span>
            </div>

            {loading ? (
              <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : tasks.length === 0 ? (
              <div className="empty-state"><div className="icon">✅</div>No tasks yet. Add your first one!</div>
            ) : (
              <div id="task-list">
                {tasks.map(task => (
                  <div
                    key={task._id}
                    className={`reminder-item${task.done ? ' done' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`check${task.done ? ' checked' : ''}`}
                      onClick={() => toggleTask(task)} />
                    <div style={{ flex: 1 }} onClick={() => toggleTask(task)}>
                      <div className="reminder-text">{task.text}</div>
                      <div className="reminder-meta">{task.category || 'General'} • {task.time || 'Today'}</div>
                    </div>
                    <button className="btn-danger" onClick={() => deleteTask(task._id)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="input-row">
              <input id="task-inp" className="inp" placeholder="New task..."
                value={inp} onChange={e => setInp(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()} />
              <button className="btn" onClick={addTask}>Add</button>
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="card">
            <div className="section-title">Weekly Overview</div>
            <div id="week-bars">
              <div style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 8 }}>
                Tasks completed / day this week
              </div>
              {DAYS.map((d, i) => {
                const pct = Math.round((SAMPLE_WEEK[i] / max) * 100);
                return (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--c-muted)', minWidth: 28 }}>{d}</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--c-border)', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 6,
                        background: i === 6 ? 'var(--c-border)' : 'var(--c-accent)' }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--c-muted)', minWidth: 16, textAlign: 'right' }}>{SAMPLE_WEEK[i]}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <div className="section-title">Reminders Set</div>
              {[
                { icon: '⏰', label: 'Daily DSA at 9:00 AM', sub: 'Every day • Active', bg: '#1a2040' },
                { icon: '📖', label: 'Core CS Review at 2:00 PM', sub: 'Weekdays • Active', bg: '#2a1a1a' },
                { icon: '🚀', label: 'GitHub commit at 6:00 PM', sub: 'Every day • Active', bg: '#1a2a1a' },
              ].map(r => (
                <div className="reminder-pill" key={r.label}>
                  <div className="reminder-pill-icon" style={{ background: r.bg }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--c-muted)' }}>{r.sub}</div>
                  </div>
                  <span className="badge badge-green" style={{ marginLeft: 'auto' }}>ON</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
