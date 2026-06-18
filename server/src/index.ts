import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { prisma } from './lib/prisma';

// Routes
import authRouter from './routes/auth';
import ticketsRouter from './routes/tickets';
import clientsRouter from './routes/clients';
import projectsRouter from './routes/projects';
import knowledgeRouter from './routes/knowledge';
import notificationsRouter from './routes/notifications';
import settingsRouter from './routes/settings';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Nexus API' });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/settings', settingsRouter);

// ─── 404 Handler ────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start Server ────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`✅  Database connected`);
  } catch (err) {
    console.error('❌  Database connection failed:', err);
    process.exit(1);
  }
  console.log(`🚀  Nexus API running on http://localhost:${PORT}`);
  console.log(`📡  Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
