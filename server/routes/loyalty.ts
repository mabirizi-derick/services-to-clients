import { Router } from 'express';
import { db } from '../db.js';
import { optionalJWT, AuthRequest } from '../auth.js';

const router = Router();

// Get loyalty status & available catalog
router.get('/status', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const userId = req.user ? req.user._id : 'usr_claire_valmont';
    const user = await db.users.findById(userId);

    const points = user ? user.loyaltyPoints : 1450;
    const tier = user ? user.loyaltyTier : 'Gold';
    const rewards = await db.loyaltyRewards.find();

    const tierTiers = [
      { name: 'Bronze', minPoints: 0, perk: '5% bonus points on Monday bookings' },
      { name: 'Silver', minPoints: 400, perk: 'Priority dispatch & free drink at salons' },
      { name: 'Gold', minPoints: 1000, perk: 'Complimentary cuticle oil & 10% off add-ons' },
      { name: 'VIP Luxe', minPoints: 2500, perk: 'Dedicated VIP concierge & zero cancellation fees' },
    ];

    res.json({
      loyalty: {
        points,
        tier,
        nextTier: tier === 'VIP Luxe' ? null : tier === 'Gold' ? 'VIP Luxe' : tier === 'Silver' ? 'Gold' : 'Silver',
        pointsToNextTier: tier === 'VIP Luxe' ? 0 : tier === 'Gold' ? Math.max(0, 2500 - points) : tier === 'Silver' ? Math.max(0, 1000 - points) : Math.max(0, 400 - points),
        tierList: tierTiers,
      },
      rewards,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch loyalty status', details: err.message });
  }
});

// Redeem a reward
router.post('/redeem', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const { rewardId } = req.body;
    const reward = await db.loyaltyRewards.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    const userId = req.user ? req.user._id : 'usr_claire_valmont';
    const user = await db.users.findById(userId);
    const points = user ? user.loyaltyPoints : 1450;

    if (points < reward.pointsRequired) {
      return res.status(400).json({
        error: `Insufficient points. You have ${points} pts, but this reward requires ${reward.pointsRequired} pts.`,
      });
    }

    const remainingPoints = points - reward.pointsRequired;
    if (user) {
      await db.users.updateOne(user._id, { loyaltyPoints: remainingPoints });
    }

    // Add notification
    await db.notifications.insertOne({
      userId,
      title: 'Reward Redeemed! 🎁',
      body: `You unlocked "${reward.title}". Use coupon code ${reward.code} at checkout.`,
      type: 'loyalty',
      read: false,
    });

    res.json({
      success: true,
      remainingPoints,
      couponCode: reward.code,
      rewardTitle: reward.title,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to redeem reward', details: err.message });
  }
});

export default router;
