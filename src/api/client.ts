import { Provider, Booking, Review, LoyaltyStatus, LoyaltyReward, NotificationItem, User } from '../types/index.ts';

const TOKEN_KEY = 'glamtrack_jwt_token';
const USER_KEY = 'glamtrack_current_user';

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

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Network request failed' }));
      throw new Error(err.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth Endpoints
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await this.fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setAuth(data.token, data.user);
    return data;
  }

  async register(name: string, email: string, password: string, role: string = 'customer', phone: string = ''): Promise<{ token: string; user: User }> {
    const data = await this.fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, phone }),
    });
    this.setAuth(data.token, data.user);
    return data;
  }

  async demoLogin(role: 'customer' | 'provider' | 'admin' = 'customer'): Promise<{ token: string; user: User }> {
    const data = await this.fetchWithAuth('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    this.setAuth(data.token, data.user);
    return data;
  }

  async getProfile(): Promise<User> {
    const data = await this.fetchWithAuth('/api/auth/me');
    return data.user;
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

  async updateBookingStatus(id: string, status: string, providerCoords?: { lat: number; lng: number }, etaMinutes?: number): Promise<Booking> {
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

  async redeemReward(rewardId: string): Promise<{ success: boolean; remainingPoints: number; couponCode: string; rewardTitle: string }> {
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

  async triggerNotificationSimulation(title: string, body: string, type: string = 'tracking'): Promise<NotificationItem> {
    const data = await this.fetchWithAuth('/api/notifications/simulate', {
      method: 'POST',
      body: JSON.stringify({ title, body, type }),
    });
    return data.notification;
  }
}

export const api = new ApiClient();
