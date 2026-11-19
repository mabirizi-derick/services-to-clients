import React, { useState } from 'react';
import { HAIR_GALLERY, HairStyleItem } from '../data/hairGallery.ts';
import { Provider } from '../types/index.ts';
import { Scissors, Clock, ChevronRight, ZoomIn, X, Sparkles } from 'lucide-react';

interface HairGallerySectionProps {
  providers: Provider[];
  onSelectHairStyle: (item: HairStyleItem, provider: Provider) => void;
}

export const HairGallerySection: React.FC<HairGallerySectionProps> = ({
  providers,
  onSelectHairStyle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [zoomHair, setZoomHair] = useState<HairStyleItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Styles' },
    { id: 'Knotless Braids', label: 'Knotless Box Braids' },
    { id: 'Dreadlocks & Locs', label: 'Dreadlocks & Locs' },
    { id: 'Passion Twists', label: 'Passion Twists' },
    { id: 'Silk Press & Treatment', label: 'Silk Press & Detox' },
    { id: 'Bridal Updo', label: 'Bridal & Kwanjula' },
  ];

  const filteredStyles = HAIR_GALLERY.filter((item) => {
    if (selectedCategory !== 'all' && item.styleType !== selectedCategory) return false;
    return true;
  });

  return (
    <section id="hair-braids-lounge" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 bg-stone-900/85 backdrop-blur-md rounded-3xl my-8 border border-stone-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300 bg-amber-950/70 border border-amber-800/60 px-3 py-1 rounded-full mb-3">
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>African Hairmaking & Braiding Studio · Independent Album</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Knotless Braids, Locs Retwist & Bridal Kwanjula Styling
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
            Authentic African hair craftsmanship. Weightless golden cuffed knotless braids, clarifying beeswax dreadlocks retwists, bouncy bohemian passion twists, and red-carpet scalp detoxes.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-stone-950/80 border border-stone-800 px-4 py-2 rounded-2xl text-center shadow-lg">
            <div className="text-lg font-bold font-mono text-amber-400">{HAIR_GALLERY.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Hair Specialties</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none bg-stone-950/80 p-3 rounded-2xl border border-stone-800 shadow-inner">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
          Hair Technique:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-400 text-stone-950 shadow-xs font-bold'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Hair Styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStyles.map((item) => {
          const matchedProvider =
            providers.find((p) => p.businessName.toLowerCase().includes(item.salon.split(' ')[0].toLowerCase())) ||
            providers[1] ||
            providers[0];

          return (
            <article
              key={item.id}
              className="group bg-stone-950/70 backdrop-blur-md rounded-2xl border border-stone-800 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Showcase */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-950 cursor-pointer" onClick={() => setZoomHair(item)}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-400/30">
                  {item.styleType}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomHair(item);
                  }}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black backdrop-blur-md text-white p-1.5 rounded-full transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Zoom hairstyle"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-3 right-3 bg-amber-400 text-stone-950 text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-md">
                  UGX {item.priceUgx.toLocaleString()}
                </div>
                <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur-md text-stone-300 text-[10px] font-medium px-2 py-0.5 rounded border border-stone-800">
                  Length: {item.hairLength}
                </div>
              </div>

              {/* Information */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] text-amber-400 font-semibold mb-1">
                    {item.salon}
                  </div>
                  <h3 className="font-serif font-bold text-white text-lg leading-snug group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{item.durationMinutes} mins</span>
                    </span>
                    <span className="font-medium text-stone-300">Lead: {item.artist}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => matchedProvider && onSelectHairStyle(item, matchedProvider)}
                      className="flex-1 py-2 px-3 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md"
                    >
                      <span>Book Hairstyle</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomHair(item)}
                      className="p-2 text-xs text-stone-300 bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer border border-stone-800"
                      title="Inspect hairstyle detail"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox for Hair Style Zoom */}
      {zoomHair && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fade-in">
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-stone-900">
              <img
                src={zoomHair.image}
                alt={zoomHair.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setZoomHair(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-stone-950/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg">
                Type: {zoomHair.styleType} · Length: {zoomHair.hairLength}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-amber-800 font-semibold">{zoomHair.salon}</div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">{zoomHair.title}</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-mono font-bold text-stone-900">
                    UGX {zoomHair.priceUgx.toLocaleString()}
                  </div>
                  <div className="text-xs text-stone-500">{zoomHair.durationMinutes} min session</div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {zoomHair.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {zoomHair.tags.map((tag) => (
                  <span key={tag} className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-md font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setZoomHair(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const matchedProvider =
                      providers.find((p) => p.businessName.toLowerCase().includes(zoomHair.salon.split(' ')[0].toLowerCase())) ||
                      providers[1] ||
                      providers[0];
                    if (matchedProvider) {
                      onSelectHairStyle(zoomHair, matchedProvider);
                      setZoomHair(null);
                    }
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-amber-950 hover:bg-amber-900 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Book This Hairstyle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
