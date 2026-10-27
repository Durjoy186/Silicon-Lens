import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Get all projects, optionally filtered by deviceId
router.get('/', (req, res) => {
  try {
    const { deviceId } = req.query;
    let query = 'SELECT * FROM hardware_projects';
    const params = [];

    if (deviceId) {
      query += ' WHERE device_id = ? ORDER BY id ASC';
      params.push(deviceId);
    } else {
      query += ' ORDER BY id ASC';
    }

    const projects = db.prepare(query).all(...params).map(p => ({
      ...p,
      wiring: JSON.parse(p.wiring_json)
    }));

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single project by slug or id
router.get('/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    let project;
    if (isNaN(identifier)) {
      project = db.prepare('SELECT * FROM hardware_projects WHERE slug = ?').get(identifier);
    } else {
      project = db.prepare('SELECT * FROM hardware_projects WHERE id = ?').get(Number(identifier));
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      project: {
        ...project,
        wiring: JSON.parse(project.wiring_json)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
