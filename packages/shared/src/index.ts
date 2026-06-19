import { z } from 'zod';

export const systemModeSchema = z.enum(['production', 'readonly', 'maintenance', 'p0', 'info']);

export type SystemMode = z.infer<typeof systemModeSchema>;

export const updateModeSchema = z.object({
  mode: systemModeSchema,
});
