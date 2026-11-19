import {
  Provider,
  Booking,
  Review,
  LoyaltyStatus,
  LoyaltyReward,
  NotificationItem,
  User,
  TrafficAnalyticsData,
} from '../types/index.ts';

const TOKEN_KEY = 'glamtrack_jwt_token';
const USER_KEY = 'glamtrack_current_user';
const LOCAL_USERS_KEY = 'banda_local_users_v1';
const LOCAL_VISITS_KEY = 'banda_local_visits_v1';
const VISITOR_ID_KEY = 'banda_visitor_id';

interface LocalUserRecord extends User {
  password: string;
}

interface LocalVisitRecord {
  visitorId: string;
  userName?: string;
  userRole?: string;
  deviceType: 'mobile' | 'desktop';
  tab: string;
  createdAt: string;
  updatedAt: string;
}

class NetworkUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkUnavailableError';
  }
}

const DEFAULT_DEMO_ACCOUNTS: LocalUserRecord[] = [
  {
    _id: 'usr_admin_derick',
    name: 'Mabirizi Derick',
    email: 'admin@glamtrack.ug',
    password: 'AdminPass123!',
    role: 'admin',
    phone: '+256 701 234 567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: { lat: 0.3476, lng: 32.5825, address: 'Kololo, Kampala, Uganda' },
    loyaltyPoints: 10000,
    loyaltyTier: 'VIP Luxe',
  },
  {
    _id: 'usr_claire_valmont',
    name: 'Amina Namubiru',
    email: 'claire.valmont@example.com',
    password: 'GlamPass123!',
    role: 'customer',
    phone: '+256 772 392 881',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: { lat: 0.3345, lng: 32.5892, address: 'Plot 14 Acacia Avenue, Kololo, Kampala' },
    loyaltyPoints: 1450,
    loyaltyTier: 'Gold',
  },
  {
    _id: 'usr_camille_provider',
    name: 'Camille Nabatanzi',
    email: 'camille.nailstudio@example.com',
    password: 'StylistPass123!',
    role: 'provider',
    phone: '+256 752 782 990',
    avatar: '/src/assets/images/uganda_nail_art_paints_1791276351476.jpg',
    location: { lat: 0.3345, lng: 32.5892, address: 'Plot 14 Acacia Avenue, Kololo' },
    loyaltyPoints: 3200,
    loyaltyTier: 'VIP Luxe',
  },
];

const TAB_LABELS: Record<string, string> = {
  explore: 'Home & Salons',
  nail_art: 'Nail Art Studio',
  hair_gallery: 'Hair & Braids',
  gps: 'Live GPS Tracker',
  loyalty: 'Privilege Club',
  reviews: 'Client Reviews',
  provider: 'Stylist Mode',
  admin: 'Admin Portal',
};

