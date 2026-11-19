import React, { useState, useEffect, useRef } from 'react';
import { Provider, Booking } from '../types/index.ts';
import { ringAlertAudio } from '../utils/ringAlertAudio.ts';
import {
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Phone,
  Check,
  X,
  Navigation,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ProviderDashboardProps {
  provider: Provider;
  allProviders?: Provider[];
  onSelectProviderProfile?: (p: Provider) => void;
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: string) => void;
  onToggleAvailability: (available: boolean) => void;
  onTriggerRingAlert?: (booking: Booking) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  provider,
  allProviders = [],
  onSelectProviderProfile,
  bookings,
  onUpdateStatus,
  onToggleAvailability,
  onTriggerRingAlert,
}) => {
  const [currentProvider, setCurrentProvider] = useState<Provider>(provider);
  const [isAvailable, setIsAvailable] = useState(provider.isOnDemandAvailable ?? true);
  const [isRinging, setIsRinging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Keep track of which booking requests have already been alerted or acted on
  const previousPendingIdsRef = useRef<Set<string>>(new Set());

  const handleToggle = () => {
    const next = !isAvailable;
    setIsAvailable(next);
    onToggleAvailability(next);
    if (!next && ringAlertAudio.isRinging()) {
      ringAlertAudio.stopRing();
      setIsRinging(false);
    }
  };

  const handleSwitchProvider = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = allProviders.find((prov) => prov._id === e.target.value);
    if (p) {
      setCurrentProvider(p);
      if (onSelectProviderProfile) onSelectProviderProfile(p);
    }
  };

  const activeProvider = allProviders.find((p) => p._id === currentProvider._id) || currentProvider;
  const providerBookings = bookings.filter((b) => b.providerId === activeProvider._id || true);
  const pendingBookings = providerBookings.filter((b) => b.status === 'pending');

  // Audible ring alert: When a new pending booking arrives and provider is available, ring!
  useEffect(() => {
    if (!isAvailable) {
      if (ringAlertAudio.isRinging()) {
        ringAlertAudio.stopRing();
        setIsRinging(false);
      }
      return;
    }

    const currentPendingIds = new Set(pendingBookings.map((b) => b._id));
    // Check if there are newly arrived pending requests that were not in previous set
    const hasNewPending = pendingBookings.some((b) => !previousPendingIdsRef.current.has(b._id));

    if (hasNewPending && pendingBookings.length > 0) {
      ringAlertAudio.startRing();
      setIsRinging(true);
    } else if (pendingBookings.length === 0 && ringAlertAudio.isRinging()) {
      ringAlertAudio.stopRing();
      setIsRinging(false);
    }

    previousPendingIdsRef.current = currentPendingIds;
  }, [pendingBookings, isAvailable]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      ringAlertAudio.stopRing();
    };
  }, []);

  // Explicit Accept action: Immediately stop the ring alert & update booking to accepted
  const handleAcceptBooking = (bookingId: string) => {
    ringAlertAudio.stopRing();
    setIsRinging(false);
    onUpdateStatus(bookingId, 'accepted');
  };

  // Explicit Decline action: Immediately stop the ring alert & update booking to declined/rejected
  const handleDeclineBooking = (bookingId: string) => {
    ringAlertAudio.stopRing();
    setIsRinging(false);
    onUpdateStatus(bookingId, 'declined');
  };

  const toggleMuteSound = () => {
    const muted = ringAlertAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleTestRing = () => {
    if (providerBookings.length > 0) {
      if (onTriggerRingAlert) {
        onTriggerRingAlert(providerBookings[0]);
      } else {
        ringAlertAudio.startRing();
        setIsRinging(true);
      }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Profile Terminal */}
      <div className="bg-stone-900/85 backdrop-blur-xl rounded-3xl border border-stone-800 p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-950 shrink-0 border-2 border-amber-500/50 shadow-lg">
            <img
              src={activeProvider.image}
              alt={activeProvider.businessName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isAvailable && (
              <span className="absolute top-2 left-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Service Provider Dispatch Terminal
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Ugandan Stylist
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {activeProvider.businessName}
            </h2>

            <div className="text-xs text-stone-300 flex items-center gap-2">
              <span>
                Lead Artist: <strong className="text-white">{activeProvider.name}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {activeProvider.location.city}
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Provider Switcher & Live GPS Broadcast Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Switch Active Provider Profile */}
          {allProviders.length > 0 && (
            <div className="bg-stone-950/90 p-2.5 rounded-2xl border border-stone-800">
              <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">
                Logged in as Provider:
              </label>
              <select
                value={activeProvider._id}
                onChange={handleSwitchProvider}
                aria-label="Logged in as Provider"
                className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {allProviders.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.businessName} ({p.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* On-Demand Availability Switch */}
          <div className="flex items-center gap-3 bg-stone-950/90 p-3 rounded-2xl border border-stone-800">
            <div className="text-right">
              <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`}
                />
                <span>{isAvailable ? 'Broadcasting Available' : 'Offline / Busy'}</span>
              </div>
              <div className="text-[11px] text-stone-400">
                {isAvailable ? 'Receives incoming ring alerts' : 'Mutes instant dispatches'}
              </div>
            </div>

            <button
              onClick={handleToggle}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isAvailable ? 'bg-emerald-500' : 'bg-stone-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-stone-950 shadow-md transform transition-transform ${
                  isAvailable ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Audio Ring Alert Alert Banner when requests are ringing */}
      {isRinging && (
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-2 border-amber-500 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/40 animate-bounce shrink-0">
              <Bell className="w-6 h-6 fill-stone-950" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold flex items-center gap-2">
                <span>INCOMING BOOKING REQUEST — AUDIBLE RING ALERT ACTIVE</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-sm text-stone-200">
                A client has requested a service. Tap{' '}
                <strong className="text-emerald-400">Available (Accept)</strong> or{' '}
                <strong className="text-rose-400">Not Available (Decline)</strong> to stop the ring
                and notify the client.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMuteSound}
              className="px-3.5 py-2 rounded-xl bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{isMuted ? 'Unmute' : 'Mute Sound'}</span>
            </button>
            <button
              onClick={() => {
                ringAlertAudio.stopRing();
                setIsRinging(false);
              }}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold cursor-pointer"
            >
              Silence Ring
            </button>
          </div>
        </div>
      )}

      {/* Ring Alert Simulator Action Bar */}
      <div className="bg-gradient-to-r from-amber-950/80 via-stone-900/90 to-amber-950/80 rounded-2xl border border-amber-500/40 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Service Provider Ring Alert Demonstration</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Active Sound Engine
              </span>
            </div>
            <div className="text-xs text-stone-300">
              When a client books, your device sounds an audible two-tone ring. Tap{' '}
              <strong className="text-emerald-400">Available (Accept)</strong> or{' '}
              <strong className="text-rose-400">Not Available (Decline)</strong> to immediately stop
              the sound and send real-time feedback back to the client.
            </div>
          </div>
        </div>

        {providerBookings.length > 0 && (
          <button
            onClick={handleTestRing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 active:scale-95"
          >
            <Bell className="w-4 h-4 fill-stone-950" />
            <span>Test Incoming Ring Alert Now</span>
          </button>
        )}
      </div>

      {/* Incoming Dispatches List with Available & Not Available Actions */}
      <div className="bg-stone-900/85 backdrop-blur-xl rounded-3xl border border-stone-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-white">
              Incoming Dispatches & Client Bookings
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Real-time booking requests requiring provider acceptance or status progression
            </p>
          </div>
          <span className="text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
            {providerBookings.length} Total Dispatches
          </span>
        </div>

        <div className="divide-y divide-stone-800">
          {providerBookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400 space-y-2">
              <Clock className="w-8 h-8 text-stone-600 mx-auto" />
              <div>
                No incoming bookings right now. Clients booking in Kampala will trigger your ring
                alert here.
              </div>
            </div>
          ) : (
            providerBookings.map((b) => (
              <div
                key={b._id}
                className={`p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors ${
                  b.status === 'pending'
                    ? 'bg-amber-950/30 border-l-4 border-amber-400 ring-1 ring-amber-500/20'
                    : 'hover:bg-stone-850/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-base">{b.customerName}</span>
                    <span className="text-xs text-stone-500">·</span>
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="text-xs text-amber-300 font-mono flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      {b.customerPhone}
                    </a>
                    <span className="text-xs text-stone-500">·</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                        b.status === 'accepted' || b.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : b.status === 'declined'
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                          : b.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      Status: {b.status === 'accepted' ? 'Accepted (Available)' : b.status === 'declined' ? 'Declined (Not Available)' : b.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-stone-300 flex items-center gap-2">
                    <span className="font-semibold text-white">Services:</span>
                    <span>{b.services.map((s) => s.name).join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-stone-300">{b.address}</span>
                    </div>
                    {b.specialNotes && (
                      <div className="text-stone-400 italic">Note: "{b.specialNotes}"</div>
                    )}
                  </div>
                </div>

                {/* Provider Actions with Explicit Accept and Decline */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* If Pending: Display Available (Accept) and Not Available (Decline) buttons which stop the ring */}
                  {b.status === 'pending' && (
                    <>
                      {/* Decline / Not Available button */}
                      <button
                        onClick={() => handleDeclineBooking(b._id)}
                        className="px-4 py-2 rounded-xl border border-rose-500/60 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-950/50 active:scale-95"
                      >
                        <X className="w-3.5 h-3.5 stroke-3" />
                        <span>Not Available (Decline)</span>
                      </button>

                      {/* Accept / Available button */}
                      <button
                        onClick={() => handleAcceptBooking(b._id)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 animate-pulse"
                      >
                        <Check className="w-3.5 h-3.5 stroke-3" />
                        <span>Available (Accept)</span>
                      </button>
                    </>
                  )}

                  {/* If Accepted / Confirmed: Progress steps */}
                  {(b.status === 'accepted' || b.status === 'confirmed') && (
                    <button
                      onClick={() => onUpdateStatus(b._id, 'en_route')}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-400/20"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Start Travel (En Route)</span>
                    </button>
                  )}

                  {b.status === 'en_route' && (
                    <button
                      onClick={() => onUpdateStatus(b._id, 'arrived')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Arrived at Doorstep</span>
                    </button>
                  )}

                  {b.status === 'arrived' && (
                    <button
                      onClick={() => onUpdateStatus(b._id, 'completed')}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Complete Session</span>
                    </button>
                  )}

                  {b.status === 'completed' && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 px-3 py-1 bg-emerald-950/60 rounded-lg border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}

                  {b.status === 'declined' && (
                    <span className="text-xs text-rose-400 font-semibold flex items-center gap-1 px-3 py-1 bg-rose-950/60 rounded-lg border border-rose-500/30">
                      <X className="w-3.5 h-3.5" />
                      Declined (Not Available)
                    </span>
                  )}

                  {/* Trigger Ring Alert for this specific booking */}
                  {onTriggerRingAlert && (
                    <button
                      onClick={() => onTriggerRingAlert(b)}
                      title="Play Ring Alert Simulation"
                      className="p-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
