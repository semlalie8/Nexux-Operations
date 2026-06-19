import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export type SystemMode = 'production' | 'readonly' | 'maintenance' | 'p0' | 'info';

// Roles that are always allowed to write regardless of mode
const ALWAYS_WRITABLE_ROLES = ['Administrator'];
// Roles allowed to write in p0 mode
const P0_WRITABLE_ROLES = ['Administrator', 'TechnicalLead'];

// Cache mode in memory to avoid a DB hit on every request
let cachedMode: SystemMode = (process.env.APP_MODE as SystemMode) || 'production';
let cacheExpiry = 0;
const CACHE_TTL_MS = 10_000; // re-read from DB every 10 seconds

export async function getSystemMode(): Promise<SystemMode> {
  const now = Date.now();
  if (now < cacheExpiry) return cachedMode;

  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: 'system_mode' } });
    if (config) {
      cachedMode = config.value as SystemMode;
    }
  } catch {
    // DB not ready yet — fall back to cached/env value
  }
  cacheExpiry = now + CACHE_TTL_MS;
  return cachedMode;
}

export function invalidateModeCache() {
  cacheExpiry = 0;
}

export const systemModeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const mode = await getSystemMode();

  // Attach mode to every request so route handlers can inspect it
  (req as any).systemMode = mode;

  const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

  // Always allow auth routes and system status reads
  const isExemptPath =
    req.path.startsWith('/api/auth') ||
    req.path.startsWith('/api/system/status') ||
    req.path === '/health';

  if (!isWriteMethod || isExemptPath) {
    return next();
  }

  // Allow admins to change the system mode itself
  if (req.path.startsWith('/api/system/mode')) {
    return next();
  }

  const userRole = (req as any).user?.role || '';

  if (mode === 'readonly') {
    if (!ALWAYS_WRITABLE_ROLES.includes(userRole)) {
      res.status(503).json({
        error: 'System is in read-only mode',
        mode,
        code: 'SYSTEM_READONLY',
      });
      return;
    }
  }

  if (mode === 'maintenance') {
    if (!ALWAYS_WRITABLE_ROLES.includes(userRole)) {
      res.status(503).json({
        error: 'System is under maintenance — writes are suspended',
        mode,
        code: 'SYSTEM_MAINTENANCE',
      });
      return;
    }
  }

  if (mode === 'p0') {
    if (!P0_WRITABLE_ROLES.includes(userRole)) {
      res.status(503).json({
        error: 'P0 incident in progress — write access restricted',
        mode,
        code: 'SYSTEM_P0',
      });
      return;
    }
  }

  // 'production' and 'info' modes allow all writes
  next();
};
