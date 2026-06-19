import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/projects
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: { select: { id: true, name: true, company: true, avatar: true } },
        milestones: true,
        deployments: true,
        repos: true,
        qaRuns: true,
        timelines: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id as string },
      include: {
        client: true,
        milestones: true,
        deployments: true,
        repos: true,
        qaRuns: true,
        timelines: true,
        tickets: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
