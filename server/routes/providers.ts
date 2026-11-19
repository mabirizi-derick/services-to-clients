import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// Get list of providers
router.get('/', async (req, res) => {
  try {
    const { category, onDemandOnly, search } = req.query;
    let list = await db.providers.find();

    if (category && category !== 'all') {
      list = list.filter((p) => p.type === category);
    }

    if (onDemandOnly === 'true') {
      list = list.filter((p) => p.isOnDemandAvailable);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.businessName.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.services.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    res.json({ providers: list });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch providers', details: err.message });
  }
});

// Get provider details with reviews
router.get('/:id', async (req, res) => {
  try {
    const provider = await db.providers.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    const reviews = await db.reviews.find({ providerId: provider._id });
    res.json({ provider, reviews });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch provider details', details: err.message });
  }
});

// Admin: Add a new service provider
router.post('/', async (req, res) => {
  try {
    const {
      name,
      businessName,
      type = 'nail_salon',
      tagline,
      bio,
      image,
      gallery = [],
      location,
      isOnDemandAvailable = true,
      estimatedArrivalMinutes = 20,
      services = [],
      pricingLevel = '$$$',
      badges = [],
    } = req.body;

    if (!name || !businessName) {
      return res.status(400).json({ error: 'Artist Name and Salon Business Name are required' });
    }

    const defaultLoc = location || {
      address: 'Plot 10 Kampala Road',
      city: 'Central Kampala',
      lat: 0.3136,
      lng: 32.5811,
    };

    const newProvider = await db.providers.insertOne({
      name,
      businessName,
      type,
      tagline: tagline || 'Certified beauty and styling services in Kampala.',
      rating: 5.0,
      reviewsCount: 1,
      bio: bio || 'Professional beauty specialist dedicated to high standard hygiene and artistic perfection.',
      image: image || '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
      gallery: gallery.length > 0 ? gallery : [
        image || '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
        '/src/assets/images/uganda_african_braids_styling_1791276362274.jpg',
      ],
      location: defaultLoc,
      isOnDemandAvailable: Boolean(isOnDemandAvailable),
      estimatedArrivalMinutes: Number(estimatedArrivalMinutes) || 20,
      pricingLevel: pricingLevel || '$$$',
      badges: badges.length > 0 ? badges : ['Verified Ugandan Artist', 'Kampala Certified'],
      services: services.length > 0 ? services : [
        {
          id: 'srv_' + Date.now() + '_1',
          name: 'Standard Salon Service',
          category: type,
          description: 'Professional bespoke salon session.',
          durationMinutes: 60,
          price: 60000,
        },
      ],
    });

    res.status(201).json({ provider: newProvider, message: 'Service provider added successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add service provider', details: err.message });
  }
});

// Admin: Update service provider
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.providers.updateOne(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json({ provider: updated, message: 'Provider updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update provider', details: err.message });
  }
});

// Admin: Delete service provider
router.delete('/:id', async (req, res) => {
  try {
    const success = await db.providers.deleteOne(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json({ success: true, message: 'Provider deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete provider', details: err.message });
  }
});

export default router;
