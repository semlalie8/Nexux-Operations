import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/knowledge
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category } = req.query;
    const articles = await prisma.knowledgeArticle.findMany({
      where: {
        ...(q ? {
          OR: [
            { title: { contains: q as string, mode: 'insensitive' } },
            { description: { contains: q as string, mode: 'insensitive' } },
            { body: { contains: q as string, mode: 'insensitive' } },
          ],
        } : {}),
        ...(category ? { category: category as string } : {}),
      },
      orderBy: { views: 'desc' },
    });
    res.json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/knowledge/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { id: req.params.id },
    });

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Increment views
    await prisma.knowledgeArticle.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } },
    });

    res.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/knowledge
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, isLocked, description, tags, body } = req.body;
    if (!title || !category) {
      res.status(400).json({ error: 'title and category are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });

    const article = await prisma.knowledgeArticle.create({
      data: {
        title,
        category,
        isLocked: isLocked || false,
        description: description || '',
        tags: tags || [],
        body: body || '',
        author: user?.name || 'Unknown',
        authorAvatar: user?.avatar || '1.png',
      },
    });

    res.status(201).json({ article });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/knowledge/:id
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, isLocked, description, tags, body } = req.body;
    const article = await prisma.knowledgeArticle.update({
      where: { id: req.params.id },
      data: { title, category, isLocked, description, tags, body },
    });
    res.json({ article });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/knowledge/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.knowledgeArticle.delete({ where: { id: req.params.id } });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
