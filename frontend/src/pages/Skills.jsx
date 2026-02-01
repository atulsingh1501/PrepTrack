import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import toast from 'react-hot-toast';

const levelColor = { strong: 'var(--c-green)', learning: 'var(--c-amber)', weak: 'var(--c-red)' };
const CATEGORIES = ['Languages', 'Frameworks & Tools', 'Core CS'];

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', level: 'learning', category: 'Languages' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/skills').then(({ data }) => setSkills(data)).finally(() => setLoading(false));
  }, []);

  const addSkill = async () => {
    if (!form.name.trim()) return;
    try {
      const { data } = await API.post('/skills', form);
      setSkills(prev => [...prev, data]);
      setForm({ name: '', level: 'learning', category: 'Languages' });
      toast.success('Skill added!');
    } catch { toast.error('Failed to add skill'); }
  };

  const deleteSkill = async (id) => {
    try {
      await API.delete(`/skills/${id}`);
      setSkills(prev => prev.filter(s => s._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const byCategory = (cat) => skills.filter(s => s.category === cat);

  return (
    <div className="app">
      <Navbar />
      <main className="page">
        <div className="grid2">

          {/* Skills Panel */}
          <div className="card">
            <div className="section-title">Technical Skills</div>

            {loading ? (
              <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : (
              <div id="skills-wrap">
                {CATEGORIES.map(cat => (
                  <div key={cat} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 6 }}>{cat}</div>
                    {byCategory(cat).length === 0 && (
                      <span style={{ fontSize: 12, color: 'var(--c-muted)' }}>None yet</span>
                    )}
                    {byCategory(cat).map(s => (
                      <span key={s._id} className="skill-chip" onClick={() => deleteSkill(s._id)}
                        title="Click to remove">
                        <span style={{ width: 6, height: 6, borderRadius: '50%',
                          background: levelColor[s.level], display: 'inline-block' }} />
                        {s.name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Legend */}
            <div style={{ marginTop: 12, display: 'flex', gap: 10, fontSize: 11, color: 'var(--c-muted)', alignItems: 'center', flexWrap: 'wrap' }}>
              {Object.entries(levelColor).map(([lv, c]) => (
                <span key={lv} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
                  {lv.charAt(0).toUpperCase() + lv.slice(1)}
                </span>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 10 }}>Click chip to remove</span>
            </div>

            <div className="input-row" style={{ flexWrap: 'wrap', gap: 8 }}>
              <input id="skill-inp" className="inp" placeholder="Add skill..."
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ flex: 1, minWidth: 120 }} />
              <select className="select" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="strong">Strong</option>
                <option value="learning">Learning</option>
                <option value="weak">Weak</option>
              </select>
              <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <button className="btn" onClick={addSkill}>Add</button>
            </div>
          </div>

          {/* Git Projects Panel */}
          <div className="card">
            <div className="section-title">Git Projects</div>
            <div id="project-list">
              {[
                { name: 'E-Commerce REST API', status: 'Live', badge: 'badge-green',
                  desc: 'Full-stack Spring Boot REST API with JWT auth, CRUD, MySQL',
                  tags: ['Java', 'Spring Boot', 'MySQL', 'JWT'] },
                { name: 'Portfolio Website', status: 'WIP', badge: 'badge-amber',
                  desc: 'Personal portfolio with React, deployed on Vercel',
                  tags: ['React', 'TailwindCSS', 'Vercel'] },
                { name: 'DSA Visualizer', status: 'Done', badge: 'badge-green',
                  desc: 'Interactive visualizations for sorting & tree algorithms',
                  tags: ['JavaScript', 'Canvas API'] },
              ].map(p => (
                <div className="card-inner" key={p.name}>
                  <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {p.name} <span className={`badge ${p.badge}`}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 4, lineHeight: 1.5 }}>{p.desc}</div>
                  <div className="tag-row">
                    {p.tags.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-sm" style={{ width: '100%', marginTop: 4 }}>+ Add Project</button>
          </div>

        </div>
      </main>
    </div>
  );
}
