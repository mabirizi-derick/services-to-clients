import React, { useEffect, useState } from 'react';
import { Booking } from '../types/index.ts';
import { ringAlertAudio } from '../utils/ringAlertAudio.ts';
import { PhoneCall, Check, X, Bell, MapPin, Clock, Volume2, VolumeX, ShieldCheck, Sparkles, User, AlertCircle, Phone } from 'lucide-react';

interface ProviderRingAlertModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onAvailable: (booking: Booking) => void;
  onNotAvailable: (booking: Booking, reason?: string) => void;
}

export const ProviderRingAlertModal: React.FC<ProviderRingAlertModalProps> = ({
  booking,
  isOpen,
  onAvailable,
  onNotAvailable,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [secondsRinging, setSecondsRinging] = useState(0);

  // Trigger sound ring alert whenever modal opens
  useEffect(() => {
    if (isOpen && booking) {
      ringAlertAudio.startRing();
      setSecondsRinging(0);

      const timer = setInterval(() => {
        setSecondsRinging((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        ringAlertAudio.stopRing();
      };
    } else {
      ringAlertAudio.stopRing();
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const handleAvailableClick = () => {
    // Both buttons MUST stop the ring alert
    ringAlertAudio.stopRing();
    onAvailable(booking);
  };

  const handleNotAvailableClick = () => {
    // Both buttons MUST stop the ring alert
    ringAlertAudio.stopRing();
    onNotAvailable(booking, 'Stylist is currently booked or unavailable');
  };

  const toggleMute = () => {
    const muted = ringAlertAudio.toggleMute();
    setIsMuted(muted);
  };

  const totalDuration = booking.services.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Outer ambient glow based on incoming alert */}
      <div className="relative w-full max-w-xl bg-stone-900 text-stone-100 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-amber-500/80 overflow-hidden flex flex-col max-h-[92vh] ring-4 ring-amber-500/20">
        
        {/* Animated Ring Alert Header Bar */}
        <div className="relative px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-amber-950 via-stone-950 to-amber-950 border-b border-amber-500/40 flex items-center justify-between gap-2 overflow-hidden shrink-0">
          {/* Pulsing light wave background */}
          <div className="absolute inset-0 bg-amber-500/10 animate-pulse pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10 min-w-0">
            {/* Ringing phone icon with radar pulse */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
                <Bell className="w-5 h-5 fill-stone-950" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider sm:tracking-widest text-amber-300 font-bold flex flex-wrap items-center gap-1.5">
                <span>INCOMING RING ALERT</span>
                <span className="text-stone-400 font-normal">({secondsRinging}s)</span>
              </div>
              <div className="text-sm sm:text-lg font-serif font-bold text-white truncate">
                {booking.providerName}
              </div>
            </div>
          </div>

          {/* Sound Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="relative z-10 p-2 rounded-xl bg-stone-900/90 border border-stone-700 hover:border-amber-400 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title={isMuted ? 'Unmute Ring Alert' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Ring Alert Notice Banner */}
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-amber-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-medium">Ring alert active until answered:</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold text-amber-300">
            {booking.bookingType === 'on_demand' ? '⚡ Instant Dispatch' : '📅 Scheduled'}
          </span>
        </div>

        {/* Booking Details for Provider */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          
          {/* Client Information */}
          <div className="bg-stone-950/80 rounded-2xl p-3.5 sm:p-4 border border-stone-800 space-y-3">
            <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
              Client &amp; Contact Details
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                  {booking.customerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {booking.customerName}
                  </div>
                  <div className="text-xs text-stone-400 font-mono truncate">
                    {booking.customerPhone}
                  </div>
                </div>
              </div>

              {booking.customerPhone && (
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 border border-stone-700 transition-colors shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Client</span>
                </a>
              )}
            </div>

            {/* Destination Address */}
            <div className="pt-2 border-t border-stone-800 flex items-start gap-2.5 text-xs text-stone-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Delivery Location: </span>
                <span className="text-stone-300">{booking.address}</span>
              </div>
            </div>

            {/* Special Notes from Client */}
            {booking.specialNotes && (
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-amber-200/90">
                <span className="font-semibold text-amber-400">Client Note: </span>
                <span>"{booking.specialNotes}"</span>
              </div>
            )}
          </div>

          {/* Requested Services */}
          <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
                Requested Services ({booking.services.length})
              </div>
              <div className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>~{totalDuration} mins estimated</span>
              </div>
            </div>

            <div className="space-y-2">
              {booking.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{srv.name}</div>
                    <div className="text-[11px] text-stone-400">{srv.description}</div>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    {srv.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live ETA Info */}
          <div className="flex items-center gap-2 text-xs text-stone-400 px-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Response will immediately provide real-time feedback to the client.</span>
          </div>
        </div>

        {/* TWO BUTTONS THAT STOP THE RING ALERT */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 space-y-2.5 sm:space-y-3 shrink-0">
          <div className="text-center text-xs text-stone-400 font-medium">
            Are you available to take this booking right now?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Button 1: Not Available (Stops Ring Alert & Declines) */}
            <button
              type="button"
              onClick={handleNotAvailableClick}
              className="py-3 px-4 rounded-2xl border-2 border-rose-500/80 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2.5 group active:scale-95"
            >
              <div className="w-6 h-6 rounded-full bg-rose-600/80 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <X className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-sm">Not Available</div>
                <div className="text-[10px] text-rose-300/80 font-normal">Stop ring &amp; decline</div>
              </div>
            </button>

            {/* Button 2: Available (Stops Ring Alert & Accepts) */}
            <button
              type="button"
              onClick={handleAvailableClick}
              className="py-3 px-4 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-bold text-sm transition-all cursor-pointer shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 group active:scale-95 animate-pulse"
            >
              <div className="w-6 h-6 rounded-full bg-stone-950 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-stone-950 text-sm">Available</div>
                <div className="text-[10px] text-stone-900 font-medium">Stop ring &amp; accept</div>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
