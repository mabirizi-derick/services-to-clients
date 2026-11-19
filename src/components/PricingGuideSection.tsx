import React from 'react';
import { Tag, Check, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export const PricingGuideSection: React.FC = () => {
  const tiers = [
    {
      category: 'Nail Artistry & Manicures',
      items: [
        { service: 'Classic Gel Polish & Russian E-File Cleanse', price: 'USh 35,000 – 45,000', time: '45 mins' },
        { service: 'Hand-Painted Cherry & French Line Art', price: 'USh 48,000 – 55,000', time: '65 mins' },
        { service: '3D Sculpted Acrylic Flowers & Pearl Charms', price: 'USh 55,000 – 65,000', time: '85 mins' },
        { service: '24K Gold Leaf & Emerald Quartz Marble Set', price: 'USh 65,000 – 75,000', time: '75 mins' },
        { service: 'Luxury Botanical Nilotica Shea Butter Pedicure', price: 'USh 50,000 – 60,000', time: '60 mins' },
      ],
    },
    {
      category: 'African Hairmaking & Braiding',
      items: [
        { service: 'Waist-Length Knotless Box Braids (Gold Cuffs)', price: 'USh 110,000 – 130,000', time: '3.0 hrs' },
        { service: 'Architectural Dreadlocks Retwist (Beeswax)', price: 'USh 80,000 – 95,000', time: '1.5 hrs' },
        { service: 'Bohemian Goddess Passion Twists', price: 'USh 105,000 – 120,000', time: '2.5 hrs' },
        { service: 'Red-Carpet Silk Press & Scalp Steam Detox', price: 'USh 70,000 – 85,000', time: '1.2 hrs' },
        { service: 'Ugandan Kwanjula & Wedding Bridal Sculpted Updo', price: 'USh 180,000 – 250,000', time: '3.5 hrs' },
      ],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Hidden Fees</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Transparent Kampala Beauty Pricing Guide
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl leading-relaxed">
            Standardized, honest rates across our Kololo, Bukoto, Bugolobi, Nakasero, and hostel mobile networks. All quotes in Ugandan Shillings (UGX).
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-amber-300 bg-stone-900/90 border border-stone-800 px-3.5 py-2 rounded-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Includes standard mobile sanitization kit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 overflow-hidden shadow-xl"
          >
            <div className="bg-stone-950/80 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <h3 className="font-serif font-bold text-white text-lg">
                {tier.category}
              </h3>
              <span className="text-[11px] font-mono text-amber-400 font-semibold bg-amber-950/70 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Standard Rates
              </span>
            </div>

            <div className="p-6 divide-y divide-stone-800/80">
              {tier.items.map((item, i) => (
                <div key={i} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-stone-200">
                      {item.service}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Est. duration: {item.time}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono tabular-nums text-xs sm:text-sm font-bold text-amber-300">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
