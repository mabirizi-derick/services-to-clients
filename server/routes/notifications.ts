import { Router } from 'express';
import { db } from '../db.js';
import { optionalJWT, AuthRequest } from '../auth.js';

const router = Router();

// Get notifications
router.get('/', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const userId = req.user ? req.user._id : 'usr_claire_valmont';
    let notifs = await db.notifications.find({ userId });
    notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ notifications: notifs });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const updated = await db.notifications.updateOne(req.params.id, { read: true });
    res.json({ success: true, notification: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark notification as read', details: err.message });
  }
});

// Trigger a push notification simulation
router.post('/simulate', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const { title, body, type = 'system' } = req.body;
    const userId = req.user ? req.user._id : 'usr_claire_valmont';
    const notif = await db.notifications.insertOne({
      userId,
      title: title || 'Live Stylist Update',
      body: body || 'Your nail technician is approaching Mercer Street with sanitized tools.',
      type,
      read: false,
    });
    res.status(201).json({ notification: notif });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to trigger notification', details: err.message });
  }
});

export default router;