export class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setAuth(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getSavedUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getVisitorId(): string {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = 'vis_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  }

  private getLocalUsers(): LocalUserRecord[] {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      const parsed: LocalUserRecord[] = raw ? JSON.parse(raw) : [];
      const byEmail = new Map<string, LocalUserRecord>();
      for (const acc of DEFAULT_DEMO_ACCOUNTS) byEmail.set(acc.email.toLowerCase(), acc);
      for (const acc of parsed) {
        if (acc?.email) byEmail.set(acc.email.toLowerCase(), acc);
      }
      return Array.from(byEmail.values());
    } catch {
      return DEFAULT_DEMO_ACCOUNTS;
    }
  }

  private saveLocalUser(record: LocalUserRecord) {
    const users = this.getLocalUsers().filter(
      (u) => u.email.toLowerCase() !== record.email.toLowerCase()
    );
    users.push(record);
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch {
      // ignore storage quota
    }
  }

  private toPublicUser(record: LocalUserRecord): User {
    const { password: _pw, ...user } = record;
    return user;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch {
      throw new NetworkUnavailableError('Unable to reach server');
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new NetworkUnavailableError(`Non-JSON response (${response.status})`);
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      throw new Error(err.error || `Request failed (${response.status})`);
    }
    return response.json();
  }

  // Auth Endpoints (with seamless fallback when backend is unreachable or static preview is active)
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const data = await this.fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      this.saveLocalUser({ ...data.user, password });
      this.setAuth(data.token, data.user);
      return data;
    } catch (err) {
      if (!(err instanceof NetworkUnavailableError)) {
        throw err;
      }
      const match = this.getLocalUsers().find((u) => u.email.toLowerCase() === cleanEmail);
      if (!match || match.password !== password) {
        throw new Error('Invalid email or password');
      }
      const user = this.toPublicUser(match);
      const token = 'local_' + btoa(unescape(encodeURIComponent(user._id + ':' + Date.now())));
      this.setAuth(token, user);
      return { token, user };
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: string = 'customer',
    phone: string = ''
  ): Promise<{ token: string; user: User }> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const data = await this.fetchWithAuth('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email: cleanEmail, password, role, phone }),
      });
      this.saveLocalUser({ ...data.user, password });
      this.setAuth(data.token, data.user);
      return data;
    } catch (err) {
      if (!(err instanceof NetworkUnavailableError)) {
        throw err;
      }
      const existing = this.getLocalUsers().find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        throw new Error('An account with this email already exists');
      }
      const newRecord: LocalUserRecord = {
        _id: 'usr_' + Date.now().toString(36),
        name: name.trim(),
        email: cleanEmail,
        password,
        role: role === 'provider' ? 'provider' : 'customer',
        phone: phone.trim(),
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(name.trim()),
        loyaltyPoints: 100,
        loyaltyTier: 'Bronze',
        location: { lat: 0.3476, lng: 32.5825, address: 'Kampala, Uganda' },
      };
      this.saveLocalUser(newRecord);
      const user = this.toPublicUser(newRecord);
      const token = 'local_' + btoa(unescape(encodeURIComponent(user._id + ':' + Date.now())));
      this.setAuth(token, user);
      return { token, user };
    }
  }

  async demoLogin(role: 'customer' | 'provider' | 'admin' = 'customer'): Promise<{ token: string; user: User }> {
    try {
      const data = await this.fetchWithAuth('/api/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      this.setAuth(data.token, data.user);
      return data;
    } catch (err) {
      if (!(err instanceof NetworkUnavailableError)) {
        throw err;
      }
      const targetEmail =
        role === 'admin'
          ? 'admin@glamtrack.ug'
          : role === 'provider'
          ? 'camille.nailstudio@example.com'
          : 'claire.valmont@example.com';
      const match =
        this.getLocalUsers().find((u) => u.email.toLowerCase() === targetEmail) ||
        DEFAULT_DEMO_ACCOUNTS[1];
      const user = this.toPublicUser(match);
      const token = 'local_' + btoa(unescape(encodeURIComponent(user._id + ':' + Date.now())));
      this.setAuth(token, user);
      return { token, user };
    }
  }

  async getProfile(): Promise<User> {
    const data = await this.fetchWithAuth('/api/auth/me');
    return data.user;
  }

  // Analytics & Site Traffic Tracking (Hourly / Daily / Weekly / Monthly)
  private saveLocalVisit(visit: LocalVisitRecord) {
    try {
      const raw = localStorage.getItem(LOCAL_VISITS_KEY);
      const list: LocalVisitRecord[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const idx = list.findIndex(
        (v) =>
          v.visitorId === visit.visitorId &&
          v.tab === visit.tab &&
          now - new Date(v.updatedAt || v.createdAt).getTime() < 25000
      );
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...visit, updatedAt: new Date().toISOString() };
      } else {
        list.push(visit);
      }
      localStorage.setItem(LOCAL_VISITS_KEY, JSON.stringify(list.slice(-3000)));
    } catch {
      // ignore
    }
  }

  private computeLocalTrafficAnalytics(): TrafficAnalyticsData {
    let list: LocalVisitRecord[] = [];
    try {
      const raw = localStorage.getItem(LOCAL_VISITS_KEY);
      list = raw ? JSON.parse(raw) : [];
    } catch {
      list = [];
    }

    const nowInput = new Date();
    const now = nowInput.getTime();
    const fiveMinsAgo = now - 5 * 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;
    const todayStart = new Date(nowInput.getFullYear(), nowInput.getMonth(), nowInput.getDate()).getTime();
    const weekStart = now - 7 * 24 * 60 * 60 * 1000;
    const monthStart = now - 30 * 24 * 60 * 60 * 1000;

    const rangeStats = (minTs: number, maxTs: number = Infinity) => {
      const filtered = list.filter((v) => {
        const ts = new Date(v.updatedAt || v.createdAt).getTime();
        return ts >= minTs && ts < maxTs;
      });
      return {
        uniqueVisitors: new Set(filtered.map((v) => v.visitorId)).size,
        totalVisits: filtered.length,
        mobileCount: filtered.filter((v) => v.deviceType === 'mobile').length,
        desktopCount: filtered.filter((v) => v.deviceType === 'desktop').length,
      };
    };

    const currentHourStart = new Date(nowInput);
    currentHourStart.setMinutes(0, 0, 0);
    const hourly = Array.from({ length: 24 }, (_, idx) => {
      const i = 23 - idx;
      const start = new Date(currentHourStart.getTime() - i * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const hh = String(start.getHours()).padStart(2, '0') + ':00';
      return {
        key: start.toISOString(),
        label: i === 0 ? `Now (${hh})` : hh,
        ...rangeStats(start.getTime(), end.getTime()),
      };
    });

    const currentDayStart = new Date(todayStart);
    const daily = Array.from({ length: 14 }, (_, idx) => {
      const i = 13 - idx;
      const start = new Date(currentDayStart.getTime() - i * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const label =
        i === 0
          ? 'Today'
          : i === 1
          ? 'Yesterday'
          : start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        key: start.toISOString(),
        label,
        ...rangeStats(start.getTime(), end.getTime()),
      };
    });

    const day = currentDayStart.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const currentWeekStart = new Date(currentDayStart);
    currentWeekStart.setDate(currentWeekStart.getDate() + diff);
    const weekly = Array.from({ length: 8 }, (_, idx) => {
      const i = 7 - idx;
      const start = new Date(currentWeekStart.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const label =
        i === 0
          ? 'This Week'
          : i === 1
          ? 'Last Week'
          : `Wk ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      return {
        key: start.toISOString(),
        label,
        ...rangeStats(start.getTime(), end.getTime()),
      };
    });

    const currentMonthStart = new Date(nowInput.getFullYear(), nowInput.getMonth(), 1);
    const monthly = Array.from({ length: 12 }, (_, idx) => {
      const i = 11 - idx;
      const start = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - i, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      return {
        key: start.toISOString(),
        label: start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        ...rangeStats(start.getTime(), end.getTime()),
      };
    });

    const sectionCounts: Record<string, number> = {};
    for (const v of list) {
      sectionCounts[v.tab] = (sectionCounts[v.tab] || 0) + 1;
    }
    const topSections = Object.entries(sectionCounts)
      .map(([tab, count]) => ({ tab, label: TAB_LABELS[tab] || tab, count }))
      .sort((a, b) => b.count - a.count);

    const visitorMap = new Map<string, any>();
    for (const v of [...list].reverse()) {
      const existing = visitorMap.get(v.visitorId);
      if (!existing) {
        visitorMap.set(v.visitorId, {
          visitorId: v.visitorId,
          userName: v.userName || 'Kampala Guest',
          userRole: v.userRole || 'guest',
          deviceType: v.deviceType,
          tab: v.tab,
          tabLabel: TAB_LABELS[v.tab] || v.tab,
          lastSeenAt: v.updatedAt || v.createdAt,
          totalActions: 1,
        });
      } else {
        existing.totalActions += 1;
      }
    }

    return {
      summary: {
        activeNow: rangeStats(fiveMinsAgo).uniqueVisitors,
        currentHour: rangeStats(oneHourAgo),
        today: rangeStats(todayStart),
        thisWeek: rangeStats(weekStart),
        thisMonth: rangeStats(monthStart),
        allTime: rangeStats(0),
      },
      hourly,
      daily,
      weekly,
      monthly,
      topSections,
      recentVisitors: Array.from(visitorMap.values()).slice(0, 20),
      generatedAt: nowInput.toISOString(),
    };
  }

  async recordVisit(tab: string, user?: User | null): Promise<void> {
    const visitorId = this.getVisitorId();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const deviceType: 'mobile' | 'desktop' = isMobile ? 'mobile' : 'desktop';
    const nowIso = new Date().toISOString();

    this.saveLocalVisit({
      visitorId,
      userName: user?.name,
      userRole: user?.role,
      deviceType,
      tab,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    try {
      await this.fetchWithAuth('/api/analytics/visit', {
        method: 'POST',
        body: JSON.stringify({
          visitorId,
          tab,
          deviceType,
          userId: user?._id,
          userName: user?.name,
          userRole: user?.role,
        }),
      });
    } catch {
      // Non-fatal: local visit recorded
    }
  }

  async getTrafficAnalytics(): Promise<TrafficAnalyticsData> {
    try {
      return await this.fetchWithAuth('/api/analytics/traffic');
    } catch {
      return this.computeLocalTrafficAnalytics();
    }
  }

  // Provider Endpoints
  async getProviders(category?: string, onDemandOnly?: boolean, search?: string): Promise<Provider[]> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (onDemandOnly) params.set('onDemandOnly', 'true');
    if (search) params.set('search', search);

    const data = await this.fetchWithAuth(`/api/providers?${params.toString()}`);
    return data.providers;
  }

  async getProviderById(id: string): Promise<{ provider: Provider; reviews: Review[] }> {
    return this.fetchWithAuth(`/api/providers/${id}`);
  }

  async addProvider(providerData: Partial<Provider>): Promise<{ provider: Provider; message: string }> {
    return this.fetchWithAuth('/api/providers', {
      method: 'POST',
      body: JSON.stringify(providerData),
    });
  }

  async updateProvider(id: string, providerData: Partial<Provider>): Promise<{ provider: Provider; message: string }> {
    return this.fetchWithAuth(`/api/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(providerData),
    });
  }

  async deleteProvider(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/providers/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings & Real-Time GPS Tracking
  async createBooking(payload: {
    providerId: string;
    services: any[];
    bookingType: 'on_demand' | 'scheduled';
    scheduledTime?: string;
    address: string;
    customerCoords?: { lat: number; lng: number };
    specialNotes?: string;
    paymentMethod?: string;
    customerName?: string;
    customerPhone?: string;
  }): Promise<{ booking: Booking; pointsEarned: number }> {
    return this.fetchWithAuth('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getBookings(): Promise<Booking[]> {
    const data = await this.fetchWithAuth('/api/bookings');
    return data.bookings;
  }

  async getBooking(id: string): Promise<Booking> {
    const data = await this.fetchWithAuth(`/api/bookings/${id}`);
    return data.booking;
  }

  async updateBookingStatus(
    id: string,
    status: string,
    providerCoords?: { lat: number; lng: number },
    etaMinutes?: number
  ): Promise<Booking> {
    const data = await this.fetchWithAuth(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, providerCoords, etaMinutes }),
    });
    return data.booking;
  }

  // Payments
  async processPayment(payload: {
    amount: number;
    paymentMethod: string;
    cardLast4?: string;
    bookingId?: string;
    tipAmount?: number;
    loyaltyCode?: string;
  }): Promise<{ success: boolean; receipt: any }> {
    return this.fetchWithAuth('/api/payments/process', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Reviews
  async getReviews(providerId?: string): Promise<Review[]> {
    const url = providerId ? `/api/reviews?providerId=${providerId}` : '/api/reviews';
    const data = await this.fetchWithAuth(url);
    return data.reviews;
  }

  async postReview(providerId: string, rating: number, comment: string, serviceName: string): Promise<Review> {
    const data = await this.fetchWithAuth('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ providerId, rating, comment, serviceName }),
    });
    return data.review;
  }

  // Loyalty Rewards
  async getLoyaltyStatus(): Promise<{ loyalty: LoyaltyStatus; rewards: LoyaltyReward[] }> {
    return this.fetchWithAuth('/api/loyalty/status');
  }

  async redeemReward(
    rewardId: string
  ): Promise<{ success: boolean; remainingPoints: number; couponCode: string; rewardTitle: string }> {
    return this.fetchWithAuth('/api/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId }),
    });
  }

  // Push Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const data = await this.fetchWithAuth('/api/notifications');
    return data.notifications;
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.fetchWithAuth(`/api/notifications/${id}/read`, { method: 'PATCH' });
  }

  async triggerNotificationSimulation(
    title: string,
    body: string,
    type: string = 'tracking'
  ): Promise<NotificationItem> {
    const data = await this.fetchWithAuth('/api/notifications/simulate', {
      method: 'POST',
      body: JSON.stringify({ title, body, type }),
    });
    return data.notification;
  }
}

export const api = new ApiClient();

