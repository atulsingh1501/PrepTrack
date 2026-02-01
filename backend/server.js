const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/tasks',     require('./routes/tasks'));
app.use('/api/leetcode',  require('./routes/leetcode'));
app.use('/api/goals',     require('./routes/goals'));
app.use('/api/skills',    require('./routes/skills'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/profiles',  require('./routes/profiles'));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'PrepTrack API is running 🚀' }));

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
