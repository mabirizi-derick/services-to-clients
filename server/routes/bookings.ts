import { Router } from 'express';
import { db, BookingDoc } from '../db.js';
import { authenticateJWT, AuthRequest, optionalJWT } from '../auth.js';

const router = Router();

// Create new on-demand booking
router.post('/', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const {
      providerId,
      services,
      bookingType = 'on_demand',
      scheduledTime,
      address = 'Plot 14 Acacia Avenue, Kololo, Kampala',
      customerCoords = { lat: 0.3345, lng: 32.5892 },
      specialNotes = '',
      customerName = 'Amina Namubiru',
      customerPhone = '+256 772 392 881',
      paymentMethod = 'mtn_momo',
    } = req.body;

    const provider = await db.providers.findById(providerId);
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: 'At least one service must be selected' });
    }

    const totalAmount = services.reduce((sum, s) => sum + (s.price || 0), 0);
    // Loyalty points: 1 point per UGX 500 spent
    const pointsEarned = Math.floor(totalAmount / 500);

    const customerId = req.user ? req.user._id : 'usr_claire_valmont';

    const booking = await db.bookings.insertOne({
      customerId,
      customerName: req.user ? req.user.name : customerName,
      customerPhone: req.user ? req.user.phone : customerPhone,
      providerId: provider._id,
      providerName: provider.businessName,
      providerImage: provider.image,
      services,
      bookingType,
      scheduledTime: scheduledTime || new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      address,
      customerCoords,
      providerCoords: { ...provider.location },
      status: 'pending',
      totalAmount,
      paymentStatus: 'pending',
      paymentId: 'pay_' + Date.now(),
      etaMinutes: provider.estimatedArrivalMinutes || 20,
      specialNotes,
      pointsEarned,
    });

    // Credit loyalty points to user
    const user = await db.users.findById(customerId);
    if (user) {
      const newPoints = (user.loyaltyPoints || 0) + pointsEarned;
      let tier = user.loyaltyTier;
      if (newPoints >= 2500) tier = 'VIP Luxe';
      else if (newPoints >= 1000) tier = 'Gold';
      else if (newPoints >= 400) tier = 'Silver';

      await db.users.updateOne(user._id, {
        loyaltyPoints: newPoints,
        loyaltyTier: tier,
      });
    }

    // Push notification for booking confirmation
    await db.notifications.insertOne({
      userId: customerId,
      title: 'Booking Confirmed!',
      body: `Your session with ${provider.businessName} has been booked. Dispatch en route!`,
      type: 'booking',
      read: false,
      metadata: { bookingId: booking._id },
    });

    res.status(201).json({ booking, pointsEarned });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

// Get user bookings
router.get('/', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const customerId = req.user ? req.user._id : 'usr_claire_valmont';
    const bookings = await db.bookings.find({ customerId });
    // Sort descending by creation date
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ bookings });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

// Get single booking with live GPS data
router.get('/:id', async (req, res) => {
  try {
    const booking = await db.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ booking });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch booking', details: err.message });
  }
});

// Update booking status or GPS step (en_route -> arrived -> completed)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, providerCoords, etaMinutes } = req.body;
    const booking = await db.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updates: Partial<BookingDoc> = {};
    if (status) updates.status = status;
    if (providerCoords) updates.providerCoords = providerCoords;
    if (etaMinutes !== undefined) updates.etaMinutes = etaMinutes;

    const updated = await db.bookings.updateOne(booking._id, updates);

    // Notify user if provider is accepted, declined, en route or arrived
    if (status === 'accepted') {
      await db.notifications.insertOne({
        userId: booking.customerId,
        title: 'Stylist is Available! Booking Accepted 🔔',
        body: `${booking.providerName} confirmed they are available and are on the way.`,
        type: 'booking',
        read: false,
        metadata: { bookingId: booking._id },
      });
    } else if (status === 'declined') {
      await db.notifications.insertOne({
        userId: booking.customerId,
        title: 'Stylist Unavailable at This Time ⚠️',
        body: `${booking.providerName} is currently unavailable. Please pick another nearby provider.`,
        type: 'booking',
        read: false,
        metadata: { bookingId: booking._id },
      });
    } else if (status === 'en_route') {
      await db.notifications.insertOne({
        userId: booking.customerId,
        title: 'Stylist En Route! 🚗',
        body: `${booking.providerName} is now traveling to your location. ETA: ${etaMinutes || 12} mins.`,
        type: 'tracking',
        read: false,
        metadata: { bookingId: booking._id },
      });
    } else if (status === 'arrived') {
      await db.notifications.insertOne({
        userId: booking.customerId,
        title: 'Stylist Has Arrived! ✨',
        body: `${booking.providerName} is at your door with sterilized beauty equipment.`,
        type: 'tracking',
        read: false,
        metadata: { bookingId: booking._id },
      });
    }

    res.json({ booking: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update booking status', details: err.message });
  }
});

export default router;
