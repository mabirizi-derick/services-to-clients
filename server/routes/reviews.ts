import { Router } from 'express';
import { db } from '../db.js';
import { optionalJWT, AuthRequest } from '../auth.js';

const router = Router();

// Get reviews
router.get('/', async (req, res) => {
  try {
    const { providerId } = req.query;
    let reviews = await db.reviews.find();
    if (providerId && typeof providerId === 'string') {
      reviews = reviews.filter((r) => r.providerId === providerId);
    }
    // Sort newest first
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ reviews });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
});

// Post a new review
router.post('/', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const { providerId, rating, comment, serviceName = 'Custom Service' } = req.body;
    if (!providerId || !rating || !comment) {
      return res.status(400).json({ error: 'Provider ID, rating (1-5), and review comment are required' });
    }

    const provider = await db.providers.findById(providerId);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    const customerId = req.user ? req.user._id : 'usr_claire_valmont';
    const customerName = req.user ? req.user.name : 'Claire Valmont';

    const review = await db.reviews.insertOne({
      providerId,
      customerId,
      customerName,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      serviceName,
      verifiedBooking: true,
    });

    // Recalculate provider aggregate rating in MongoDB collection
    const allProviderReviews = await db.reviews.find({ providerId });
    const avgRating =
      allProviderReviews.reduce((sum, r) => sum + r.rating, 0) / (allProviderReviews.length || 1);

    await db.providers.updateOne(providerId, {
      rating: Math.round(avgRating * 100) / 100,
      reviewsCount: allProviderReviews.length,
    });

    // Reward user with 50 loyalty points for leaving a review!
    const user = await db.users.findById(customerId);
    if (user) {
      await db.users.updateOne(customerId, {
        loyaltyPoints: (user.loyaltyPoints || 0) + 50,
      });
    }

    res.status(201).json({ review, newAverageRating: avgRating });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to post review', details: err.message });
  }
});

export default router;
