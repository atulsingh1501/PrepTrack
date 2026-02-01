/* ============================================
   PrepTrack — main.js
   Shared utilities used across all pages
   ============================================ */

/* ---- Nav active link highlight ---- */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('href') === page);
  });
}

/* ---- Heatmap generator ---- */
function buildHeatmap(containerId, cells = 182) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  for (let i = 0; i < cells; i++) {
    const d = document.createElement('div');
    const r = Math.random();
    d.className = 'heat-cell ' + (r < .45 ? 'h0' : r < .6 ? 'h1' : r < .75 ? 'h2' : r < .9 ? 'h3' : 'h4');
    wrap.appendChild(d);
  }
}

/* ---- Weekly bar chart ---- */
function buildWeekBars(containerId, data) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const max  = Math.max(...data, 1);
  wrap.innerHTML = '<div style="font-size:12px;color:var(--c-muted);margin-bottom:8px">Tasks completed / day this week</div>';
  days.forEach((d, i) => {
    const pct = Math.round((data[i] / max) * 100);
    wrap.innerHTML += `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:11px;color:var(--c-muted);min-width:28px">${d}</span>
        <div style="flex:1;height:6px;background:var(--c-border);border-radius:6px;overflow:hidden">
          <div style="width:${pct}%;height:100%;border-radius:6px;background:${i===6?'var(--c-border)':'var(--c-accent)'}"></div>
        </div>
        <span style="font-size:11px;color:var(--c-muted);min-width:16px;text-align:right">${data[i]}</span>
      </div>`;
  });
}

/* ---- Task helpers ---- */
function toggleTask(el) {
  el.classList.toggle('done');
  el.querySelector('.check').classList.toggle('checked');
  updateTaskCount();
}

function updateTaskCount() {
  const counter = document.getElementById('task-count');
  if (!counter) return;
  const total = document.querySelectorAll('#task-list .reminder-item').length;
  const done  = document.querySelectorAll('#task-list .reminder-item.done').length;
  counter.textContent = done + ' / ' + total + ' done';
}

function addTask() {
  const inp = document.getElementById('task-inp');
  if (!inp || !inp.value.trim()) return;
  const d = document.createElement('div');
  d.className = 'reminder-item';
  d.onclick = function () { toggleTask(this); };
  d.innerHTML = `<div class="check"></div>
    <div>
      <div class="reminder-text">${inp.value.trim()}</div>
      <div class="reminder-meta">Custom • Today</div>
    </div>`;
  document.getElementById('task-list').appendChild(d);
  inp.value = '';
  updateTaskCount();
}

/* ---- LeetCode helpers ---- */
function addLeet() {
  const n    = document.getElementById('leet-inp').value.trim();
  const diff = document.getElementById('leet-diff').value;
  if (!n) return;
  const cls  = { Easy: 'diff-easy', Medium: 'diff-med', Hard: 'diff-hard' }[diff];
  const row  = document.createElement('div');
  row.className = 'leet-row';
  row.setAttribute('data-diff', diff);
  row.innerHTML  = `<span class="diff ${cls}">${diff}</span>
    <span style="flex:1">${n}</span>
    <span class="badge badge-green">Solved</span>`;
  document.getElementById('leet-list').prepend(row);
  document.getElementById('leet-inp').value = '';

  const map = { Easy: 'lc-easy', Medium: 'lc-med', Hard: 'lc-hard' };
  const el  = document.getElementById(map[diff]);
  if (el) el.textContent = parseInt(el.textContent) + 1;
  const tot = document.getElementById('lc-total');
  if (tot) tot.textContent = parseInt(tot.textContent) + 1;
}

function filterLeet(val) {
  document.querySelectorAll('#leet-list .leet-row').forEach(r => {
    r.style.display = (val === 'all' || r.getAttribute('data-diff') === val) ? 'flex' : 'none';
  });
}

/* ---- Skills helpers ---- */
function addSkill() {
  const inp = document.getElementById('skill-inp');
  if (!inp || !inp.value.trim()) return;
  const chip = document.createElement('span');
  chip.className = 'skill-chip';
  chip.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:var(--c-amber);display:inline-block"></span>${inp.value.trim()}`;
  document.getElementById('skills-wrap').appendChild(chip);
  inp.value = '';
}

/* ---- Note tab switcher ---- */
function switchNote(el, id) {
  document.querySelectorAll('.itab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['dsa', 'cs', 'hr'].forEach(k => {
    const n = document.getElementById('note-' + k);
    if (n) n.style.display = k === id ? 'block' : 'none';
  });
}

/* ---- LocalStorage persistence (optional helper) ---- */
const Store = {
  get(key)       { try { return JSON.parse(localStorage.getItem('pt_' + key)); } catch { return null; } },
  set(key, val)  { localStorage.setItem('pt_' + key, JSON.stringify(val)); },
  del(key)       { localStorage.removeItem('pt_' + key); }
};

/* ---- Init on every page ---- */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
});
