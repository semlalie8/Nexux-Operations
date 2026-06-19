import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/tickets
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority, assignedToId, clientId } = req.query;

    const tickets = await prisma.ticket.findMany({
      where: {
        ...(status ? { status: status as string } : {}),
        ...(priority ? { priority: priority as string } : {}),
        ...(assignedToId ? { assignedToId: assignedToId as string } : {}),
        ...(clientId ? { clientId: clientId as string } : {}),
      },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        annotations: { orderBy: { createdAt: 'asc' } },
        attachments: true,
        client: { select: { name: true, company: true, avatar: true } },
        project: { select: { name: true, serviceType: true, thumbnail: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tickets/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id as string },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        annotations: { orderBy: { createdAt: 'asc' } },
        attachments: true,
        client: true,
        project: { include: { milestones: true, deployments: true, repos: true } },
      },
    });

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tickets
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      subject, priority, clientId, projectId,
      clientName, clientCompany, clientAvatar,
    } = req.body;

    if (!subject || !clientId) {
      res.status(400).json({ error: 'subject and clientId are required' });
      return;
    }

    // Get assigned user from token
    const assignedUser = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        priority: priority || 'Medium',
        clientId,
        clientName: clientName || '',
        clientCompany: clientCompany || '',
        clientAvatar: clientAvatar || '1.png',
        projectId: projectId || null,
        assignedToId: req.user!.userId,
        assignedToName: assignedUser?.name || '',
        assignedTeam: assignedUser?.team || '',
        lastMessage: 'Ticket created',
        lastMessageTime: 'Just now',
      },
      include: {
        messages: true,
        annotations: true,
        attachments: true,
      },
    });

    res.status(201).json({ ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tickets/:id/status
router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id as string },
      data: { status, updatedAt: new Date() },
    });
    res.json({ ticket });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tickets/:id/priority
router.put('/:id/priority', async (req: Request, res: Response): Promise<void> => {
  try {
    const { priority } = req.body;
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id as string },
      data: { priority, updatedAt: new Date() },
    });
    res.json({ ticket });
  } catch (error) {
    console.error('Update ticket priority error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tickets/:id/messages
router.post('/:id/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, isInternal } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: req.params.id as string,
        senderId: req.user!.userId,
        senderName: user?.name || 'Agent',
        avatar: user?.avatar || '1.png',
        role: user?.role || 'Agent',
        content,
        isInternal: isInternal || false,
      },
    });

    // Update last message on ticket
    await prisma.ticket.update({
      where: { id: req.params.id as string },
      data: {
        lastMessage: content.substring(0, 80),
        lastMessageTime: 'Just now',
        updatedAt: new Date(),
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tickets/:id/annotations
router.post('/:id/annotations', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });

    const annotation = await prisma.annotation.create({
      data: {
        ticketId: req.params.id as string,
        agentId: req.user!.userId,
        agentName: user?.name || 'Agent',
        avatar: user?.avatar || '1.png',
        text,
      },
    });

    res.status(201).json({ annotation });
  } catch (error) {
    console.error('Add annotation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
