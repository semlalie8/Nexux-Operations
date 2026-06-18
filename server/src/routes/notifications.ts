import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/notifications
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reminders
router.get('/reminders', async (req: Request, res: Response): Promise<void> => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reminders });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reminders
router.post('/reminders', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, dueDate, entityType, entityId, entityName, priority } = req.body;
    const reminder = await prisma.reminder.create({
      data: {
        title,
        dueDate,
        entityType: entityType || '',
        entityId: entityId || '',
        entityName: entityName || '',
        priority: priority || 'medium',
        userId: req.user!.userId,
      },
    });
    res.status(201).json({ reminder });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/reminders/:id/toggle
router.put('/reminders/:id/toggle', async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await prisma.reminder.findUnique({ where: { id: req.params.id } });
    if (!reminder) { res.status(404).json({ error: 'Not found' }); return; }
    const updated = await prisma.reminder.update({
      where: { id: req.params.id },
      data: { completed: !reminder.completed },
    });
    res.json({ reminder: updated });
  } catch (error) {
    console.error('Toggle reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/reminders/:id
router.delete('/reminders/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.reminder.delete({ where: { id: req.params.id, userId: req.user!.userId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
