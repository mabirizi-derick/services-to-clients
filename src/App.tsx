import React, { useState, useEffect } from 'react';
import { Provider, Booking, Review, LoyaltyStatus, LoyaltyReward, NotificationItem, User, ServiceItem } from './types/index.ts';
import { NAIL_ART_GALLERY, NailArtItem } from './data/nailArtGallery.ts';
import { HAIR_GALLERY, HairStyleItem } from './data/hairGallery.ts';
import { INITIAL_SERVICE_PROVIDERS } from './data/serviceProviders.ts';
import { api } from './api/client.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CategoryExplorer } from './components/CategoryExplorer.tsx';
import { HowItWorksSection } from './components/HowItWorksSection.tsx';
import { NailArtSection } from './components/NailArtSection.tsx';
import { HairGallerySection } from './components/HairGallerySection.tsx';
import { ProviderGrid } from './components/ProviderGrid.tsx';
import { ProviderDetailModal } from './components/ProviderDetailModal.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { LiveGpsTracker } from './components/LiveGpsTracker.tsx';
import { BookingPaymentModal } from './components/BookingPaymentModal.tsx';
import { LoyaltyHub } from './components/LoyaltyHub.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { PricingGuideSection } from './components/PricingGuideSection.tsx';
import { StylistRecruitmentBanner } from './components/StylistRecruitmentBanner.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { DeveloperAndSupportSection } from './components/DeveloperAndSupportSection.tsx';
import { Footer } from './components/Footer.tsx';
import { NotificationsDrawer } from './components/NotificationsDrawer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ProviderDashboard } from './components/ProviderDashboard.tsx';
import { MobileAppFrame } from './components/MobileAppFrame.tsx';
import { ProviderRingAlertModal } from './components/ProviderRingAlertModal.tsx';
import { ClientBookingFeedbackModal } from './components/ClientBookingFeedbackModal.tsx';
import { ringAlertAudio } from './utils/ringAlertAudio.ts';
import { CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'explore' | 'nail_art' | 'hair_gallery' | 'gps' | 'loyalty' | 'reviews' | 'admin' | 'provider'>('explore');
  const [isMobileView, setIsMobileView] = useState(false);

  // Data States
  const [providers, setProviders] = useState<Provider[]>(INITIAL_SERVICE_PROVIDERS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loyaltyStatus, setLoyaltyStatus] = useState<LoyaltyStatus>({
    points: 1450,
    tier: 'Gold',
    nextTier: 'VIP Luxe',
    pointsToNextTier: 1050,
    tierList: [
      { name: 'Bronze', minPoints: 0, perk: '5% bonus points on Monday bookings' },
      { name: 'Silver', minPoints: 400, perk: 'Priority Kampala dispatch & complimentary beverage' },
      { name: 'Gold', minPoints: 1000, perk: 'Complimentary Shea butter treatment & 10% off add-ons' },
      { name: 'VIP Luxe', minPoints: 2500, perk: 'Dedicated VIP concierge & zero cancellation fees' },
    ],
  });
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Filters
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Modals & Drawers
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<Provider | null>(null);
  const [preSelectedService, setPreSelectedService] = useState<ServiceItem | undefined>(undefined);
  const [selectedProviderForDetail, setSelectedProviderForDetail] = useState<Provider | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [ringingBooking, setRingingBooking] = useState<Booking | null>(null);
  const [feedbackBooking, setFeedbackBooking] = useState<Booking | null>(null);
  const [activeProviderProfile, setActiveProviderProfile] = useState<Provider | null>(null);

  // In-App Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'reward' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'reward' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Initial Data from Backend
  useEffect(() => {
    async function loadData() {
      try {
        const saved = api.getSavedUser();
        if (saved) {
          setUser(saved);
        } else {
          try {
            const demo = await api.demoLogin('customer');
            setUser(demo.user);
          } catch {
            // fallback
          }
        }

        const [pList, bList, rList, lData, nList] = await Promise.all([
          api.getProviders().catch(() => []),
          api.getBookings().catch(() => []),
          api.getReviews().catch(() => []),
          api.getLoyaltyStatus().catch(() => null),
          api.getNotifications().catch(() => []),
        ]);

        if (pList && pList.length >= 9) {
          setProviders(pList);
        } else if (pList && pList.length > 0) {
          // Merge fetched with INITIAL_SERVICE_PROVIDERS to ensure all 9 are available
          const existingIds = new Set(pList.map((p) => p._id));
          const missing = INITIAL_SERVICE_PROVIDERS.filter((p) => !existingIds.has(p._id));
          setProviders([...pList, ...missing]);
        } else {
          setProviders(INITIAL_SERVICE_PROVIDERS);
        }
        if (bList && bList.length > 0) {
          setBookings(bList);
          setActiveBooking(bList[0]);
        }
        if (rList && rList.length > 0) setReviews(rList);
        if (lData) {
          setLoyaltyStatus(lData.loyalty);
          setRewards(lData.rewards);
        }
        if (nList) setNotifications(nList);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    loadData();
  }, []);

  // Track active people & page views (hourly / daily / weekly / monthly analytics)
  useEffect(() => {
    api.recordVisit(activeTab, user);
    const heartbeat = setInterval(() => {
      api.recordVisit(activeTab, user);
    }, 60000);
    return () => clearInterval(heartbeat);
  }, [activeTab, user?._id]);

  // Filter providers
  const filteredProviders = providers.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  // Handle Search from Hero
  const handleHeroSearch = async (query: string, category: string, onDemandOnly: boolean) => {
    try {
      const results = await api.getProviders(category, onDemandOnly, query);
      setProviders(results);
      if (category !== 'all') setActiveFilter(category);
      showToast(`Found ${results.length} available Kampala beauty specialists`);
    } catch {
      // ignore
    }
  };

  // Handle Client Selecting Provider to View Full Profile & Services
  const handleSelectProviderForDetail = (provider: Provider) => {
    setSelectedProviderForDetail(provider);
  };

  // Handle Book Service Click
  const handleStartBooking = (provider: Provider, service?: ServiceItem) => {
    setSelectedProviderForBooking(provider);
    setPreSelectedService(service);
    setIsBookingModalOpen(true);
  };

  // Handle Booking from Nail Art Lookbook
  const handleSelectNailLook = (item: NailArtItem, provider: Provider) => {
    const customService: ServiceItem = {
      id: 'srv_nail_' + item.id,
      name: item.title,
      category: 'nail_salon',
      description: item.description,
      durationMinutes: item.durationMinutes,
      price: item.priceUgx,
    };
    setSelectedProviderForBooking(provider);
    setPreSelectedService(customService);
    setIsBookingModalOpen(true);
  };

  // Handle Booking from African Hairmaking Gallery
  const handleSelectHairStyle = (item: HairStyleItem, provider: Provider) => {
    const customService: ServiceItem = {
      id: 'srv_hair_' + item.id,
      name: item.title,
      category: 'beauty_stylist',
      description: item.description,
      durationMinutes: item.durationMinutes,
      price: item.priceUgx,
    };
    setSelectedProviderForBooking(provider);
    setPreSelectedService(customService);
    setIsBookingModalOpen(true);
  };

  // Admin Handler: Provider Added
  const handleProviderAdded = (newProvider: Provider) => {
    setProviders((prev) => [newProvider, ...prev]);
    showToast(`Salon "${newProvider.businessName}" added to Kampala network!`, 'success');
  };

  // Admin Handler: Provider Deleted
  const handleProviderDeleted = (providerId: string) => {
    setProviders((prev) => prev.filter((p) => p._id !== providerId));
    showToast('Provider removed from network', 'info');
  };

  // Handle Booking Success - Trigger Provider Ring Alert!
  const handleBookingSuccess = (newBooking: Booking, pointsEarned: number) => {
    // Ensure booking starts in pending status to ring the provider
    const pendingBooking: Booking = {
      ...newBooking,
      status: 'pending',
    };

    setBookings((prev) => [pendingBooking, ...prev]);
    setActiveBooking(pendingBooking);

    if (user) {
      const updatedUser = {
        ...user,
        loyaltyPoints: (user.loyaltyPoints || 0) + pointsEarned,
      };
      setUser(updatedUser);
      api.setAuth(localStorage.getItem('glamtrack_jwt_token') || '', updatedUser);
    }

    const newNotif: NotificationItem = {
      _id: 'notif_' + Date.now(),
      userId: user?._id || 'usr_claire_valmont',
      title: 'Dispatch Sent to Stylist 🔔',
      body: `Incoming ring alert sent to ${newBooking.providerName}. Awaiting provider acceptance...`,
      type: 'tracking',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Booking request dispatched! Incoming audio ring alert sent to ${newBooking.providerName}.`, 'info');

    // Trigger ring alert modal and audio for the provider
    setRingingBooking(pendingBooking);
  };

  // Provider responds "Available (Accept)" - stops ring alert and provides feedback to client
  const handleProviderAvailable = async (booking: Booking) => {
    ringAlertAudio.stopRing();
    setRingingBooking(null);
    try {
      const updated = await api.updateBookingStatus(booking._id, 'accepted');
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? updated : b)));
      setActiveBooking(updated);
      // Give feedback to client
      setFeedbackBooking(updated);
      showToast(`${booking.providerName} is AVAILABLE! Booking confirmed.`, 'success');
    } catch {
      const fallback = { ...booking, status: 'accepted' as const };
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? fallback : b)));
      setActiveBooking(fallback);
      setFeedbackBooking(fallback);
    }
  };

  // Provider responds "Not Available (Decline)" - stops ring alert and provides feedback to client
  const handleProviderNotAvailable = async (booking: Booking) => {
    ringAlertAudio.stopRing();
    setRingingBooking(null);
    try {
      const updated = await api.updateBookingStatus(booking._id, 'declined');
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? updated : b)));
      if (activeBooking?._id === booking._id) {
        setActiveBooking(updated);
      }
      // Give feedback to client
      setFeedbackBooking(updated);
      showToast(`${booking.providerName} is currently NOT AVAILABLE.`, 'info');
    } catch {
      const fallback = { ...booking, status: 'declined' as const };
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? fallback : b)));
      setFeedbackBooking(fallback);
    }
  };

  // Handle Provider Status Updates
  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    // When status changes to accepted or declined, stop ring alert
    if (status === 'accepted' || status === 'declined') {
      ringAlertAudio.stopRing();
      setRingingBooking(null);
    }

    try {
      const updated = await api.updateBookingStatus(bookingId, status);
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? updated : b)));
      if (activeBooking?._id === bookingId) {
        setActiveBooking(updated);
      }

      // If user accepted/declined, also update client feedback modal
      if (status === 'accepted' || status === 'declined') {
        setFeedbackBooking(updated);
      }

      showToast(`Status updated to: ${status === 'accepted' ? 'Accepted (Available)' : status === 'declined' ? 'Declined (Not Available)' : status}`);
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: status as any } : b))
      );
    }
  };

  // Handle Reward Redemption
  const handleRewardRedeemed = (remainingPoints: number, code: string, title: string) => {
    if (user) {
      const updatedUser = { ...user, loyaltyPoints: remainingPoints };
      setUser(updatedUser);
      api.setAuth(localStorage.getItem('glamtrack_jwt_token') || '', updatedUser);
    }
    showToast(`Unlocked "${title}"! Code "${code}" copied to clipboard.`, 'reward');
  };

  // Handle Review Added
  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    if (user) {
      const updatedUser = { ...user, loyaltyPoints: (user.loyaltyPoints || 0) + 50 };
      setUser(updatedUser);
    }
    showToast('Verified review published! +50 bonus loyalty points earned.', 'reward');
  };

  // Main Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'explore':
        // FULLY DETAILED, COMPREHENSIVE HOMEPAGE: Everything starts here!
        return (
          <div className="space-y-4">
            {/* 1. Hero with instant search */}
            <HeroSection
              onSearch={handleHeroSearch}
              onExploreClick={() => setActiveFilter('all')}
            />

            {/* 2. Comprehensive Category Explorer with 9 Service Providers */}
            <CategoryExplorer
              providers={providers}
              onSelectProvider={handleSelectProviderForDetail}
              onBookService={handleStartBooking}
              onSelectCategory={(cat) => {
                setActiveFilter(cat);
                const el = document.getElementById('salons-directory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreNailArt={() => {
                const el = document.getElementById('nail-art-studio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('nail_art');
              }}
              onExploreHair={() => {
                const el = document.getElementById('hair-braids-lounge');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('hair_gallery');
              }}
            />

            {/* 3. Dedicated Nail Art Studio Lookbook (Independent cards from uploaded album) */}
            <NailArtSection
              providers={providers}
              onSelectNailLook={handleSelectNailLook}
            />

            {/* 4. Dedicated African Hairmaking & Braiding Lounge (Independent album of African hair designs) */}
            <HairGallerySection
              providers={providers}
              onSelectHairStyle={handleSelectHairStyle}
            />

            {/* 5. Verified Kampala Salons & Stylists Directory */}
            <div id="salons-directory">
              <ProviderGrid
                providers={filteredProviders}
                onSelectProvider={handleSelectProviderForDetail}
                onBookService={handleStartBooking}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>

            {/* 6. Embedded Live GPS Satellite Map Section */}
            <div className="bg-stone-900/85 backdrop-blur-md py-8 sm:py-12 rounded-2xl sm:rounded-3xl my-6 sm:my-8 mx-3 sm:mx-6 lg:mx-8 border border-stone-800 shadow-2xl overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">
                  Interactive Geolocation Engine
                </div>
                <h3 className="text-xl sm:text-3xl font-serif font-bold text-white">
                  Live Satellite GPS Dispatch in Action
                </h3>
                <p className="text-xs text-stone-300">
                  Real-time route tracking between Bukoto, Kololo, Lugogo Bypass and Nakasero
                </p>
              </div>
              <LiveGpsTracker
                activeBooking={activeBooking}
                providers={providers}
                onSelectBooking={(b) => setActiveBooking(b)}
                onNewBookingClick={() => {
                  if (providers.length > 0) handleStartBooking(providers[0]);
                }}
                onNotify={(title, body) => {
                  showToast(title, 'info');
                }}
              />
            </div>

            {/* 7. Privilege Club & Loyalty Rewards */}
            <LoyaltyHub
              loyaltyStatus={loyaltyStatus}
              rewards={rewards}
              user={user}
              onRewardRedeemed={handleRewardRedeemed}
              onBookNowClick={() => setActiveTab('explore')}
            />

            {/* 8. Client Testimonials & Verified Reviews from Kampala */}
            <ReviewsSection
              reviews={reviews}
              providers={providers}
              user={user}
              onReviewAdded={handleReviewAdded}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />

            {/* 9. Transparent Pricing Guide */}
            <PricingGuideSection />

            {/* 10. Stylist & Salon Onboarding Banner */}
            <StylistRecruitmentBanner
              onJoinAsProvider={() => setActiveTab('admin')}
            />

            {/* 11. Frequently Asked Questions */}
            <FaqSection />

            {/* 12. How Platform Works in Uganda (Seamless On-Demand Beauty Dispatch - towards end before about section) */}
            <HowItWorksSection />
          </div>
        );

      case 'nail_art':
        // Dedicated Nail Art Page
        return (
          <NailArtSection
            providers={providers}
            onSelectNailLook={handleSelectNailLook}
          />
        );

      case 'hair_gallery':
        // Dedicated Hair & Braids Page
        return (
          <HairGallerySection
            providers={providers}
            onSelectHairStyle={handleSelectHairStyle}
          />
        );

      case 'gps':
        // Dedicated Live GPS Satellite Tracker View
        return (
          <LiveGpsTracker
            activeBooking={activeBooking}
            providers={providers}
            onSelectBooking={(b) => setActiveBooking(b)}
            onNewBookingClick={() => {
              if (providers.length > 0) handleStartBooking(providers[0]);
            }}
            onNotify={(title, body) => {
              showToast(title, 'info');
              const item: NotificationItem = {
                _id: 'notif_' + Date.now(),
                userId: user?._id || 'demo',
                title,
                body,
                type: 'tracking',
                read: false,
                createdAt: new Date().toISOString(),
              };
              setNotifications((prev) => [item, ...prev]);
            }}
          />
        );

      case 'loyalty':
        return (
          <LoyaltyHub
            loyaltyStatus={loyaltyStatus}
            rewards={rewards}
            user={user}
            onRewardRedeemed={handleRewardRedeemed}
            onBookNowClick={() => setActiveTab('explore')}
          />
        );

      case 'reviews':
        return (
          <ReviewsSection
            reviews={reviews}
            providers={providers}
            user={user}
            onReviewAdded={handleReviewAdded}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        );

      case 'admin':
        return (
          <AdminPortal
            providers={providers}
            bookings={bookings}
            onProviderAdded={handleProviderAdded}
            onProviderDeleted={handleProviderDeleted}
            onProviderUpdated={(updated) => {
              setProviders((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
              showToast('Provider profile updated');
            }}
            onSelectProvider={handleSelectProviderForDetail}
          />
        );

      case 'provider':
        return (
          <ProviderDashboard
            provider={activeProviderProfile || providers[0] || ({} as Provider)}
            allProviders={providers}
            onSelectProviderProfile={(p) => setActiveProviderProfile(p)}
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onToggleAvailability={(avail) => showToast(avail ? 'Online on GPS' : 'Offline')}
            onTriggerRingAlert={(b) => setRingingBooking(b)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen text-stone-100 bg-stone-950 flex flex-col font-sans relative selection:bg-amber-400 selection:text-stone-950 ${!isMobileView ? 'pb-16 lg:pb-0' : ''}`}>
      
      {/* Whole Document / Website Fixed Luxury Salon Image Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/uganda_kampala_glam_salon_1791276380347.jpg"
          alt="Banda Services Kampala salon background"
          className="w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.10] saturate-[1.12]"
        />
        {/* Luxury multi-layer scrim with warm amber salon ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/85 to-stone-950/92 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(217,119,6,0.08),transparent_50%)]" />
      </div>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 left-3 right-3 sm:left-auto sm:right-4 z-50 sm:max-w-sm bg-stone-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-3 animate-fade-in">
          {toast.type === 'reward' ? (
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-medium leading-snug">{toast.message}</span>
        </div>
      )}

      {/* View Mode Router: Desktop Website vs Mobile App Simulator */}
      {isMobileView ? (
        <MobileAppFrame
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
          notifications={notifications}
          onExitMobileView={() => setIsMobileView(false)}
        >
          {renderTabContent()}
          <DeveloperAndSupportSection
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenLiveGps={() => setActiveTab('gps')}
          />
          <Footer
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        </MobileAppFrame>
      ) : (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
            notifications={notifications}
            isMobileView={isMobileView}
            setIsMobileView={setIsMobileView}
          />

          <main className="flex-1">
            {renderTabContent()}
          </main>

          {/* Dedicated Developer Showcase & 24/7 Kampala Customer Support Section */}
          <DeveloperAndSupportSection
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenLiveGps={() => setActiveTab('gps')}
          />

          {/* Fully Detailed Footer with Developer Mabirizi Derick & Support Hotline */}
          <Footer
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        </>
      )}

      {/* Provider Details & Full Menu Modal (When Client Selects Provider) */}
      <ProviderDetailModal
        provider={selectedProviderForDetail}
        isOpen={Boolean(selectedProviderForDetail)}
        onClose={() => setSelectedProviderForDetail(null)}
        onBookService={(p, s) => {
          setSelectedProviderForDetail(null);
          handleStartBooking(p, s);
        }}
        reviews={reviews}
      />

      {/* Booking & Secure Payment Modal (UGX + Mobile Money) */}
      {selectedProviderForBooking && (
        <BookingPaymentModal
          provider={selectedProviderForBooking}
          preSelectedService={preSelectedService}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedProviderForBooking(null);
            setPreSelectedService(undefined);
          }}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Auth Profile / Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onAuthSuccess={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.name}!`);
        }}
        onLogout={() => {
          api.clearAuth();
          setUser(null);
          showToast('Signed out successfully');
        }}
      />

      {/* Push Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={async (id) => {
          await api.markNotificationRead(id);
          setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
          );
        }}
        onSimulatePush={(title, body, type) => {
          const newItem: NotificationItem = {
            _id: 'notif_' + Date.now(),
            userId: user?._id || 'usr_claire_valmont',
            title,
            body,
            type: (type as any) || 'tracking',
            read: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications((prev) => [newItem, ...prev]);
          showToast(title, 'info');
        }}
      />

      {/* Provider Ring Alert Modal: Plays audible ring sound with Available and Not Available buttons */}
      <ProviderRingAlertModal
        booking={ringingBooking}
        isOpen={Boolean(ringingBooking)}
        onAvailable={handleProviderAvailable}
        onNotAvailable={handleProviderNotAvailable}
      />

      {/* Client Feedback Modal: Feedback taken back to client on provider response */}
      <ClientBookingFeedbackModal
        booking={feedbackBooking}
        isOpen={Boolean(feedbackBooking)}
        onClose={() => setFeedbackBooking(null)}
        onTrackGps={() => {
          setFeedbackBooking(null);
          setActiveTab('gps');
        }}
        onChooseAlternativeProvider={() => {
          setFeedbackBooking(null);
          setActiveTab('explore');
        }}
      />

    </div>
  );
}
