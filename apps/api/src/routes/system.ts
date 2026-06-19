import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { getSystemMode, invalidateModeCache, SystemMode } from '../middleware/systemMode';
import { updateModeSchema } from '@nexus/shared';

const router = Router();

const VALID_MODES: SystemMode[] = ['production', 'readonly', 'maintenance', 'p0', 'info'];

const modeMessages: Record<SystemMode, string> = {
  production: '🟢 Live production environment — all operations active',
  readonly:   '⚠ Read-only mode — viewing training environment',
  maintenance:'🔧 Scheduled maintenance — writes suspended',
  p0:         '🚨 P0 incident in progress — restricted access',
  info:       'ℹ Platform notice active — normal operations',
};

const modeWritesAllowed: Record<SystemMode, boolean> = {
  production: true,
  readonly:   false,
  maintenance:false,
  p0:         false,
  info:       true,
};

// GET /api/system/status — public, no auth required
router.get('/status', async (_req: Request, res: Response): Promise<void> => {
  try {
    const mode = await getSystemMode();
    const config = await prisma.systemConfig.findUnique({ where: { key: 'system_mode' } });

    res.json({
      mode,
      message: modeMessages[mode],
      writesAllowed: modeWritesAllowed[mode],
      updatedAt: config?.updatedAt ?? null,
      updatedBy: config?.updatedBy ?? 'system',
    });
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({ error: 'Could not fetch system status' });
  }
});

// PUT /api/system/mode — Administrator only
router.put(
  '/mode',
  authenticate,
  requireRole('Administrator'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parsedBody = updateModeSchema.safeParse(req.body);
      if (!parsedBody.success) {
        res.status(400).json({
          error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}`,
        });
        return;
      }
      const mode = parsedBody.data.mode;

      const updatedBy = req.user!.email;

      await prisma.systemConfig.upsert({
        where:  { key: 'system_mode' },
        update: { value: mode, updatedBy },
        create: { key: 'system_mode', value: mode, updatedBy },
      });

      // Bust the in-memory cache so the next request reads fresh from DB
      invalidateModeCache();

      console.log(`[SYSTEM] Mode changed to "${mode}" by ${updatedBy}`);

      res.json({
        mode,
        message: modeMessages[mode as SystemMode],
        writesAllowed: modeWritesAllowed[mode as SystemMode],
        updatedBy,
      });
    } catch (error) {
      console.error('Mode change error:', error);
      res.status(500).json({ error: 'Failed to update system mode' });
    }
  }
);

export default router;
