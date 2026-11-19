import React, { useState } from 'react';
import { BEAUTY_GALLERY, GalleryItem } from '../data/beautyGallery.ts';
import { Provider } from '../types/index.ts';
import { Sparkles, Clock, MapPin, ChevronRight, Check } from 'lucide-react';

interface GallerySectionProps {
  providers: Provider[];
  onSelectStyle: (item: GalleryItem, provider: Provider) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  providers,
  onSelectStyle,
}) => {
  const [filter, setFilter] = useState<'all' | 'nail_art' | 'nail_paint' | 'hairmaking' | 'dreadlocks'>('all');

  const filteredItems = BEAUTY_GALLERY.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'nail_art' || filter === 'nail_paint') {
      return item.category === 'nail_art' || item.category === 'nail_paint';
    }
    return item.category === filter;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Ugandan Style Portfolio ({BEAUTY_GALLERY.length} Verified Looks)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Nail Paints, Intricate Art & African Hairmaking
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Browse our lookbook of hand-painted nail designs, Russian manicures, waist-length knotless braids, and dreadlock styling crafted by top Kampala artists.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Looks ({BEAUTY_GALLERY.length})
          </button>
          <button
            onClick={() => setFilter('nail_art')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filter === 'nail_art' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Nail Paints & Paintings
          </button>
          <button
            onClick={() => setFilter('hairmaking')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filter === 'hairmaking' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            African Braids & Twists
          </button>
          <button
            onClick={() => setFilter('dreadlocks')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filter === 'dreadlocks' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dreadlocks & Sisterlocks
          </button>
        </div>
      </div>

      {/* Grid of 16-20 Showcase Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          // Find matching provider in Kampala
          const matchedProvider =
            providers.find((p) => p.businessName.toLowerCase().includes(item.salon.split(' ')[0].toLowerCase())) ||
            providers[0];

          return (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-stone-950/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {item.categoryLabel}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-mono font-bold px-2 py-0.5 rounded shadow">
                  UGX {item.priceUgx.toLocaleString()}
                </div>
              </div>

              {/* Information */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] text-stone-500 font-medium mb-1">
                    {item.salon}
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{item.durationMinutes} mins</span>
                    </span>
                    <span className="font-medium text-stone-700">Artist: {item.artist}</span>
                  </div>

                  <button
                    onClick={() => matchedProvider && onSelectStyle(item, matchedProvider)}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Book This Style</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
