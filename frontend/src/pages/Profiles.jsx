import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import toast from 'react-hot-toast';

const PLATFORMS = [
  { key: 'leetcode', label: 'LeetCode', color: '#ffa116' },
  { key: 'gfg', label: 'GeeksforGeeks', color: '#2f8d46' },
  { key: 'codechef', label: 'CodeChef', color: '#5B4638' },
  { key: 'codeforces', label: 'Codeforces', color: '#1f8acb' },
  { key: 'hackerrank', label: 'HackerRank', color: '#00ea64' },
  { key: 'codestudio', label: 'CodeStudio', color: '#f57c00' },
  { key: 'atcoder', label: 'AtCoder', color: '#222222' },
  { key: 'github', label: 'GitHub', color: '#ffffff' },
];

const ProfileCard = ({ profile, onDelete }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile.platform === 'leetcode') {
      fetch(`https://leetcode-stats-api.herokuapp.com/${profile.username}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setStats({ main: `${data.totalSolved} Solved`, sub: `${data.easySolved}E • ${data.mediumSolved}M • ${data.hardSolved}H` });
          }
        }).catch(() => {}).finally(() => setLoading(false));
    } else if (profile.platform === 'github') {
      fetch(`https://api.github.com/users/${profile.username}`)
        .then(res => res.json())
        .then(data => {
          if (data.login) {
            setStats({ main: `${data.public_repos} Repos`, sub: `${data.followers} Followers` });
          }
        }).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [profile]);

  const platformInfo = PLATFORMS.find(pl => pl.key === profile.platform) || { label: profile.platform, color: '#6c63ff' };

  return (
    <div className="card-sm" style={{ display: 'flex', flexDirection: 'column', minHeight: '130px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div className="stat-label" style={{ color: platformInfo.color, fontWeight: 700 }}>{platformInfo.label}</div>
        <button className="btn-danger" style={{ padding: '2px 8px' }} onClick={() => onDelete(profile._id)}>✕</button>
      </div>
      
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.5px' }}>{profile.username}</div>
      
      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>Fetching live stats...</div>
        ) : stats ? (
          <>
            <div className="stat-val" style={{ fontSize: '22px' }}>{stats.main}</div>
            <div className="stat-sub">{stats.sub}</div>
          </>
        ) : (
          <div className="stat-sub">Tracking active! ✅</div>
        )}
      </div>
    </div>
  );
};

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ platform: 'leetcode', username: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/profiles').then(({ data }) => setProfiles(data)).finally(() => setLoading(false));
  }, []);

  const addProfile = async () => {
    if (!form.username.trim()) return;
    try {
      const { data } = await API.post('/profiles', form);
      setProfiles(prev => {
        const exists = prev.find(p => p.platform === data.platform);
        if (exists) return prev.map(p => p.platform === data.platform ? data : p);
        return [...prev, data];
      });
      setForm({ ...form, username: '' });
      toast.success('Profile added/updated!');
    } catch { toast.error('Failed to add profile'); }
  };

  const deleteProfile = async (id) => {
    try {
      await API.delete(`/profiles/${id}`);
      setProfiles(prev => prev.filter(p => p._id !== id));
      toast.success('Profile removed');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="app">
      <Navbar />
      <main className="page">
        <div className="card">
          <div className="section-title">Coding Profiles</div>
          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : profiles.length === 0 ? (
            <div className="empty-state"><div className="icon">🏆</div>No profiles added yet!</div>
          ) : (
            <div className="grid4">
              {profiles.map(p => (
                <ProfileCard key={p._id} profile={p} onDelete={deleteProfile} />
              ))}
            </div>
          )}

          <div className="section-title" style={{ marginTop: '2rem' }}>Add Platform Profile</div>
          <div className="input-row" style={{ maxWidth: 500 }}>
            <select className="select" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
              {PLATFORMS.map(pl => (
                <option key={pl.key} value={pl.key}>{pl.label}</option>
              ))}
            </select>
            <input className="inp" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} 
              onKeyDown={e => e.key === 'Enter' && addProfile()} />
            <button className="btn" onClick={addProfile}>Add / Update</button>
          </div>
        </div>
      </main>
    </div>
  );
}
