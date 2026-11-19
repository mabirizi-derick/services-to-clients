import React from 'react';
import { Provider, ServiceItem } from '../types/index.ts';
import { Star, Clock, Zap, MapPin, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ProviderGridProps {
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
  onBookService: (provider: Provider, service?: ServiceItem) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const ProviderGrid: React.FC<ProviderGridProps> = ({
  providers,
  onSelectProvider,
  onBookService,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Section Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 pb-4 sm:pb-5 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Verified Ugandan Salons &amp; Mobile Artists</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Select Your Salon or Beauty Stylist
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Choose certified nail studios or mobile hair braiders ready to dispatch directly to your door in Kampala.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl shadow-lg overflow-x-auto scrollbar-none w-full md:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            All Artists ({providers.length})
          </button>
          <button
            onClick={() => setActiveFilter('nail_salon')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === 'nail_salon'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            Nail Studios &amp; Art
          </button>
          <button
            onClick={() => setActiveFilter('beauty_stylist')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilter === 'beauty_stylist'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            Hairmaking &amp; Braids
          </button>
        </div>
      </div>

      {/* 3-Column Luxury Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {providers.map((provider) => (
          <article
            key={provider._id}
            className="group bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 shadow-xl hover:shadow-2xl hover:border-amber-400/50 hover:bg-stone-800/90 transition-all duration-300 flex flex-col overflow-hidden ring-1 ring-white/5"
          >
            {/* Lead Imagery */}
            <div
              onClick={() => onSelectProvider(provider)}
              className="relative aspect-4/3 w-full overflow-hidden bg-stone-950 cursor-pointer"
            >
              <img
                src={provider.image}
                alt={provider.businessName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              {/* On-Demand Availability Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-stone-950/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 shadow-lg">
                {provider.isOnDemandAvailable ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>On-Demand ({provider.estimatedArrivalMinutes}m ETA)</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-stone-300" />
                    <span>Studio Appointment</span>
                  </>
                )}
              </div>

              {/* Price level tag */}
              <div className="absolute top-3 right-3 bg-amber-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-bold px-2 py-0.5 rounded-lg shadow-md">
                {provider.pricingLevel}
              </div>
            </div>

            {/* Provider Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
              <div>
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-400 mb-2">
                  <span className="text-amber-300 font-medium">
                    {provider.type === 'nail_salon' ? 'Nail Studio' : 'Hair & Braids'}
                  </span>
                  <span aria-hidden="true" className="text-stone-700">·</span>
                  <span className="flex items-center gap-1 text-white font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono tabular-nums font-bold">{provider.rating}</span>
                    <span className="text-stone-400">({provider.reviewsCount})</span>
                  </span>
                  <span aria-hidden="true" className="text-stone-700">·</span>
                  <span className="truncate text-stone-300">{provider.location.city}</span>
                </div>

                <h3
                  onClick={() => onSelectProvider(provider)}
                  className="text-lg sm:text-xl font-serif font-bold text-white leading-snug mb-1.5 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {provider.businessName}
                </h3>

                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {provider.tagline}
                </p>

                {/* Popular Services Highlights with UGX prices */}
                <div className="space-y-1.5 pt-3 mt-3 border-t border-stone-800">
                  <div className="text-[10px] uppercase tracking-wider font-mono font-semibold text-stone-400">
                    Featured Services
                  </div>
                  {provider.services.slice(0, 2).map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => onBookService(provider, srv)}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-950/70 hover:bg-stone-800/90 border border-stone-800/80 transition-colors cursor-pointer text-xs"
                    >
                      <div className="truncate min-w-0">
                        <span className="font-medium text-stone-200">{srv.name}</span>
                        <span className="text-stone-400 text-[11px] ml-1.5">({srv.durationMinutes}m)</span>
                      </div>
                      <div className="font-mono tabular-nums font-bold text-amber-300 whitespace-nowrap shrink-0">
                        UGX {srv.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Client selects provider */}
              <div className="pt-3 border-t border-stone-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectProvider(provider)}
                  className="py-2.5 px-2.5 text-xs font-semibold text-stone-300 bg-stone-950/90 hover:bg-stone-800 hover:text-white border border-stone-800 rounded-xl transition-colors cursor-pointer text-center truncate"
                >
                  View Menu
                </button>
                <button
                  onClick={() => onBookService(provider)}
                  className="py-2.5 px-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap shadow-md shadow-amber-500/20"
                >
                  <span>Select &amp; Book</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
