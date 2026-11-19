import React, { useState } from 'react';
import { Sparkles, Scissors, Footprints, Heart, Crown, UserCheck, Star, MapPin, Zap, Clock, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { Provider, ServiceItem } from '../types/index.ts';
import { INITIAL_SERVICE_PROVIDERS } from '../data/serviceProviders.ts';

interface CategoryExplorerProps {
  onSelectCategory: (categoryKey: string) => void;
  onExploreNailArt: () => void;
  onExploreHair: () => void;
  providers?: Provider[];
  onSelectProvider?: (provider: Provider) => void;
  onBookService?: (provider: Provider, service?: ServiceItem) => void;
}

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  onSelectCategory,
  onExploreNailArt,
  onExploreHair,
  providers = INITIAL_SERVICE_PROVIDERS,
  onSelectProvider,
  onBookService,
}) => {
  const allProvidersList = providers && providers.length >= 9 ? providers : INITIAL_SERVICE_PROVIDERS;
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const categories = [
    {
      id: 'nail_art',
      title: 'Hand-Painted Nail Art & Gel Sets',
      subtitle: '3D floral pearls, cherry french tips, 24k gold marble',
      priceUgx: 'From USh 45,000',
      duration: '45–80 mins',
      tag: 'Trending in Kololo',
      icon: Sparkles,
      filterCategory: 'nail_salon',
      providerIds: ['prov_kololo_nails', 'prov_kikoni_hostel_nails', 'prov_acacia_artisan', 'prov_bugolobi_glam'],
    },
    {
      id: 'braids',
      title: 'African Knotless Box Braids & Twists',
      subtitle: 'Weightless square parting, golden filigree cuffs, boho curls',
      priceUgx: 'From USh 110,000',
      duration: '2.5–3.5 hrs',
      tag: 'Painless & Lightweight',
      icon: Scissors,
      filterCategory: 'beauty_stylist',
      providerIds: ['prov_bukoto_braids', 'prov_ntinda_silkpress', 'prov_muyenga_bridal'],
    },
    {
      id: 'locs',
      title: 'Architectural Dreadlocks & Loc Care',
      subtitle: 'Organic beeswax retwist, clarifying detox & barrel rolls',
      priceUgx: 'From USh 85,000',
      duration: '90 mins',
      tag: 'Unisex Specialty',
      icon: Crown,
      filterCategory: 'beauty_stylist',
      providerIds: ['prov_banda_locs', 'prov_bukoto_braids'],
    },
    {
      id: 'silk_press',
      title: 'Red-Carpet Silk Press & Steam Detox',
      subtitle: 'Ultrasonic moisture steam, peptide scalp cure, mirror sheen',
      priceUgx: 'From USh 75,000',
      duration: '75 mins',
      tag: 'Zero Heat Damage',
      icon: Heart,
      filterCategory: 'beauty_stylist',
      providerIds: ['prov_ntinda_silkpress', 'prov_bukoto_braids'],
    },
    {
      id: 'pedicure',
      title: 'Botanical Herbal Foot Spa & Pedicure',
      subtitle: 'Ugandan Nilotica shea butter soak, callus smoothing & toe art',
      priceUgx: 'From USh 50,000',
      duration: '60 mins',
      tag: 'Relaxation Luxe',
      icon: Footprints,
      filterCategory: 'nail_salon',
      providerIds: ['prov_nakasero_spa', 'prov_kololo_nails', 'prov_acacia_artisan'],
    },
    {
      id: 'bridal',
      title: 'Traditional Kwanjula & Wedding Bridal Glam',
      subtitle: 'Sculptured Gomesi hair updos, gel overlays & trial styling',
      priceUgx: 'From USh 180,000',
      duration: '3–4 hrs',
      tag: 'VIP Bridal Package',
      icon: UserCheck,
      filterCategory: 'beauty_stylist',
      providerIds: ['prov_muyenga_bridal', 'prov_bugolobi_glam', 'prov_kololo_nails'],
    },
  ];

  // Active category object if clicked
  const activeCategory = categories.find((c) => c.id === selectedServiceId);

  // Compute displayed providers based on clicked service
  const displayedProviders = activeCategory
    ? allProvidersList.filter((p) => activeCategory.providerIds.includes(p._id))
    : allProvidersList.slice(0, 9); // All 9 service providers!

  const handleCardClick = (cat: typeof categories[0]) => {
    if (selectedServiceId === cat.id) {
      // Toggle off to show all 9
      setSelectedServiceId(null);
    } else {
      setSelectedServiceId(cat.id);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header with updated h2 title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            Comprehensive Beauty Menu & Verified Artisans
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Explore All Services, Treatments & Service Providers
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Click any service below to view verified Ugandan service providers specializing in that treatment, or browse all 9 certified providers across Kampala.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-amber-300 font-semibold bg-stone-900/90 border border-stone-800 px-3.5 py-1.5 rounded-xl shadow-sm">
            <span>9 Verified Kampala Service Providers</span>
          </div>
          {selectedServiceId && (
            <button
              onClick={() => setSelectedServiceId(null)}
              className="text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              Show All 9 Providers
            </button>
          )}
        </div>
      </div>

      {/* Services Grid (Clicking gives list of service providers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedServiceId === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat)}
              className={`group p-6 rounded-2xl border backdrop-blur-md shadow-xl transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400 shadow-2xl ring-2 ring-amber-400/50 -translate-y-1'
                  : 'bg-stone-900/85 border-stone-800 hover:border-amber-400/50 hover:bg-stone-850/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`p-3 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-stone-950/60 text-amber-400 border-stone-700/80 group-hover:bg-amber-400 group-hover:text-stone-950'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {isSelected ? '✓ Showing Providers' : cat.tag}
                  </span>
                </div>

                <h3
                  className={`font-serif font-bold text-lg transition-colors ${
                    isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-300'
                  }`}
                >
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-300">{cat.priceUgx}</div>
                  <div className="text-[10px] text-stone-400">{cat.duration}</div>
                </div>
                <span
                  className={`text-xs font-bold transition-all inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950'
                      : 'text-amber-400 group-hover:translate-x-1'
                  }`}
                >
                  <span>{isSelected ? 'Selected' : 'View Providers'}</span>
                  <span>{isSelected ? '▼' : '→'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Service Providers List Section */}
      <div className="bg-stone-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl space-y-6 ring-1 ring-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {activeCategory
                  ? `Service Providers for: "${activeCategory.title}"`
                  : 'All 9 Verified Kampala Service Providers'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {activeCategory
                ? `Available Service Providers (${displayedProviders.length})`
                : 'All 9 Service Providers Ready for Dispatch'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {activeCategory
                ? `Showing vetted salons and mobile technicians in Kampala offering ${activeCategory.title}.`
                : 'Select any provider below to book an on-demand session or review their complete salon menu.'}
            </p>
          </div>

          {activeCategory && (
            <button
              onClick={() => setSelectedServiceId(null)}
              className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-950 border border-stone-700 rounded-xl transition-colors cursor-pointer"
            >
              Reset to All 9 Providers
            </button>
          )}
        </div>

        {/* 9 Service Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProviders.map((provider) => (
            <article
              key={provider._id}
              className="group bg-stone-950/80 rounded-2xl border border-stone-800/90 hover:border-amber-400/50 hover:bg-stone-900/90 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
            >
              {/* Photo Banner with Badges */}
              <div
                onClick={() => onSelectProvider?.(provider)}
                className="relative aspect-4/3 w-full overflow-hidden bg-stone-900 cursor-pointer"
              >
                <img
                  src={provider.image}
                  alt={provider.businessName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Dispatch ETA Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-stone-950/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 shadow-md">
                  {provider.isOnDemandAvailable ? (
                    <>
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                      <span>On-Demand ({provider.estimatedArrivalMinutes}m ETA)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-stone-300" />
                      <span>Studio Appointment</span>
                    </>
                  )}
                </div>

                {/* Pricing Level Tag */}
                <div className="absolute top-3 right-3 bg-amber-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg shadow-sm">
                  {provider.pricingLevel}
                </div>
              </div>

              {/* Provider Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1.5">
                    <span className="text-amber-400 font-medium">
                      {provider.type === 'nail_salon'
                        ? 'Nail Studio & Art'
                        : provider.type === 'beauty_stylist'
                        ? 'Hairmaking & Braids'
                        : 'Mobile Glam Van'}
                    </span>
                    <span aria-hidden="true" className="text-stone-700">·</span>
                    <span className="flex items-center gap-1 text-white font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-mono tabular-nums font-bold">{provider.rating}</span>
                      <span className="text-stone-400">({provider.reviewsCount})</span>
                    </span>
                  </div>

                  <h4
                    onClick={() => onSelectProvider?.(provider)}
                    className="text-lg font-serif font-bold text-white hover:text-amber-300 transition-colors cursor-pointer leading-snug"
                  >
                    {provider.businessName}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{provider.location.city}</span>
                    <span className="text-stone-600">·</span>
                    <span className="text-stone-400 text-[11px]">Lead: {provider.name}</span>
                  </div>

                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {provider.tagline}
                  </p>

                  {/* Highlighted Service with Price */}
                  {provider.services && provider.services.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-300 font-medium truncate pr-2">
                          {provider.services[0].name}
                        </span>
                        <span className="font-mono font-bold text-amber-300 shrink-0">
                          UGX {provider.services[0].price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-800 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProvider?.(provider)}
                    className="flex-1 py-2 px-2.5 text-xs font-semibold text-stone-300 bg-stone-900 hover:bg-stone-800 hover:text-white border border-stone-700/80 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onBookService?.(provider, provider.services[0])}
                    className="flex-1 py-2 px-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 whitespace-nowrap"
                  >
                    <span>Select & Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
