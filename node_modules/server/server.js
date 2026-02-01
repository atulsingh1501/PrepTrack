import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import trackerRoutes from './routes/trackerRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import goalRoutes from './routes/goalRoutes.js';

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Basic Route
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/goals', goalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
