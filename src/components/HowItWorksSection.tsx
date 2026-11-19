import React from 'react';
import { Sparkles, Navigation, ShieldCheck, Smartphone, CheckCircle2, Clock } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-stone-800/80">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Seamless On-Demand Beauty Dispatch</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          How Banda Services Uganda Works
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
          From booking intricate hand-painted nail art sets to receiving certified African hair braiding at your residence or hostel in under 25 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Step 1 */}
        <div className="bg-stone-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-stone-800 shadow-xl relative group hover:border-amber-400/50 hover:bg-stone-800/90 transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-mono font-bold flex items-center justify-center text-base mb-4 sm:mb-5 shadow-lg shadow-amber-500/20">
              01
            </div>
            <h3 className="font-serif font-bold text-white text-lg mb-2">
              Select Service &amp; Artist
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Browse certified nail studios and hair architects across Kampala (Kololo, Bukoto, Nakasero, Bugolobi). Pick from 16+ verified nail art styles and braiding looks.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] font-mono text-amber-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Curated Ugandan talent</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-stone-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-stone-800 shadow-xl relative group hover:border-amber-400/50 hover:bg-stone-800/90 transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-mono font-bold flex items-center justify-center text-base mb-4 sm:mb-5 shadow-lg shadow-amber-500/20">
              02
            </div>
            <h3 className="font-serif font-bold text-white text-lg mb-2">
              Instant House Call or Hostel
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Request an on-demand dispatch directly to your home, hostel, or office in 15–20 minutes, or reserve a private VIP booth at the salon.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] font-mono text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Fast 15–20 min dispatch</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-stone-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-stone-800 shadow-xl relative group hover:border-emerald-400/50 hover:bg-stone-800/90 transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-stone-950 font-mono font-bold flex items-center justify-center text-base mb-4 sm:mb-5 shadow-lg shadow-emerald-500/20">
              03
            </div>
            <h3 className="font-serif font-bold text-white text-lg mb-2">
              Real-Time GPS Tracking
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Watch your technician travel live on the interactive Kampala map across Acacia Avenue or Lugogo Bypass with minute-by-minute satellite ETA updates.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] font-mono text-emerald-300">
            <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Live route telemetry</span>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-stone-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-stone-800 shadow-xl relative group hover:border-amber-400/50 hover:bg-stone-800/90 transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-mono font-bold flex items-center justify-center text-base mb-4 sm:mb-5 shadow-lg shadow-amber-500/20">
              04
            </div>
            <h3 className="font-serif font-bold text-white text-lg mb-2">
              Direct Stylist Confirmation
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Receive instant ring-alert confirmation when your stylist accepts your dispatch, plus seamless tracking right up to your doorstep.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] font-mono text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Verified Kampala Artisans</span>
          </div>
        </div>
      </div>
    </section>
  );
};
