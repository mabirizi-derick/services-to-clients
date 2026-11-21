import 'dotenv/config';
import express from 'express';
import { db } from './db.js';

import authRoutes from './routes/auth.js';
import providerRoutes from './routes/providers.js';
import bookingRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payments.js';
import reviewRoutes from './routes/reviews.js';
import loyaltyRoutes from './routes/loyalty.js';
import notificationRoutes from './routes/notifications.js';
import analyticsRoutes from './routes/analytics.js';

export function createApiApp() {
  const app = express();

  app.use(express.json());

  // Ensure MongoDB connection + initial seed are ready on every request (safe for serverless cold starts)
  app.use('/api', async (_req, _res, next) => {
    try {
      await db.seed();
      next();
    } catch (err) {
      next(err);
    }
  });

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
  app.get('/api/health', async (_req, res) => {
    await db.seed();
    res.json({
      status: 'healthy',
      service: 'Banda Services On-Demand Beauty & Nail API',
      database: db.mode,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Ensure unmatched /api/* endpoints always return JSON instead of HTML
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // Global JSON error handler for Express middleware errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      return res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
      });
    }
    next(err);
  });

  return app;
}
