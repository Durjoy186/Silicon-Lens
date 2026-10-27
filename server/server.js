import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database.js';
import notesRoutes from './routes/notes.js';
import projectsRoutes from './routes/projects.js';
import bookmarksRoutes from './routes/bookmarks.js';
import quizRoutes from './routes/quiz.js';

// Initialize Database Schema and Seeds
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/notes', notesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Silicon Lens Backend API & SQLite Engine',
    version: '2.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`[Silicon Lens Server] Running on http://localhost:${PORT}`);
});
