import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface BaseDoc {
  _id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface UserDoc extends BaseDoc {
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'provider' | 'admin';
  phone: string;
  avatar: string;
  location?: { lat: number; lng: number; address: string };
  loyaltyPoints: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Luxe';
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'nail_salon' | 'beauty_stylist' | 'hair_salon' | 'spa_wellness';
  description: string;
  durationMinutes: number;
  price: number;
}

export interface ProviderDoc extends BaseDoc {
  name: string;
  businessName: string;
  type: 'nail_salon' | 'beauty_stylist' | 'mobile_stylist';
  tagline: string;
  rating: number;
  reviewsCount: number;
  bio: string;
  image: string;
  gallery: string[];
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  isOnDemandAvailable: boolean;
  estimatedArrivalMinutes: number;
  services: ServiceItem[];
  pricingLevel: '$$' | '$$$' | '$$$$';
  badges: string[];
}

export interface BookingDoc extends BaseDoc {
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  services: ServiceItem[];
  bookingType: 'on_demand' | 'scheduled';
  scheduledTime: string;
  address: string;
  customerCoords: { lat: number; lng: number };
  providerCoords: { lat: number; lng: number };
  status: 'pending' | 'accepted' | 'confirmed' | 'declined' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentId?: string;
  etaMinutes?: number;
  specialNotes?: string;
  pointsEarned: number;
}

export interface ReviewDoc extends BaseDoc {
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceName: string;
  verifiedBooking: boolean;
}

export interface LoyaltyRewardDoc extends BaseDoc {
  title: string;
  pointsRequired: number;
  discountValue: string;
  description: string;
  category: string;
  code: string;
}

export interface NotificationDoc extends BaseDoc {
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'tracking' | 'payment' | 'loyalty' | 'system';
  read: boolean;
  metadata?: any;
}

export interface VisitDoc extends BaseDoc {
  visitorId: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  deviceType: 'mobile' | 'desktop';
  tab: string;
  userAgent?: string;
}

// In-Memory MongoDB-compatible Collection Engine with optional JSON persistence hook
export class MongoCollection<T extends BaseDoc> {
  private documents: Map<string, T> = new Map();
  private onChange?: () => void;

  constructor(public name: string, onChange?: () => void) {
    this.onChange = onChange;
  }

  setChangeListener(fn: () => void) {
    this.onChange = fn;
  }

  loadRaw(docs: T[]) {
    this.documents.clear();
    for (const d of docs) {
      if (d && d._id) {
        this.documents.set(d._id, d);
      }
    }
  }

  dumpRaw(): T[] {
    return Array.from(this.documents.values());
  }

  generateId(): string {
    return crypto.randomBytes(12).toString('hex');
  }

  async find(query: Partial<T> | ((doc: T) => boolean) = {}): Promise<T[]> {
    const list = Array.from(this.documents.values());
    if (typeof query === 'function') {
      return list.filter(query);
    }
    return list.filter((doc) => {
      for (const [key, val] of Object.entries(query)) {
        if ((doc as any)[key] !== val) return false;
      }
      return true;
    });
  }

  async findOne(query: Partial<T> | ((doc: T) => boolean)): Promise<T | null> {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  async findById(id: string): Promise<T | null> {
    return this.documents.get(id) || null;
  }

  async insertOne(doc: Omit<T, '_id' | 'createdAt' | 'updatedAt'> & Partial<BaseDoc>): Promise<T> {
    const now = new Date().toISOString();
    const id = doc._id || this.generateId();
    const fullDoc = {
      ...doc,
      _id: id,
      createdAt: (doc as any).createdAt || now,
      updatedAt: now,
    } as T;
    this.documents.set(id, fullDoc);
    this.onChange?.();
    return fullDoc;
  }

  async insertMany(docs: Array<Omit<T, '_id' | 'createdAt' | 'updatedAt'> & Partial<BaseDoc>>): Promise<T[]> {
    const created: T[] = [];
    for (const d of docs) {
      const now = new Date().toISOString();
      const id = d._id || this.generateId();
      const fullDoc = {
        ...d,
        _id: id,
        createdAt: (d as any).createdAt || now,
        updatedAt: now,
      } as T;
      this.documents.set(id, fullDoc);
      created.push(fullDoc);
    }
    this.onChange?.();
    return created;
  }

  async updateOne(idOrQuery: string | Partial<T>, update: Partial<T>): Promise<T | null> {
    let targetId: string | null = null;
    if (typeof idOrQuery === 'string') {
      targetId = idOrQuery;
    } else {
      const match = await this.findOne(idOrQuery);
      if (match) targetId = match._id;
    }

    if (!targetId || !this.documents.has(targetId)) return null;

    const existing = this.documents.get(targetId)!;
    const updated: T = {
      ...existing,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    this.documents.set(targetId, updated);
    this.onChange?.();
    return updated;
  }

  async deleteOne(id: string): Promise<boolean> {
    const deleted = this.documents.delete(id);
    if (deleted) this.onChange?.();
    return deleted;
  }

  async count(): Promise<number> {
    return this.documents.size;
  }
}

const STORE_FILE = path.resolve(process.cwd(), 'server', 'data', 'store.json');

// Database instance containing all MongoDB collections
export class Database {
  users = new MongoCollection<UserDoc>('users');
  providers = new MongoCollection<ProviderDoc>('providers');
  bookings = new MongoCollection<BookingDoc>('bookings');
  reviews = new MongoCollection<ReviewDoc>('reviews');
  loyaltyRewards = new MongoCollection<LoyaltyRewardDoc>('loyaltyRewards');
  notifications = new MongoCollection<NotificationDoc>('notifications');
  visits = new MongoCollection<VisitDoc>('visits');

  private saveTimer: NodeJS.Timeout | null = null;
  private isHydrating = false;

  constructor() {
    const scheduleSave = () => {
      if (this.isHydrating) return;
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        this.persistToDisk();
      }, 250);
    };

    this.users.setChangeListener(scheduleSave);
    this.providers.setChangeListener(scheduleSave);
    this.bookings.setChangeListener(scheduleSave);
    this.reviews.setChangeListener(scheduleSave);
    this.loyaltyRewards.setChangeListener(scheduleSave);
    this.notifications.setChangeListener(scheduleSave);
    this.visits.setChangeListener(scheduleSave);
  }

  private hydrateFromDisk() {
    try {
      if (!fs.existsSync(STORE_FILE)) return;
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      this.isHydrating = true;
      if (Array.isArray(parsed.users)) this.users.loadRaw(parsed.users);
      if (Array.isArray(parsed.providers)) this.providers.loadRaw(parsed.providers);
      if (Array.isArray(parsed.bookings)) this.bookings.loadRaw(parsed.bookings);
      if (Array.isArray(parsed.reviews)) this.reviews.loadRaw(parsed.reviews);
      if (Array.isArray(parsed.loyaltyRewards)) this.loyaltyRewards.loadRaw(parsed.loyaltyRewards);
      if (Array.isArray(parsed.notifications)) this.notifications.loadRaw(parsed.notifications);
      if (Array.isArray(parsed.visits)) this.visits.loadRaw(parsed.visits);
    } catch {
      // Ignore corrupt or missing persistence file
    } finally {
      this.isHydrating = false;
    }
  }

  private persistToDisk() {
    try {
      fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
      const payload = {
        users: this.users.dumpRaw(),
        providers: this.providers.dumpRaw(),
        bookings: this.bookings.dumpRaw(),
        reviews: this.reviews.dumpRaw(),
        loyaltyRewards: this.loyaltyRewards.dumpRaw(),
        notifications: this.notifications.dumpRaw(),
        visits: this.visits.dumpRaw().slice(-10000),
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(payload), 'utf-8');
    } catch {
      // Non-fatal if filesystem is read-only
    }
  }

  async seed() {
    this.hydrateFromDisk();

    // Ensure demo accounts always exist right from boot
    if (!(await this.users.findOne({ email: 'admin@glamtrack.ug' }))) {
      const salt = await bcrypt.genSalt(10);
      await this.users.insertOne({
        _id: 'usr_admin_derick',
        name: 'Mabirizi Derick',
        email: 'admin@glamtrack.ug',
        passwordHash: await bcrypt.hash('AdminPass123!', salt),
        role: 'admin',
        phone: '+256 701 234 567',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        location: { lat: 0.3476, lng: 32.5825, address: 'Kololo, Kampala, Uganda' },
        loyaltyPoints: 10000,
        loyaltyTier: 'VIP Luxe',
      });
    }
    if (!(await this.users.findOne({ email: 'claire.valmont@example.com' }))) {
      const salt = await bcrypt.genSalt(10);
      await this.users.insertOne({
        _id: 'usr_claire_valmont',
        name: 'Amina Namubiru',
        email: 'claire.valmont@example.com',
        passwordHash: await bcrypt.hash('GlamPass123!', salt),
        role: 'customer',
        phone: '+256 772 392 881',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        location: { lat: 0.3345, lng: 32.5892, address: 'Plot 14 Acacia Avenue, Kololo, Kampala' },
        loyaltyPoints: 1450,
        loyaltyTier: 'Gold',
      });
    }
    if (!(await this.users.findOne({ email: 'camille.nailstudio@example.com' }))) {
      const salt = await bcrypt.genSalt(10);
      await this.users.insertOne({
        _id: 'usr_camille_provider',
        name: 'Camille Nabatanzi',
        email: 'camille.nailstudio@example.com',
        passwordHash: await bcrypt.hash('StylistPass123!', salt),
        role: 'provider',
        phone: '+256 752 782 990',
        avatar: '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
        location: { lat: 0.3345, lng: 32.5892, address: 'Plot 14 Acacia Avenue, Kololo' },
        loyaltyPoints: 3200,
        loyaltyTier: 'VIP Luxe',
      });
    }

    if (await this.providers.count() > 0) return;

    // Seed Ugandan Salons & Beauty Stylists (Kampala, Uganda)
    await this.providers.insertMany([
      {
        _id: 'prov_kololo_nails',
        name: 'Camille Nabatanzi',
        businessName: 'L’Atelier Nail Studio & Paint Bar - Kololo',
        type: 'nail_salon',
        tagline: 'Kampala’s premier studio for hand-painted nail art, Russian dry manicure & BIAB gel.',
        rating: 4.96,
        reviewsCount: 184,
        bio: 'Certified nail artist trained in Kampala and Paris. Master of detailed hand-painted nail designs, acrylic extensions, and luxury herbal foot spas.',
        image: '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
        gallery: [
          '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
          '/src/assets/images/salon_manicure_luxury_1791273765852.jpg',
          '/src/assets/images/uganda_kampala_glam_salon_1791276380347.jpg',
        ],
        location: {
          address: 'Plot 14 Acacia Avenue, Kololo',
          city: 'Kololo, Kampala',
          lat: 0.3345,
          lng: 32.5892,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 18,
        pricingLevel: '$$$',
        badges: ['Acacia Ave Certified', 'Hand-Painted Art Specialist', 'Instant MoMo Ready'],
        services: [
          {
            id: 'srv_ug_art_mani',
            name: 'Hand-Painted Intricate Gel Nail Art',
            category: 'nail_salon',
            description: 'Bespoke custom patterns, geometric line art, chrome pigments, and builder gel reinforcement.',
            durationMinutes: 75,
            price: 75000, // UGX 75,000
          },
          {
            id: 'srv_ug_rus_mani',
            name: 'Russian Precision Manicure & Cuticle Care',
            category: 'nail_salon',
            description: 'Flawless dry e-file machine cuticle cleanup, nail alignment, and long-lasting gel coating.',
            durationMinutes: 60,
            price: 60000, // UGX 60,000
          },
          {
            id: 'srv_ug_spa_pedi',
            name: 'Deluxe Botanical Pedicure & Scrub',
            category: 'nail_salon',
            description: 'Herbal foot soak with natural shea butter, exfoliating dead skin treatment, and warm towel wrap.',
            durationMinutes: 65,
            price: 55000, // UGX 55,000
          },
        ],
      },
      {
        _id: 'prov_bukoto_braids',
        name: 'Julian Mugisha',
        businessName: 'Crown & Braids Hair Lounge - Bukoto',
        type: 'beauty_stylist',
        tagline: 'Expert knotless braids, dreadlocks styling, passion twists & red carpet glam to your door.',
        rating: 4.94,
        reviewsCount: 231,
        bio: 'Leading Kampala natural hair architect with 8 years of styling experience. Specializing in neat painless knotless box braids, sisterlocks maintenance, and modern editorial styling.',
        image: '/src/assets/images/uganda_african_braids_styling_1791276362274.jpg',
        gallery: [
          '/src/assets/images/uganda_african_braids_styling_1791276362274.jpg',
          '/src/assets/images/uganda_dreadlocks_hair_salon_1791276371574.jpg',
          '/src/assets/images/uganda_kampala_glam_salon_1791276380347.jpg',
        ],
        location: {
          address: 'Plot 28 Bukoto-Ntinda Road',
          city: 'Bukoto, Kampala',
          lat: 0.3524,
          lng: 32.5982,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 22,
        pricingLevel: '$$$',
        badges: ['Mobile Dispatch Van', 'Painless Braiding', 'Top Rated in Kampala'],
        services: [
          {
            id: 'srv_ug_knotless',
            name: 'Waist-Length Knotless Box Braids',
            category: 'beauty_stylist',
            description: 'Ultra-lightweight tension-free knotless braids with customized golden accessory cuffs and curled ends.',
            durationMinutes: 180,
            price: 120000, // UGX 120,000
          },
          {
            id: 'srv_ug_dreadlocks',
            name: 'Dreadlocks Wash, Retwist & Architectural Styling',
            category: 'beauty_stylist',
            description: 'Clarifying herbal wash, palm-roll retwisting with organic beeswax, and elegant crown styling.',
            durationMinutes: 90,
            price: 80000, // UGX 80,000
          },
          {
            id: 'srv_ug_blowout',
            name: 'Silk Press & Botanical Scalp Steam Treatment',
            category: 'beauty_stylist',
            description: 'Deep moisture conditioning steam, high-gloss heat protection, and mirror-shine silk press.',
            durationMinutes: 75,
            price: 70000, // UGX 70,000
          },
        ],
      },
      {
        _id: 'prov_bugolobi_glam',
        name: 'Patricia Atim',
        businessName: 'Pearl Glow Mobile Glam Bar - Bugolobi',
        type: 'mobile_stylist',
        tagline: 'On-demand mobile luxury van with complete salon amenities arriving across Kampala.',
        rating: 4.91,
        reviewsCount: 167,
        bio: 'Mobile beauty van equipped with sterilizers, professional makeup stations, and VIP luxury seats dispatching across Bugolobi, Muyenga, and Nakasero.',
        image: '/src/assets/images/uganda_kampala_glam_salon_1791276380347.jpg',
        gallery: [
          '/src/assets/images/uganda_kampala_glam_salon_1791276380347.jpg',
          '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
          '/src/assets/images/beauty_hairstylist_session_1791273776048.jpg',
        ],
        location: {
          address: 'Bandali Rise, Bugolobi',
          city: 'Bugolobi, Kampala',
          lat: 0.3178,
          lng: 32.6189,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 15,
        pricingLevel: '$$$$',
        badges: ['VIP Mobile Van', 'Rapid Dispatch', 'All Kampala Coverage'],
        services: [
          {
            id: 'srv_ug_full_glam',
            name: 'Full Face Event Contour & Glam Styling',
            category: 'beauty_stylist',
            description: 'Long-lasting HD makeup contouring, premium lash extensions, and hair styling for weddings or parties.',
            durationMinutes: 80,
            price: 150000, // UGX 150,000
          },
          {
            id: 'srv_ug_acrylic_full',
            name: 'Sculptured Acrylic Extensions & French Fade',
            category: 'nail_salon',
            description: 'Stiletto or almond custom acrylics with ombre french finish and protective top seal.',
            durationMinutes: 90,
            price: 85000, // UGX 85,000
          },
        ],
      },
      {
        _id: 'prov_nakasero_spa',
        name: 'Joan Kembabazi',
        businessName: 'Nakasero Hill Botanical Nail Spa',
        type: 'nail_salon',
        tagline: 'Quiet, serene studio offering organic Ugandan shea butter manicures and vegan polishes.',
        rating: 4.88,
        reviewsCount: 129,
        bio: 'Holistic esthetician offering organic non-toxic nail care, nail recovery treatments, and calming lavender spa pedicures in Nakasero.',
        image: '/src/assets/images/stylist_pedicure_spa_1791273785412.jpg',
        gallery: [
          '/src/assets/images/stylist_pedicure_spa_1791273785412.jpg',
          '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
        ],
        location: {
          address: 'Plot 7 Kyaggwe Road, Nakasero',
          city: 'Nakasero, Kampala',
          lat: 0.3241,
          lng: 32.5765,
        },
        isOnDemandAvailable: false,
        estimatedArrivalMinutes: 30,
        pricingLevel: '$$',
        badges: ['Organic Shea Butter', 'Quiet Sanctuary', 'Hypoallergenic'],
        services: [
          {
            id: 'srv_ug_shea_mani',
            name: 'Organic Nilotica Shea Butter Manicure',
            category: 'nail_salon',
            description: 'Hydrating Ugandan shea butter treatment, cuticle nourishment, and breathable gel polish.',
            durationMinutes: 50,
            price: 50000, // UGX 50,000
          },
          {
            id: 'srv_ug_lavender_pedi',
            name: 'Aromatherapy Lavender Spa Pedicure',
            category: 'nail_salon',
            description: 'Epsom salt soak, eucalyptus exfoliation, and 20-minute relaxing foot acupressure massage.',
            durationMinutes: 60,
            price: 65000, // UGX 65,000
          },
        ],
      },
      {
        _id: 'prov_kikoni_hostel_nails',
        name: 'Shamim Namubiru',
        businessName: 'Kikoni & Makerere Hostel Mobile Nails',
        type: 'nail_salon',
        tagline: 'Fast on-demand student hostel visits across Kikoni, Sir Apollo, and Makerere for 3D art & BIAB.',
        rating: 4.95,
        reviewsCount: 142,
        bio: 'Campus-favorite nail technician delivering quick 15-minute dispatch directly to university hostels and residences with full gel painting equipment.',
        image: '/src/assets/images/nail_cherry_french_uganda_1791278875735.jpg',
        gallery: [
          '/src/assets/images/nail_cherry_french_uganda_1791278875735.jpg',
          '/src/assets/images/nail_3d_blue_floral_pearls_1791278899395.jpg',
        ],
        location: {
          address: 'Kikoni Hostel Zone, Makerere',
          city: 'Makerere / Kikoni, Kampala',
          lat: 0.3378,
          lng: 32.5621,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 15,
        pricingLevel: '$$',
        badges: ['Hostel Call Specialist', 'Student Discount Ready', 'Express 15m Dispatch'],
        services: [
          {
            id: 'srv_hostel_cherry',
            name: 'Cherry French Tips & Acrylic Overlays',
            category: 'nail_salon',
            description: 'Trendy micro-painted cherries, almond tips, and chip-resistant gel gloss topcoat.',
            durationMinutes: 50,
            price: 48000, // UGX 48,000
          },
          {
            id: 'srv_hostel_gel_express',
            name: 'Express Gel Manicure & Cuticle Tidy',
            category: 'nail_salon',
            description: 'Rapid dry manicure with high-gloss Ugandan gel polish lasting 3+ weeks.',
            durationMinutes: 35,
            price: 35000, // UGX 35,000
          },
        ],
      },
      {
        _id: 'prov_banda_locs',
        name: 'Derrick Ssenyonga',
        businessName: 'Banda Campus Locks & Dread Architect',
        type: 'beauty_stylist',
        tagline: 'Organic dreadlock detox, interlocking, barrel rolls & neat retwist near Kyambogo & Banda.',
        rating: 4.93,
        reviewsCount: 178,
        bio: 'Dreadlock master craftsman renowned across Kampala for healthy scalp maintenance, palm-rolling, and protective afro-loc architecture.',
        image: '/src/assets/images/uganda_dreadlocks_hair_salon_1791276371574.jpg',
        gallery: [
          '/src/assets/images/uganda_dreadlocks_hair_salon_1791276371574.jpg',
          '/src/assets/images/uganda_african_braids_styling_1791276362274.jpg',
        ],
        location: {
          address: 'Banda Stage 1, Jinja Road',
          city: 'Banda / Kyambogo, Kampala',
          lat: 0.3541,
          lng: 32.6324,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 20,
        pricingLevel: '$$',
        badges: ['Banda Hub', 'Organic Beeswax', 'Dreadlock Master'],
        services: [
          {
            id: 'srv_banda_loc_retwist',
            name: 'Beeswax Dreadlocks Retwist & Crown Barrel Roll',
            category: 'beauty_stylist',
            description: 'Clarifying ACV soak, scalp stimulation, palm rolling, and architectural crown updo.',
            durationMinutes: 90,
            price: 75000, // UGX 75,000
          },
          {
            id: 'srv_banda_loc_repair',
            name: 'Instant Loc Repair & Sisterlocks Tightening',
            category: 'beauty_stylist',
            description: 'Crochet needle root reconstruction and root tightening.',
            durationMinutes: 80,
            price: 65000, // UGX 65,000
          },
        ],
      },
      {
        _id: 'prov_ntinda_silkpress',
        name: 'Ritah Akello',
        businessName: 'Silk & Crown Hair Atelier - Ntinda',
        type: 'beauty_stylist',
        tagline: 'Ultrasonic steam hydration, red carpet silk press & bohemian passion twists in Ntinda.',
        rating: 4.92,
        reviewsCount: 156,
        bio: 'Specialist in heat-damage-free silk presses, natural afro hair texture revitalization, and lightweight curly passion twists.',
        image: '/src/assets/images/hair_passion_twist_curls_1791279494928.jpg',
        gallery: [
          '/src/assets/images/hair_passion_twist_curls_1791279494928.jpg',
          '/src/assets/images/beauty_hairstylist_session_1791273776048.jpg',
        ],
        location: {
          address: 'Ntinda Shopping Centre, Level 2',
          city: 'Ntinda, Kampala',
          lat: 0.3556,
          lng: 32.6148,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 22,
        pricingLevel: '$$$',
        badges: ['Zero Heat Damage', 'Passion Twists Pro', 'Ntinda Verified'],
        services: [
          {
            id: 'srv_ntinda_passion',
            name: 'Bohemian Goddess Passion Twists (Mid-Back)',
            category: 'beauty_stylist',
            description: 'Water-wave curly bohemian passion twists with custom length and satin finish.',
            durationMinutes: 150,
            price: 110000, // UGX 110,000
          },
          {
            id: 'srv_ntinda_steam_press',
            name: 'Ultrasonic Scalp Steam Detox & Mirror Silk Press',
            category: 'beauty_stylist',
            description: 'Peptide bond repair treatment followed by ceramic smooth press.',
            durationMinutes: 70,
            price: 75000, // UGX 75,000
          },
        ],
      },
      {
        _id: 'prov_muyenga_bridal',
        name: 'Evelyn Nalwanga',
        businessName: 'Muyenga Royal Bridal & Gel Lounge',
        type: 'beauty_stylist',
        tagline: 'Traditional Ugandan Kwanjula bridal hair architectures, Gomesi updos & gel sets.',
        rating: 4.97,
        reviewsCount: 198,
        bio: 'Prestigious bridal hair and aesthetic artisan dressing brides and VIP entourages for Kwanjula, Kuhingira, and white wedding ceremonies.',
        image: '/src/assets/images/ugandan_stylist_client_session_1791281601103.jpg',
        gallery: [
          '/src/assets/images/ugandan_stylist_client_session_1791281601103.jpg',
          '/src/assets/images/uganda_kampala_glam_salon_1791276380347.jpg',
        ],
        location: {
          address: 'Tank Hill Road, Muyenga',
          city: 'Muyenga, Kampala',
          lat: 0.2974,
          lng: 32.6102,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 25,
        pricingLevel: '$$$$',
        badges: ['VIP Bridal Suite', 'Kwanjula Specialist', 'Elite Master'],
        services: [
          {
            id: 'srv_muyenga_kwanjula',
            name: 'Traditional Kwanjula Sculptured Gomesi Updo',
            category: 'beauty_stylist',
            description: 'Regal bridal sculpted hair structure customized to traditional Ugandan Gomesi necklines.',
            durationMinutes: 180,
            price: 200000, // UGX 200,000
          },
          {
            id: 'srv_muyenga_bridal_gel',
            name: 'Royal Bridal Pearl Gel Overlay & Pedicure Combo',
            category: 'nail_salon',
            description: 'Full luxury hands and feet transformation with real freshwater pearl charms.',
            durationMinutes: 110,
            price: 120000, // UGX 120,000
          },
        ],
      },
      {
        _id: 'prov_acacia_artisan',
        name: 'Brenda Kigozi',
        businessName: 'Acacia Luxury Marble & 3D Nail Atelier',
        type: 'nail_salon',
        tagline: '24K gold foil marble manicure, Russian e-file cuticle detailing & sculpted floral sets.',
        rating: 4.98,
        reviewsCount: 215,
        bio: 'Renowned nail sculptress in Kololo specializing in 3D acrylic blooms, 24K Ugandan gold leaf, and high-fashion stiletto nails.',
        image: '/src/assets/images/nail_marble_gold_leaf_1791279421494.jpg',
        gallery: [
          '/src/assets/images/nail_marble_gold_leaf_1791279421494.jpg',
          '/src/assets/images/nail_chrome_french_blush_1791279438915.jpg',
        ],
        location: {
          address: 'Acacia Mall Arcade, Kololo',
          city: 'Kololo, Kampala',
          lat: 0.3352,
          lng: 32.5898,
        },
        isOnDemandAvailable: true,
        estimatedArrivalMinutes: 18,
        pricingLevel: '$$$$',
        badges: ['24K Gold Specialist', '3D Sculpting Pro', 'Kololo Elite'],
        services: [
          {
            id: 'srv_acacia_gold_marble',
            name: '24K Gold Leaf & Emerald Quartz Marble Set',
            category: 'nail_salon',
            description: 'Genuine gold foil veins encased in high-gloss quartz marble gel on sculpted tips.',
            durationMinutes: 80,
            price: 75000, // UGX 75,000
          },
          {
            id: 'srv_acacia_3d_blooms',
            name: '3D Sculptured Acrylic Flowers & Pearl Charms',
            category: 'nail_salon',
            description: 'Hand-crafted 3D floral petals with embedded crystals and pearl beads.',
            durationMinutes: 90,
            price: 65000, // UGX 65,000
          },
        ],
      },
    ]);

    // Seed Loyalty Rewards (in UGX)
    await this.loyaltyRewards.insertMany([
      {
        _id: 'rew_ug_20k',
        title: 'UGX 20,000 Off Any Manicure or Braids',
        pointsRequired: 300,
        discountValue: 'UGX 20,000',
        description: 'Instant discount applied directly at checkout via MTN MoMo or Airtel Money.',
        category: 'Discount',
        code: 'KAMPALA20K',
      },
      {
        _id: 'rew_ug_cuticle',
        title: 'Complimentary Nilotica Shea Cuticle Treatment',
        pointsRequired: 500,
        discountValue: 'Free Add-on',
        description: 'Deep restorative moisture therapy added free to your session.',
        category: 'Perk',
        code: 'SHEAGLOW',
      },
      {
        _id: 'rew_ug_braids_pct',
        title: 'UGX 40,000 Off Knotless Braids or Dreadlocks',
        pointsRequired: 800,
        discountValue: 'UGX 40,000',
        description: 'Save UGX 40,000 on any hair session with Julian Mugisha in Bukoto.',
        category: 'Exclusive',
        code: 'BRAIDS40K',
      },
      {
        _id: 'rew_ug_vip_glam',
        title: 'VIP Pearl Glow Mobile House Call Package',
        pointsRequired: 1500,
        discountValue: 'UGX 80,000 Off',
        description: 'Mobile beauty van dispatched directly to your residence with free add-on drinks.',
        category: 'VIP Reward',
        code: 'PEARLVIP',
      },
    ]);

    // Seed Ugandan Client Reviews
    await this.reviews.insertMany([
      {
        providerId: 'prov_kololo_nails',
        customerId: 'demo_user_1',
        customerName: 'Amina Namubiru',
        rating: 5,
        comment: 'Camille’s hand-painted nail art on Acacia Avenue is unmatched in Kampala! She arrived on-demand at my Kololo apartment within 15 minutes. Paid seamlessly via MTN Mobile Money.',
        serviceName: 'Hand-Painted Intricate Gel Nail Art',
        verifiedBooking: true,
      },
      {
        providerId: 'prov_bukoto_braids',
        customerId: 'demo_user_2',
        customerName: 'Brenda Kiconco',
        rating: 5,
        comment: 'Julian gave me the neatest knotless box braids with zero pain! The live GPS tracking from Bukoto to my house in Ntinda was very accurate.',
        serviceName: 'Waist-Length Knotless Box Braids',
        verifiedBooking: true,
      },
      {
        providerId: 'prov_bugolobi_glam',
        customerId: 'demo_user_3',
        customerName: 'Faith Akello',
        rating: 5,
        comment: 'Booked the mobile van to Bugolobi for my sister’s engagement party. Complete acrylic extensions and makeup done right outside in the van. Highly recommend!',
        serviceName: 'Sculptured Acrylic Extensions & French Fade',
        verifiedBooking: true,
      },
    ]);
  }
}

export const db = new Database();
