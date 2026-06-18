import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/settings
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!settings) {
      // Create default settings if not exist
      settings = await prisma.userSettings.create({
        data: { userId: req.user!.userId },
      });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/settings
router.put('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.userId },
      update: { ...req.body },
      create: { userId: req.user!.userId, ...req.body },
    });
    res.json({ settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
