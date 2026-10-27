import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const { deviceId } = req.query;
    let query = 'SELECT * FROM quiz_results';
    const params = [];

    if (deviceId) {
      query += ' WHERE device_id = ?';
      params.push(deviceId);
    }
    query += ' ORDER BY score DESC, time_taken_seconds ASC LIMIT 20';

    const leaderboard = db.prepare(query).all(...params);
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit quiz result
router.post('/submit', (req, res) => {
  try {
    const { student_name, device_id, score, total_questions, time_taken_seconds } = req.body;
    if (!student_name || !device_id || score === undefined || !total_questions) {
      return res.status(400).json({ success: false, message: 'Missing required quiz submission fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO quiz_results (student_name, device_id, score, total_questions, time_taken_seconds)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(student_name.trim(), device_id, score, total_questions, time_taken_seconds || 0);

    const savedRecord = db.prepare('SELECT * FROM quiz_results WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, result: savedRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
