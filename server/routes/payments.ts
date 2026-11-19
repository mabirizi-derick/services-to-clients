import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { optionalJWT, AuthRequest } from '../auth.js';

const router = Router();

// Process secure in-app payment
router.post('/process', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const {
      amount,
      currency = 'UGX',
      paymentMethod = 'mtn_momo', // 'mtn_momo' | 'airtel_money' | 'card' | 'glam_wallet'
      momoPhone = '+256 772 392 881',
      cardLast4 = '4242',
      bookingId,
      tipAmount = 0,
      loyaltyCode,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    let discount = 0;
    if (loyaltyCode) {
      const reward = await db.loyaltyRewards.findOne({ code: loyaltyCode.toUpperCase() });
      if (reward) {
        if (reward.code === 'KAMPALA20K') discount = 20000;
        else if (reward.code === 'BRAIDS40K') discount = 40000;
        else if (reward.code === 'SHEAGLOW') discount = 15000;
        else if (reward.code === 'PEARLVIP') discount = 80000;
      }
    }

    const subtotal = Math.max(0, amount - discount);
    // In Uganda 18% VAT standard, but salon services often display gross or standard minimal service fee
    const tax = Math.round(subtotal * 0.05); // 5% platform service & safety fee
    const totalCharged = Math.round(subtotal + tax + tipAmount);

    // Simulate instant Mobile Money API handshake (MTN Open API / Airtel Money developer API)
    const transactionId = 'momo_' + crypto.randomBytes(8).toString('hex');
    const authCode = 'UG_' + Math.floor(100000 + Math.random() * 900000);
    const pointsGranted = Math.floor(totalCharged / 500);

    const receipt = {
      transactionId,
      authCode,
      status: 'succeeded',
      amount: totalCharged,
      subtotal,
      tax,
      tip: tipAmount,
      discount,
      currency: 'UGX',
      paymentMethod,
      momoPhone: paymentMethod.includes('momo') || paymentMethod.includes('airtel') ? momoPhone : undefined,
      cardLast4: paymentMethod === 'card' ? cardLast4 : 'Mobile Money',
      timestamp: new Date().toISOString(),
      bookingId,
      pointsEarned: pointsGranted,
    };

    // If booking was passed, update payment status in MongoDB
    if (bookingId) {
      await db.bookings.updateOne(bookingId, {
        paymentStatus: 'paid',
        paymentId: transactionId,
      });
    }

    res.json({
      success: true,
      message: 'Payment processed securely',
      receipt,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Payment processing error', details: err.message });
  }
});

export default router;
