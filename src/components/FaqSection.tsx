import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How fast can a nail artist or hair stylist arrive at my location or hostel in Kampala?',
    a: 'On-demand dispatches typically arrive within 15 to 25 minutes depending on traffic. Our artists are stationed strategically in Kololo, Bukoto, Bugolobi, Nakasero, and near university student hostel corridors (Kikoni, Sir Apollo Kaggwa, Banda). You can track their vehicle live via satellite GPS from the moment they accept your dispatch.',
  },
  {
    q: 'How does in-app payment with MTN Mobile Money and Airtel Money work?',
    a: 'When you confirm your booking, you enter your MTN or Airtel phone number. An instant USSD prompt arrives directly on your handset (*165# for MTN, *185# for Airtel) asking for your PIN to authorize. All transactions are protected via escrow until your salon session is completed to your full satisfaction.',
  },
  {
    q: 'What hygiene and sterilization standards do mobile technicians follow?',
    a: 'Every artist on Banda Services carries sealed, hospital-grade autoclave sterilized metal instruments. Cuticle files, buffers, and toe separators are strictly single-use. Technicians also carry HEPA mobile nail dust extractors and organic antiseptic treatments.',
  },
  {
    q: 'Can I select a specific nail painting design from the lookbook?',
    a: 'Yes! Our lookbook features independent styles such as cherry red french tips, 3D turquoise floral nails with pearls, African tribal gold patterns, and pastel swirl acrylic sets. Simply click "Book This Look" on any style card, and the exact certified artist will be dispatched with the required pigments and crystals.',
  },
  {
    q: 'How does the Banda Services Privilege Club work?',
    a: 'You automatically earn 1 loyalty point for every UGX 500 spent on bookings, plus +50 bonus points for leaving verified reviews. Accumulated points can be redeemed instantly for discounts such as UGX 20,000 off manicures, free organic Nilotica shea butter foot treatments, or UGX 40,000 off knotless braids.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-stone-800">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mt-2">
          Clear answers about doorstep dispatch, payment escrow, and salon hygiene standards.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-3.5">
        {FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 overflow-hidden shadow-xl transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-stone-800/70 transition-colors"
              >
                <span className="text-xs sm:text-sm font-semibold text-stone-200">
                  {faq.q}
                </span>
                <span className="p-1 rounded-lg bg-stone-950/70 border border-stone-800 text-stone-400 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-stone-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
