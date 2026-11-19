import React, { useState, useEffect } from 'react';
import { Booking, Provider } from '../types/index.ts';
import { MapPin, Navigation, Phone, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LiveGpsTrackerProps {
  activeBooking: Booking | null;
  providers: Provider[];
  onSelectBooking: (booking: Booking) => void;
  onNewBookingClick: () => void;
  onNotify: (title: string, body: string) => void;
}

export const LiveGpsTracker: React.FC<LiveGpsTrackerProps> = ({
  activeBooking,
  providers,
  onNewBookingClick,
  onNotify,
}) => {
  // Coordinates simulation for Kampala streets
  const [eta, setEta] = useState(activeBooking?.etaMinutes || 14);
  const [progress, setProgress] = useState(0.35); // 0 (start) to 1 (arrived)
  const [status, setStatus] = useState<'confirmed' | 'en_route' | 'arrived' | 'in_progress'>('en_route');
  const [isSimulating] = useState(true);

  // Default provider if none active
  const currentProvider = activeBooking
    ? providers.find((p) => p._id === activeBooking.providerId) || providers[0]
    : providers[0];

  // Simulated GPS movement loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.95) {
          setStatus('arrived');
          setEta(0);
          return 1;
        }
        const next = prev + 0.04;
        const newEta = Math.max(1, Math.round(18 * (1 - next)));
        setEta(newEta);
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Interpolated coordinates along route in Kampala (from Bukoto / Lugogo to Kololo)
  const startLat = 0.3524;
  const startLng = 32.5982;
  const destLat = 0.3345;
  const destLng = 32.5892;

  const currentLat = Number((startLat + (destLat - startLat) * progress).toFixed(4));
  const currentLng = Number((startLng + (destLng - startLng) * progress).toFixed(4));

  const handleSimulateStatus = (nextStatus: 'confirmed' | 'en_route' | 'arrived' | 'in_progress') => {
    setStatus(nextStatus);
    if (nextStatus === 'arrived') {
      setProgress(1);
      setEta(0);
      onNotify(
        'Stylist Has Arrived! ✨',
        `${currentProvider?.businessName || 'Your stylist'} is outside your gate at Plot 14 Acacia Avenue.`
      );
    } else if (nextStatus === 'en_route') {
      setProgress(0.4);
      setEta(11);
      onNotify(
        'En Route Update 🚗',
        `${currentProvider?.businessName || 'Your stylist'} is turning off Lugogo Bypass towards Kololo.`
      );
    }
  };

  // Percentage coordinates mapped to SVG viewBox="0 0 800 480"
  // Route: M 220 80 L 290 170 L 380 260 L 380 340
  const posX = 220 + (380 - 220) * progress;
  const posY = 80 + (340 - 80) * progress;
  const movingLeftPct = (posX / 800) * 100;
  const movingTopPct = (posY / 480) * 100;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Title & Status Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Active Dispatch · Live Satellite GPS</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Real-Time Stylist & Salon Tracking
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Live satellite route telemetry for mobile salons dispatched across Kampala.
          </p>
        </div>

        {/* Simulation controls */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => handleSimulateStatus('en_route')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center ${
              status === 'en_route'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 border border-stone-800 hover:text-white'
            }`}
          >
            En Route (Moving)
          </button>
          <button
            onClick={() => handleSimulateStatus('arrived')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center ${
              status === 'arrived'
                ? 'bg-emerald-500 text-stone-950 font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 border border-stone-800 hover:text-white'
            }`}
          >
            Arrived at Door
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Responsive Percentage-Mapped Vector Map Canvas */}
        <div className="lg:col-span-8 bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 relative flex flex-col">
          {/* Map Overhead Visual Grid */}
          <div className="relative w-full h-[280px] sm:h-[440px] bg-[#141517] overflow-hidden select-none">
            {/* Responsive Street Grid SVG */}
            <svg
              viewBox="0 0 800 480"
              preserveAspectRatio="none"
              className="w-full h-full absolute inset-0 opacity-45"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2a2e36" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="800" height="480" fill="url(#grid)" />

              {/* Acacia Avenue */}
              <line x1="80" y1="20" x2="520" y2="440" stroke="#3e4450" strokeWidth="5" />
              {/* Lugogo Bypass */}
              <line x1="0" y1="260" x2="800" y2="260" stroke="#3e4450" strokeWidth="5" />
              {/* Bukoto link */}
              <line x1="380" y1="40" x2="380" y2="440" stroke="#4a5160" strokeWidth="4" />
              {/* Jinja Road */}
              <line x1="0" y1="390" x2="800" y2="390" stroke="#3e4450" strokeWidth="4" />

              {/* Real-time Route Polyline */}
              <path
                d="M 220 80 L 290 170 L 380 260 L 380 340"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeDasharray="8 8"
                className="animate-pulse"
              />
            </svg>

            {/* Percentage-Positioned Street Typography Overlays */}
            <div className="absolute top-[10%] left-[6%] sm:left-[12%] text-[9px] sm:text-[10px] font-mono tracking-wider text-stone-400 uppercase rotate-20 sm:rotate-35 pointer-events-none">
              Acacia Ave (Kololo)
            </div>
            <div className="absolute top-[50%] left-[4%] text-[9px] sm:text-[10px] font-mono tracking-wider text-stone-400 uppercase pointer-events-none">
              Lugogo Bypass
            </div>
            <div className="absolute top-[28%] left-[52%] text-[9px] sm:text-[10px] font-mono tracking-wider text-stone-400 uppercase pointer-events-none">
              Bukoto-Ntinda Link
            </div>

            {/* Destination Pin: Customer Home (380, 340 in 800x480 => 47.5%, 70.8%) */}
            <div
              style={{ left: '47.5%', top: '70.83%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900 border-2 border-rose-500 shadow-lg flex items-center justify-center text-white">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 fill-rose-500" />
              </div>
              <div className="mt-1 bg-stone-900/95 text-white text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap border border-stone-800">
                You (Kololo)
              </div>
            </div>

            {/* Moving Provider Pin (percentage positioned) */}
            <div
              style={{ left: `${movingLeftPct}%`, top: `${movingTopPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ease-linear z-20"
            >
              <span className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/25 animate-ping" />

              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold">
                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 fill-stone-950 rotate-45" />
              </div>

              <div className="mt-1 bg-emerald-950/95 text-emerald-200 border border-emerald-500/40 text-[9px] sm:text-[10px] font-mono font-medium px-2 py-0.5 rounded shadow whitespace-nowrap">
                {currentProvider?.name?.split(' ')[0] || 'Stylist'} ({eta}m)
              </div>
            </div>
          </div>

          {/* Telemetry Overlay: Stacked neatly below map on phones, floating on sm+ screens */}
          <div className="relative sm:absolute sm:bottom-4 sm:left-4 sm:right-4 bg-stone-950/95 backdrop-blur-md border-t sm:border border-stone-800 sm:rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white text-xs z-30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-800 shrink-0 border border-stone-700">
                <img
                  src={currentProvider?.image || '/src/assets/images/salon_manicure_luxury_1791273765852.jpg'}
                  alt="Stylist avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-stone-100 truncate">
                  {currentProvider?.businessName}
                </div>
                <div className="text-[11px] text-stone-400 truncate">
                  Traveling via Banda Mobile Dispatch
                </div>
              </div>
            </div>

            {/* Tabular Numerals Telemetry */}
            <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/80">
              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400">GPS Coords</div>
                <div className="font-mono tabular-nums text-emerald-400 font-bold text-xs">
                  {currentLat}, {currentLng}
                </div>
              </div>
              <div className="border-l border-stone-800 pl-4 text-right">
                <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Est. Arrival</div>
                <div className="font-mono tabular-nums text-amber-300 text-sm font-bold">
                  {eta === 0 ? 'ARRIVED' : `${eta} MINS`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch Timeline & Contact Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Dispatch Status Card */}
          <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-serif font-bold text-white">
                Dispatch Status
              </h3>
              <span className="font-mono text-xs text-amber-300 tabular-nums font-bold">
                {status === 'arrived' ? 'At Doorstep' : `${eta} mins away`}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Booking Confirmed</div>
                  <div className="text-xs text-stone-400">Service tools sterilized & packed</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    status === 'en_route' || status === 'arrived'
                      ? 'bg-emerald-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  <Navigation className="w-3 h-3 rotate-45" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">En Route via Lugogo Bypass</div>
                  <div className="text-xs text-stone-400">Live GPS tracking active</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    status === 'arrived'
                      ? 'bg-emerald-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${status === 'arrived' ? 'text-white' : 'text-stone-400'}`}>
                    Arrival at Customer Address
                  </div>
                  <div className="text-xs text-stone-400">Plot 14 Acacia Avenue, Kololo, Kampala</div>
                </div>
              </div>
            </div>

            {/* Safety & Protocol Box */}
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center gap-2.5 text-xs text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Artist carries sealed hospital-grade autoclave sterilized kits.</span>
            </div>

            {/* Communication Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => onNotify('Calling Stylist...', 'Connecting private voice line with your artist.')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-stone-200 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Artist</span>
              </button>
              <button
                onClick={() => onNotify('Chat Opened', 'Send door access codes or hostel room instructions.')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-stone-200 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Quick New Booking CTA if no active */}
          {!activeBooking && (
            <div className="p-5 sm:p-6 bg-stone-900/85 backdrop-blur-xl border border-stone-800 text-white rounded-2xl space-y-3 shadow-xl">
              <div className="text-sm font-serif font-bold">
                Need an immediate on-demand appointment?
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Select from our top rated salons and dispatch an artist directly to your home, hostel, or office in under 20 minutes.
              </p>
              <button
                onClick={onNewBookingClick}
                className="w-full py-2.5 px-4 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                Book Instant Service Now
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
