export interface HairStyleItem {
  id: string;
  title: string;
  image: string;
  description: string;
  priceUgx: number;
  durationMinutes: number;
  styleType: 'Knotless Braids' | 'Dreadlocks & Locs' | 'Passion Twists' | 'Cornrows & Stitch' | 'Silk Press & Treatment' | 'Bridal Updo';
  hairLength: 'Waist Length' | 'Mid-Back' | 'Shoulder Length' | 'Short Sculpted';
  artist: string;
  salon: string;
  tags: string[];
}

export const HAIR_GALLERY: HairStyleItem[] = [
  {
    id: 'hair_knotless_waist',
    title: 'Waist-Length Golden Cuffed Knotless Box Braids',
    image: '/src/assets/images/uganda_african_braids_styling_1791276362274.jpg',
    description: 'Weightless, tension-free knotless box braids with clean geometric square parting, adorned with royal golden filigree cuffs and curled tips.',
    priceUgx: 120000,
    durationMinutes: 180,
    styleType: 'Knotless Braids',
    hairLength: 'Waist Length',
    artist: 'Julian Mugisha',
    salon: 'Crown & Braids Hair Lounge - Bukoto',
    tags: ['Knotless Braids', 'Painless', 'Golden Cuffs', 'Protective Style'],
  },
  {
    id: 'hair_dreadlocks_crown',
    title: 'Architectural Dreadlocks Retwist & Crown Barrel Roll',
    image: '/src/assets/images/uganda_dreadlocks_hair_salon_1791276371574.jpg',
    description: 'Deep clarifying herbal shampoo, palm-roll retwisting using pure Ugandan organic beeswax, and an elegant formal crown barrel roll style.',
    priceUgx: 85000,
    durationMinutes: 90,
    styleType: 'Dreadlocks & Locs',
    hairLength: 'Mid-Back',
    artist: 'Julian Mugisha',
    salon: 'Crown & Braids Hair Lounge - Bukoto',
    tags: ['Locs Retwist', 'Organic Beeswax', 'Barrel Roll', 'Men & Women'],
  },
  {
    id: 'hair_passion_twists',
    title: 'Bohemian Goddess Passion Twists with Curly Tendrils',
    image: '/src/assets/images/hair_passion_twist_curls_1791279494928.jpg',
    description: 'Textured, springy water-wave passion twists interwoven with wispy bohemian curly tendrils for an effortless luxury look.',
    priceUgx: 110000,
    durationMinutes: 150,
    styleType: 'Passion Twists',
    hairLength: 'Mid-Back',
    artist: 'Julian Mugisha',
    salon: 'Crown & Braids Hair Lounge - Bukoto',
    tags: ['Passion Twists', 'Boho Tendrils', 'Lightweight'],
  },
  {
    id: 'hair_silk_press_steam',
    title: 'Kampala Red-Carpet Silk Press & Scalp Steam Detox',
    image: '/src/assets/images/beauty_hairstylist_session_1791273776048.jpg',
    description: 'Ultrasonic deep conditioning moisture steam lock, rosemary & peptide clarifying scalp massage, followed by a mirror-like high-gloss silk press.',
    priceUgx: 75000,
    durationMinutes: 75,
    styleType: 'Silk Press & Treatment',
    hairLength: 'Mid-Back',
    artist: 'Patricia Atim',
    salon: 'Pearl Glow Mobile Glam Bar - Bugolobi',
    tags: ['Silk Press', 'Scalp Detox', 'Heat Protect', 'Zero Damage'],
  },
  {
    id: 'hair_bridal_kwanjula',
    title: 'Ugandan Traditional Kwanjula & Wedding Bridal Updo',
    image: '/src/assets/images/uganda_kampala_glam_salon_1791276380347.jpg',
    description: 'Sculptural bridal updo tailored for Gomesi headpiece or bridal veil, complete with pearl hairpin integration and companion touch-up kit.',
    priceUgx: 220000,
    durationMinutes: 180,
    styleType: 'Bridal Updo',
    hairLength: 'Shoulder Length',
    artist: 'Patricia Atim',
    salon: 'Pearl Glow Mobile Glam Bar - Bugolobi',
    tags: ['Kwanjula Hair', 'Bridal Glam', 'VIP Package'],
  },
];
