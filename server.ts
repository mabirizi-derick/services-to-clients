import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

import authRoutes from './server/routes/auth.js';
import providerRoutes from './server/routes/providers.js';
import bookingRoutes from './server/routes/bookings.js';
import paymentRoutes from './server/routes/payments.js';
import reviewRoutes from './server/routes/reviews.js';
import loyaltyRoutes from './server/routes/loyalty.js';
import notificationRoutes from './server/routes/notifications.js';
import analyticsRoutes from './server/routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware
  app.use(express.json());

  // Initialize & seed the MongoDB collections
  await db.seed();
  console.log('GlamTrack database seeded successfully.');

  // Mount API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/providers', providerRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/loyalty', loyaltyRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'GlamTrack On-Demand Beauty & Nail API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Ensure unmatched /api/* endpoints always return JSON instead of HTML
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // Global JSON error handler for Express middleware errors (e.g. malformed JSON body)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      return res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
      });
    }
    next(err);
  });

  // Serve Frontend
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlamTrack fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
