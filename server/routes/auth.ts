import { Router } from 'express';
import { db, UserDoc } from '../db.js';
import { generateToken, hashPassword, comparePassword, authenticateJWT, AuthRequest } from '../auth.js';

const router = Router();

// Ensure at least one demo user exists in DB
async function ensureDemoUsers() {
  const existingAdmin = await db.users.findOne({ email: 'admin@glamtrack.ug' });
  if (!existingAdmin) {
    const passwordHash = await hashPassword('AdminPass123!');
    await db.users.insertOne({
      _id: 'usr_admin_derick',
      name: 'Mabirizi Derick',
      email: 'admin@glamtrack.ug',
      passwordHash,
      role: 'admin',
      phone: '+256 701 234 567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      location: {
        lat: 0.3476,
        lng: 32.5825,
        address: 'Kololo, Kampala, Uganda',
      },
      loyaltyPoints: 10000,
      loyaltyTier: 'VIP Luxe',
    });
  }

  const existingCustomer = await db.users.findOne({ email: 'claire.valmont@example.com' });
  if (!existingCustomer) {
    const passwordHash = await hashPassword('GlamPass123!');
    await db.users.insertOne({
      _id: 'usr_claire_valmont',
      name: 'Amina Namubiru',
      email: 'claire.valmont@example.com',
      passwordHash,
      role: 'customer',
      phone: '+256 772 392 881',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      location: {
        lat: 0.3345,
        lng: 32.5892,
        address: 'Plot 14 Acacia Avenue, Kololo, Kampala',
      },
      loyaltyPoints: 1450,
      loyaltyTier: 'Gold',
    });
  }

  const existingProvider = await db.users.findOne({ email: 'camille.nailstudio@example.com' });
  if (!existingProvider) {
    const passwordHash = await hashPassword('StylistPass123!');
    await db.users.insertOne({
      _id: 'usr_camille_provider',
      name: 'Camille Nabatanzi',
      email: 'camille.nailstudio@example.com',
      passwordHash,
      role: 'provider',
      phone: '+256 752 782 990',
      avatar: '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
      location: {
        lat: 0.3345,
        lng: 32.5892,
        address: 'Plot 14 Acacia Avenue, Kololo',
      },
      loyaltyPoints: 3200,
      loyaltyTier: 'VIP Luxe',
    });
  }
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer', phone = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await db.users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.users.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'provider' ? 'provider' : 'customer',
      phone,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(name),
      loyaltyPoints: 100, // Welcome gift points!
      loyaltyTier: 'Bronze',
      location: {
        lat: 40.7306,
        lng: -73.9352,
        address: 'New York, NY',
      },
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create user account', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    await ensureDemoUsers();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier,
        location: user.location,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Instant Demo Login (convenient preset customer, provider, or admin)
router.post('/demo-login', async (req, res) => {
  try {
    await ensureDemoUsers();
    const { role = 'customer' } = req.body;
    let email = 'claire.valmont@example.com';
    if (role === 'admin') email = 'admin@glamtrack.ug';
    else if (role === 'provider') email = 'camille.nailstudio@example.com';

    const user = await db.users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Demo user not found' });
    }
    const token = generateToken(user);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier,
        location: user.location,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Demo login error', details: err.message });
  }
});

// Get current user profile
router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
  const user = req.user!;
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyTier: user.loyaltyTier,
      location: user.location,
    },
  });
});

export default router;
