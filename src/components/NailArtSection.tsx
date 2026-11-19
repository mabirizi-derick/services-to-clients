import React, { useState } from 'react';
import { NAIL_ART_GALLERY, NailArtItem } from '../data/nailArtGallery.ts';
import { Provider } from '../types/index.ts';
import { Sparkles, Clock, ChevronRight, ShieldCheck, Tag, ZoomIn, X, Check } from 'lucide-react';

interface NailArtSectionProps {
  providers: Provider[];
  onSelectNailLook: (item: NailArtItem, provider: Provider) => void;
}

export const NailArtSection: React.FC<NailArtSectionProps> = ({
  providers,
  onSelectNailLook,
}) => {
  const [selectedTechnique, setSelectedTechnique] = useState<string>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [zoomItem, setZoomItem] = useState<NailArtItem | null>(null);

  const techniques = [
    { id: 'all', label: 'All Nail Art' },
    { id: 'Hand-Painted', label: 'Hand-Painted' },
    { id: 'Marble & Gold Leaf', label: 'Marble & Gold Leaf' },
    { id: '3D Floral & Pearls', label: '3D Flowers & Charms' },
    { id: 'African Tribal Art', label: 'African Tribal Art' },
    { id: 'Ombre & Glitter', label: 'Ombre & Glitter' },
    { id: 'French Tip Art', label: 'French & Chrome' },
    { id: 'Russian E-File', label: 'Russian Manicure' },
    { id: 'Pedicure Art', label: 'Pedicure Art' },
  ];

  const shapes = ['all', 'Almond', 'Square', 'Coffin', 'Stiletto', 'Short Natural'];

  const filteredItems = NAIL_ART_GALLERY.filter((item) => {
    if (selectedTechnique !== 'all' && item.technique !== selectedTechnique) return false;
    if (selectedShape !== 'all' && item.shape !== selectedShape) return false;
    return true;
  });

  return (
    <section id="nail-art-studio" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-300 bg-amber-950/70 border border-amber-800/60 px-3 py-1 rounded-full mb-2.5 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Dedicated Nail Art Studio · Kampala</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Hand-Painted Nail Art, 3D Sculptures &amp; Custom Gel Paints
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
            Independent, standalone nail painting portfolio. Hand-painted cherries, genuine 24K gold foil marble, 3D turquoise blooms, Ugandan tribal geometry, and high-shine glazed chromes created by Kampala&apos;s premier nail artists.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-stone-900/90 border border-stone-800 px-4 py-2 rounded-2xl text-center shadow-lg flex items-center gap-2 sm:block">
            <div className="text-base sm:text-lg font-bold font-mono text-amber-400">{NAIL_ART_GALLERY.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Independent Sets</div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-3 bg-stone-900/85 backdrop-blur-md p-4 rounded-2xl border border-stone-800 shadow-xl">
        {/* Technique Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Art Style:
          </span>
          {techniques.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTechnique(t.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                selectedTechnique === t.id
                  ? 'bg-amber-400 text-stone-950 shadow-xs font-bold'
                  : 'bg-stone-950/70 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Shape Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-stone-800 text-xs scrollbar-none">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Nail Shape:
          </span>
          {shapes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedShape(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedShape === s
                  ? 'bg-stone-100 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {s === 'all' ? 'All Shapes' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Independent Nail Art Looks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const matchedProvider =
            providers.find((p) => p.businessName.toLowerCase().includes(item.salon.split(' ')[0].toLowerCase())) ||
            providers[0];

          return (
            <article
              key={item.id}
              className="group bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Showcase with Zoom Trigger */}
              <div className="relative aspect-square overflow-hidden bg-stone-950 cursor-pointer" onClick={() => setZoomItem(item)}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-2.5 left-2.5 bg-stone-950/85 backdrop-blur-md text-amber-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-amber-400/30">
                  {item.technique}
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomItem(item);
                  }}
                  className="absolute top-2.5 right-2.5 bg-black/75 hover:bg-black backdrop-blur-md text-white p-1.5 rounded-full transition-opacity opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                  title="Zoom painting detail"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-2.5 right-2.5 bg-amber-400 text-stone-950 text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-md">
                  USh {item.priceUgx.toLocaleString()}
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-stone-950/85 backdrop-blur-md text-stone-300 text-[10px] font-medium px-2 py-0.5 rounded border border-stone-800">
                  Shape: {item.shape}
                </div>
              </div>

              {/* Information */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] text-amber-400/90 font-medium mb-1">
                    {item.salon}
                  </div>
                  <h3 className="font-serif font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{item.durationMinutes} mins</span>
                    </span>
                    <span className="font-medium text-stone-300">Tech: {item.artist}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => matchedProvider && onSelectNailLook(item, matchedProvider)}
                      className="flex-1 py-2 px-3 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md"
                    >
                      <span>Book Look</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomItem(item)}
                      className="p-2 text-xs text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer border border-stone-700"
                      title="Inspect macro detail"
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

      {/* Lightbox Modal for Nail Detail Inspection */}
      {zoomItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-stone-900 text-stone-100 border border-stone-700 rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[92vh]">
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-stone-950 shrink-0">
              <img
                src={zoomItem.image}
                alt={zoomItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setZoomItem(null)}
                className="absolute top-3 right-3 bg-stone-950/80 hover:bg-stone-900 text-white p-2 rounded-full cursor-pointer transition-colors border border-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 bg-stone-950/90 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[11px] sm:text-xs px-3 py-1 rounded-lg">
                {zoomItem.technique} · {zoomItem.shape}
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                <div>
                  <div className="text-xs text-amber-400 font-medium">{zoomItem.salon}</div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">{zoomItem.title}</h3>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-base sm:text-lg font-mono font-bold text-amber-300">
                    USh {zoomItem.priceUgx.toLocaleString()}
                  </div>
                  <div className="text-xs text-stone-400">{zoomItem.durationMinutes} min appointment</div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {zoomItem.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {zoomItem.tags.map((tag) => (
                  <span key={tag} className="text-[11px] bg-stone-950 text-amber-300 border border-stone-800 px-2.5 py-0.5 rounded-md font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 sm:px-6 border-t border-stone-800 bg-stone-950 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 shrink-0">
              <button
                onClick={() => setZoomItem(null)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl transition-colors cursor-pointer text-center"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const matchedProvider =
                    providers.find((p) => p.businessName.toLowerCase().includes(zoomItem.salon.split(' ')[0].toLowerCase())) ||
                    providers[0];
                  if (matchedProvider) {
                    onSelectNailLook(zoomItem, matchedProvider);
                    setZoomItem(null);
                  }
                }}
                className="px-6 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-colors cursor-pointer shadow-md text-center"
              >
                Book This Look Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
