import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const TOPICS = [
  { name: 'Arrays & Strings',   key: 'arrays',   color: 'bar-green' },
  { name: 'Dynamic Programming',key: 'dp',        color: 'bar-amber' },
  { name: 'Trees & Graphs',     key: 'trees',     color: 'bar-green' },
  { name: 'System Design',      key: 'sysdesign', color: 'bar-purple' },
  { name: 'OS & Networks',      key: 'osnw',      color: 'bar-purple' },
];

function Heatmap() {
  const cells = 182;
  const levels = Array.from({ length: cells }, () => {
    const r = Math.random();
    return r < 0.45 ? 'h0' : r < 0.6 ? 'h1' : r < 0.75 ? 'h2' : r < 0.9 ? 'h3' : 'h4';
  });
  return (
    <div className="heatmap" id="heatmap">
      {levels.map((cls, i) => (
        <div key={i} className={`heat-cell ${cls}`} title={`Day ${i + 1}`} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    API.get('/leetcode').then(({ data }) => {
      const total  = data.length;
      const easy   = data.filter(p => p.difficulty === 'Easy').length;
      const medium = data.filter(p => p.difficulty === 'Medium').length;
      const hard   = data.filter(p => p.difficulty === 'Hard').length;
      setStats({ total, easy, medium, hard });
    }).catch(() => {});
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main className="page">

        {/* Stats Row */}
        <div className="grid4" style={{ marginBottom: '1rem' }}>
          <div className="card-sm">
            <div className="stat-label">LeetCode Solved</div>
            <div className="stat-val">{stats.total}</div>
            <div className="stat-sub">{stats.easy}E · {stats.medium}M · {stats.hard}H</div>
          </div>
          <div className="card-sm">
            <div className="stat-label">Skills Mastered</div>
            <div className="stat-val">8</div>
            <div className="stat-sub">2 in progress</div>
          </div>
          <div className="card-sm">
            <div className="stat-label">Daily Streak</div>
            <div className="stat-val streak-grad" style={{ fontSize: 28 }}>14</div>
            <div className="stat-sub">days active</div>
          </div>
          <div className="card-sm">
            <div className="stat-label">Goal Progress</div>
            <div className="stat-val">62%</div>
            <div className="stat-sub">On track</div>
          </div>
        </div>

        {/* Topic Coverage + Heatmap */}
        <div className="grid2" style={{ marginBottom: '1rem' }}>
          <div className="card">
            <div className="section-title">Topic Coverage</div>
            {[{ name:'Arrays & Strings', pct:85, cls:'bar-green' },
              { name:'Dynamic Programming', pct:45, cls:'bar-amber' },
              { name:'Trees & Graphs', pct:70, cls:'bar-green' },
              { name:'System Design', pct:30, cls:'bar-purple' },
              { name:'OS & Networks', pct:40, cls:'bar-purple' },
            ].map(t => (
              <div className="topic-row" key={t.name}>
                <span className="topic-name">{t.name}</span>
                <div className="progress-wrap" style={{ flex: 1 }}>
                  <div className={`progress-bar ${t.cls}`} style={{ width: `${t.pct}%` }} />
                </div>
                <span className="topic-pct">{t.pct}%</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-title">Activity — last 6 months</div>
            <Heatmap />
            <div className="heatmap-legend">
              <span>Less</span>
              {['h0','h1','h2','h3','h4'].map(h => <div key={h} className={`legend-cell ${h}`} />)}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="ai-box">
          <div className="ai-label">AI SUGGESTION</div>
          <div className="ai-suggest">
            Based on your progress: <strong>Dynamic Programming</strong> is your weakest area (45%).
            Recommend solving 2–3 DP problems today — start with <em>Coin Change</em> and <em>Climbing Stairs</em>.
            Your <strong>System Design</strong> is also low (30%), consider reading HLD of URL Shortener this week.
            {stats.total > 0 && <> You've solved <strong>{stats.total}</strong> LeetCode problems so far — keep it up!</>}
          </div>
        </div>

      </main>
    </div>
  );
}
