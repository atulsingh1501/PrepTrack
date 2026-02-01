import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import toast from 'react-hot-toast';

const NOTE_TABS = ['DSA', 'Core CS', 'HR'];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [tab, setTab]     = useState('DSA');
  const [notes, setNotes] = useState({ DSA: '', 'Core CS': '', HR: '' });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', tag: 'Design', type: 'pdf' });

  useEffect(() => {
    API.get('/resources').then(({ data }) => {
      const pdfs = data.filter(r => r.type !== 'note');
      const noteItems = data.filter(r => r.type === 'note');
      setResources(pdfs);
      const n = { DSA: '', 'Core CS': '', HR: '' };
      noteItems.forEach(r => { if (n[r.tag] !== undefined) n[r.tag] = r.content; });
      setNotes(n);
    }).finally(() => setLoading(false));
  }, []);

  const addResource = async () => {
    if (!form.title.trim()) return;
    try {
      const { data } = await API.post('/resources', form);
      setResources(prev => [data, ...prev]);
      setForm({ title: '', tag: 'Design', type: 'pdf' });
      toast.success('Resource added!');
    } catch { toast.error('Failed to add'); }
  };

  const deleteResource = async (id) => {
    try {
      await API.delete(`/resources/${id}`);
      setResources(prev => prev.filter(r => r._id !== id));
      toast.success('Removed');
    } catch { toast.error('Failed'); }
  };

  const saveNote = async () => {
    try {
      // find existing note or create
      const { data } = await API.post('/resources', {
        title: `${tab} Notes`,
        type: 'note',
        tag: tab,
        content: notes[tab],
      });
      toast.success('Notes saved!');
    } catch { toast.error('Save failed'); }
  };

  const tagBadge = { Design:'badge-purple', Java:'badge-amber', DBMS:'badge-green', OS:'badge-red', CN:'badge-purple', General:'badge-purple' };

  return (
    <div className="app">
      <Navbar />
      <main className="page">
        <div className="grid2">

          {/* PDFs List */}
          <div className="card">
            <div className="section-title">PDFs &amp; Notes</div>

            {loading ? (
              <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : resources.length === 0 ? (
              <div className="empty-state"><div className="icon">📚</div>No resources yet. Add your first one!</div>
            ) : (
              <div id="pdf-list">
                {resources.map(r => (
                  <div className="pdf-item" key={r._id}>
                    <div className="pdf-icon">PDF</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--c-muted)' }}>
                        {r.pages ? `${r.pages} pages • ` : ''}Added {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge ${tagBadge[r.tag] || 'badge-purple'}`}>{r.tag}</span>
                    <button className="btn-danger" onClick={() => deleteResource(r._id)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="input-row" style={{ flexWrap: 'wrap' }}>
              <input className="inp" placeholder="Resource title..."
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && addResource()} style={{ flex: 1, minWidth: 140 }} />
              <select className="select" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
                {['Design','Java','DBMS','OS','CN','General'].map(t => <option key={t}>{t}</option>)}
              </select>
              <button className="btn" onClick={addResource}>Add PDF</button>
            </div>
          </div>

          {/* Prep Notes */}
          <div className="card">
            <div className="section-title">Prep Notes</div>
            <div className="tabs-inner">
              {NOTE_TABS.map(t => (
                <span key={t} className={`itab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</span>
              ))}
            </div>
            <textarea className="note-area" placeholder={`Write your ${tab} notes here...`}
              value={notes[tab]} onChange={e => setNotes({ ...notes, [tab]: e.target.value })} />
            <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
              <button className="btn-sm" onClick={saveNote}>Save Notes</button>
              <button className="btn-sm">Export as PDF</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
