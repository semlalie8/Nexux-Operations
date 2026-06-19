import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/clients
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const clients = await prisma.clientProfile.findMany({
      include: {
        billingPrefs: { include: { routingRules: true } },
        portalUsers: true,
        childAccounts: true,
        projects: { select: { id: true, name: true, status: true, serviceType: true } },
        invoices: { select: { id: true, amount: true, status: true, dueDate: true } },
      },
      orderBy: { company: 'asc' },
    });
    res.json({ clients });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/clients/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await prisma.clientProfile.findUnique({
      where: { id: req.params.id as string },
      include: {
        billingPrefs: { include: { routingRules: true } },
        portalUsers: true,
        childAccounts: true,
        projects: { include: { milestones: true, deployments: true } },
        invoices: true,
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
