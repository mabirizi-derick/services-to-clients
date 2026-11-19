import React from 'react';
import { Search, MapPin, Zap, ShieldCheck, Sparkles, Clock, CheckCircle2, Star } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string, category: string, onDemandOnly: boolean) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreClick }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [onDemandOnly, setOnDemandOnly] = React.useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, category, onDemandOnly);
  };

  const handleQuickTag = (tagQuery: string, catKey: string) => {
    setSearchTerm(tagQuery);
    setCategory(catKey);
    onSearch(tagQuery, catKey, onDemandOnly);
  };

  return (
    <section className="relative overflow-hidden border-b border-stone-800/80 bg-transparent">
      {/* Subtle Warm Amber Ambient Glow Behind Hero */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-amber-300 bg-stone-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">Live On-Demand Dispatch</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span>Kampala & Student Hostels</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.14]">
                Book and Order service providers at your{' '}
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent underline decoration-amber-400/50 decoration-2 underline-offset-8">
                  Home, Hostel
                </span>{' '}
                and anywhere you're comfortable in minutes
              </h1>

              {/* Service Availability Subtitle Badge */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-stone-900/90 to-rose-950/80 border border-amber-400/40 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-semibold shadow-xl">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-white font-bold">(Nail and Hair services available)</span>
                  <span className="hidden sm:inline text-amber-400/70 font-normal">· Hand-painted nails & expert braids</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
              Certified Ugandan master nail artists and hair braiders dispatched directly to your doorstep, student hostel, private residence, or office with live GPS tracking and secure MTN / Airtel MoMo escrow.
            </p>

            {/* Interactive Luxury Search & Filter Card */}
            <form
              onSubmit={handleSubmit}
              className="bg-stone-900/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-stone-700/80 shadow-2xl space-y-3.5 max-w-xl ring-1 ring-white/5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nail art, knotless braids, locs..."
                    className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-stone-950/80 border border-stone-700 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-all"
                  />
                </div>
                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-950/80 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-all cursor-pointer"
                  >
                    <option value="all" className="bg-stone-900 text-white">All Kampala Services</option>
                    <option value="nail_salon" className="bg-stone-900 text-white">Nail Salons & Painting</option>
                    <option value="beauty_stylist" className="bg-stone-900 text-white">Hairmaking, Braids & Locs</option>
                  </select>
                </div>
              </div>

              {/* Quick Filter Tag Shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                <span className="text-stone-400 font-medium">Popular:</span>
                <button
                  type="button"
                  onClick={() => handleQuickTag('nail art', 'nail_salon')}
                  className="px-2.5 py-0.5 rounded-lg bg-stone-800/80 hover:bg-stone-750 text-amber-300 border border-stone-700 transition-colors cursor-pointer"
                >
                  💅 3D Nail Art
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTag('knotless', 'beauty_stylist')}
                  className="px-2.5 py-0.5 rounded-lg bg-stone-800/80 hover:bg-stone-750 text-amber-300 border border-stone-700 transition-colors cursor-pointer"
                >
                  💇‍♀️ Knotless Braids
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTag('hostel', 'all')}
                  className="px-2.5 py-0.5 rounded-lg bg-stone-800/80 hover:bg-stone-750 text-emerald-300 border border-stone-700 transition-colors cursor-pointer"
                >
                  🏠 Hostel Dispatch
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-stone-800">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onDemandOnly}
                    onChange={(e) => setOnDemandOnly(e.target.checked)}
                    className="rounded border-stone-600 bg-stone-950 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Instant On-Demand (&lt; 25 mins)</span>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-amber-500/20"
                >
                  Find Available Stylists
                </button>
              </div>
            </form>

            {/* Social Proof & Guarantees */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>15–20 Min Avg Dispatch</span>
              </div>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <div className="flex items-center gap-1.5 font-medium text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sterilized Equipment Kits</span>
              </div>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <div className="flex items-center gap-1.5 font-medium text-white">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>MTN & Airtel MoMo Escrow</span>
              </div>
            </div>

          </div>

          {/* Right Showcase Imagery Column - Ugandan Stylist & Client Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Backlight Behind Card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-rose-500/20 to-amber-500/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000" />

            <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden border border-amber-400/40 shadow-2xl bg-stone-900 group">
              <img
                src="/src/assets/images/ugandan_stylist_client_session_1791281601103.jpg"
                alt="Ugandan hair and nail stylist session with client in Kampala"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
              
              {/* Floating Top Status Badge */}
              <div className="absolute top-3.5 left-3.5 bg-stone-950/85 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>4.98 Rating · 1,450+ Sessions</span>
              </div>

              <div className="absolute top-3.5 right-3.5 bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Dispatch</span>
              </div>

              {/* Bottom Information Card */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-300 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-md mb-1.5 border border-amber-400/30">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Doorstep & Hostel Mobile Specialist</span>
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-md">
                  Ugandan Master Nail Artists & Stylists
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Kololo · Kikoni Hostels · Bugolobi · Makerere · Ntinda</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
