import React, { useState } from 'react';
import { Provider, ServiceItem, Review } from '../types/index.ts';
import { NAIL_ART_GALLERY } from '../data/nailArtGallery.ts';
import { HAIR_GALLERY } from '../data/hairGallery.ts';
import { X, Star, MapPin, Zap, Clock, ShieldCheck, Check, Sparkles, ChevronRight, Phone, MessageSquare } from 'lucide-react';

interface ProviderDetailModalProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  onBookService: (provider: Provider, service?: ServiceItem) => void;
  reviews: Review[];
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  provider,
  isOpen,
  onClose,
  onBookService,
  reviews,
}) => {
  const [activeTabType, setActiveTabType] = useState<'nails' | 'hair'>('nails');

  if (!isOpen || !provider) return null;

  const providerReviews = reviews.filter((r) => r.providerId === provider._id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 text-stone-100 w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-700/80 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <span>Verified Ugandan Salon Profile</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-300">{provider.location.city}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          
          {/* Hero Studio Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
              <img
                src={provider.image}
                alt={provider.businessName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-stone-950/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                {provider.isOnDemandAvailable ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>On-Demand Ready (~{provider.estimatedArrivalMinutes}m)</span>
                  </>
                ) : (
                  <span>Studio Appointment Only</span>
                )}
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="font-semibold text-amber-400 uppercase tracking-wider">
                  {provider.type === 'nail_salon' ? 'Nail Studio & Art Bar' : 'Hairmaking & Braids Lounge'}
                </span>
                <span aria-hidden="true" className="text-stone-700">·</span>
                <span className="flex items-center gap-1 text-white font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono tabular-nums">{provider.rating}</span>
                  <span className="text-stone-400 font-normal">({provider.reviewsCount} reviews)</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {provider.businessName}
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {provider.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{provider.location.address}, {provider.location.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Autoclave Sanitized Tools</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {provider.badges.map((badge, idx) => (
                  <span key={idx} className="text-[11px] font-medium bg-stone-950 text-stone-300 border border-stone-800 px-2.5 py-0.5 rounded-md">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Separated Art Portfolios */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-0.5">
                  Artistic Showcase Portfolio
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Styles & Lookbook Portfolio
                </h3>
              </div>

              {/* Gallery Switcher */}
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl text-xs border border-stone-800">
                <button
                  onClick={() => setActiveTabType('nails')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTabType === 'nails' ? 'bg-amber-400 font-bold text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Nail Art & Paints ({NAIL_ART_GALLERY.length})
                </button>
                <button
                  onClick={() => setActiveTabType('hair')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTabType === 'hair' ? 'bg-amber-400 font-bold text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Hair & Braids ({HAIR_GALLERY.length})
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            {activeTabType === 'nails' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {NAIL_ART_GALLERY.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-stone-950/80 rounded-xl overflow-hidden border border-stone-800 hover:border-amber-400/50 transition-all flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-stone-900">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-stone-950/90 text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {item.technique}
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="font-semibold text-white text-xs line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-2">
                          {item.description}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-amber-300">USh {item.priceUgx.toLocaleString()}</span>
                        <span className="text-[10px] text-stone-500 font-sans">{item.durationMinutes}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HAIR_GALLERY.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-stone-950/80 rounded-xl overflow-hidden border border-stone-800 hover:border-amber-400/50 transition-all flex flex-col"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-stone-950/90 text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {item.styleType}
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="font-semibold text-white text-xs line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-2">
                          {item.description}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-amber-300">UGX {item.priceUgx.toLocaleString()}</span>
                        <span className="text-[10px] text-stone-500 font-sans">{item.durationMinutes}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Complete Services & Pricing Menu (in UGX) */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-0.5">
                Salon Menu & Price List
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Services Available for Booking
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-amber-400/40 transition-all flex items-center justify-between shadow-xs"
                >
                  <div className="space-y-1 pr-3">
                    <div className="font-bold text-white text-sm">
                      {srv.name}
                    </div>
                    <div className="text-xs text-stone-300 leading-snug">
                      {srv.description}
                    </div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{srv.durationMinutes} minutes session</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-2">
                    <div className="text-sm font-mono font-bold text-amber-300 tabular-nums">
                      UGX {srv.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => onBookService(provider, srv)}
                      className="px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      <span>Book Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-0.5">
                Client Testimonials
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Reviews for {provider.businessName}
              </h3>
            </div>

            <div className="space-y-3">
              {providerReviews.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400 bg-stone-950 rounded-xl border border-stone-800">
                  No reviews for this salon yet. Be the first to book and earn +50 loyalty points!
                </div>
              ) : (
                providerReviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white">
                        {rev.customerName}
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <div className="text-[11px] text-stone-400 font-medium">
                      Service: {rev.serviceName}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs text-stone-400">Selected Provider:</div>
            <div className="text-sm font-serif font-bold text-white">{provider.businessName}</div>
          </div>

          <button
            onClick={() => onBookService(provider)}
            className="px-6 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <span>Proceed to On-Demand Booking</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
