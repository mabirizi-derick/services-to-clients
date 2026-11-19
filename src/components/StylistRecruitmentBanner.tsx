import React from 'react';
import { Sparkles, DollarSign, Calendar, Navigation, ArrowRight } from 'lucide-react';

interface StylistRecruitmentBannerProps {
  onJoinAsProvider: () => void;
}

export const StylistRecruitmentBanner: React.FC<StylistRecruitmentBannerProps> = ({
  onJoinAsProvider,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-white border border-stone-800 shadow-xl relative overflow-hidden">
        {/* Decorative ambient elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>For Nail Techs, Stylists &amp; Salons</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
              Are you a talented nail technician or hair stylist in Uganda?
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              Fill your open slots with premium on-demand clients across Kololo, Bukoto, Bugolobi, and Nakasero. Get instant automated payouts directly to your MTN or Airtel Mobile Money account after every completed booking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant MoMo Payouts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Set Your Own Schedule</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Navigation className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Smart GPS Route Dispatch</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-start lg:items-end">
            <button
              onClick={onJoinAsProvider}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Join GlamTrack Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-stone-400 text-center lg:text-right w-full">
              Free listing · 0 UGX setup fee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
