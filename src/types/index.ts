export interface ServiceItem {
  id: string;
  name: string;
  category: 'nail_salon' | 'beauty_stylist' | 'hair_salon' | 'spa_wellness' | 'mobile_stylist';
  description: string;
  durationMinutes: number;
  price: number;
}

export interface Provider {
  _id: string;
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

export interface Booking {
  _id: string;
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
  createdAt: string;
}

export interface Review {
  _id: string;
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceName: string;
  verifiedBooking: boolean;
  createdAt: string;
}

export interface LoyaltyReward {
  _id: string;
  title: string;
  pointsRequired: number;
  discountValue: string;
  description: string;
  category: string;
  code: string;
}

export interface LoyaltyStatus {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Luxe';
  nextTier: string | null;
  pointsToNextTier: number;
  tierList: Array<{
    name: string;
    minPoints: number;
    perk: string;
  }>;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'tracking' | 'payment' | 'loyalty' | 'system';
  read: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  phone: string;
  avatar: string;
  loyaltyPoints: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Luxe';
  location?: { lat: number; lng: number; address: string };
}
