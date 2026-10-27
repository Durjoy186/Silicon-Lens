import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Get all notes, optionally filtered by deviceId and/or pinId
router.get('/', (req, res) => {
  try {
    const { deviceId, pinId } = req.query;
    let query = 'SELECT * FROM pin_notes';
    const params = [];

    if (deviceId && pinId) {
      query += ' WHERE device_id = ? AND pin_id = ? ORDER BY updated_at DESC';
      params.push(deviceId, pinId);
    } else if (deviceId) {
      query += ' WHERE device_id = ? ORDER BY updated_at DESC';
      params.push(deviceId);
    } else {
      query += ' ORDER BY updated_at DESC';
    }

    const notes = db.prepare(query).all(...params);
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new pin note
router.post('/', (req, res) => {
  try {
    const { device_id, pin_id, title, content, course_code } = req.body;
    if (!device_id || !pin_id || !title || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO pin_notes (device_id, pin_id, title, content, course_code)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(device_id, pin_id, title, content, course_code || 'General');
    const createdNote = db.prepare('SELECT * FROM pin_notes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, note: createdNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update note
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, course_code } = req.body;

    const stmt = db.prepare(`
      UPDATE pin_notes
      SET title = ?, content = ?, course_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = stmt.run(title, content, course_code || 'General', id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const updatedNote = db.prepare('SELECT * FROM pin_notes WHERE id = ?').get(id);
    res.json({ success: true, note: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete note
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM pin_notes WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
