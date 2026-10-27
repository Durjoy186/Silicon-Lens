import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Get all bookmarks, optionally by device
router.get('/', (req, res) => {
  try {
    const { deviceId } = req.query;
    let query = 'SELECT * FROM pin_bookmarks';
    const params = [];

    if (deviceId) {
      query += ' WHERE device_id = ? ORDER BY created_at DESC';
      params.push(deviceId);
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const bookmarks = db.prepare(query).all(...params);
    res.json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle bookmark (add if not present, remove if present)
router.post('/toggle', (req, res) => {
  try {
    const { device_id, pin_id } = req.body;
    if (!device_id || !pin_id) {
      return res.status(400).json({ success: false, message: 'device_id and pin_id are required' });
    }

    const existing = db.prepare('SELECT * FROM pin_bookmarks WHERE device_id = ? AND pin_id = ?').get(device_id, pin_id);

    if (existing) {
      db.prepare('DELETE FROM pin_bookmarks WHERE id = ?').run(existing.id);
      return res.json({ success: true, bookmarked: false, message: 'Bookmark removed' });
    } else {
      const result = db.prepare('INSERT INTO pin_bookmarks (device_id, pin_id) VALUES (?, ?)').run(device_id, pin_id);
      return res.json({ success: true, bookmarked: true, id: result.lastInsertRowid, message: 'Bookmark added' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
