import React from 'react';
import { Mail, Phone, MapPin, Code2, ShieldCheck, Heart, Clock, Sparkles, ExternalLink, MessageCircle, Smartphone, CheckCircle2 } from 'lucide-react';

interface DeveloperAndSupportSectionProps {
  onOpenAuth: () => void;
  onOpenLiveGps: () => void;
}

export const DeveloperAndSupportSection: React.FC<DeveloperAndSupportSectionProps> = ({
  onOpenAuth,
  onOpenLiveGps,
}) => {
  return (
    <section className="bg-stone-950/80 backdrop-blur-xl text-stone-200 py-10 sm:py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 sm:px-3.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Platform Engineering &amp; Kampala Operations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Banda Services · Developer &amp; 24/7 Support Hub
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Crafted with modern scalable web standards, local Ugandan mobile money rails, and 24/7 dedicated client support.
          </p>
        </div>

        {/* 3-Card Primary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
          
          {/* Card 1: About the Developer */}
          <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-amber-500/30 relative flex flex-col justify-between space-y-5 sm:space-y-6 shadow-xl hover:border-amber-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Lead Developer</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Kampala, UG
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Mabirizi Derick
                </h3>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  Full-Stack Software Engineer & Platform Architect
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                Engineered the Banda Services platform ecosystem using scalable Node.js server architecture, flexible MongoDB document datastores, cryptographic JWT authentication, and high-precision real-time GPS telemetry for Kampala mobile salon dispatch.
              </p>

              {/* Engineering Highlights */}
              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Modular TypeScript & Node.js scalable backend</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Integrated MTN MoMo & Airtel Money escrow rails</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Live satellite geolocation & ETA routing calculations</span>
                </div>
              </div>
            </div>

            {/* Developer Contact CTA */}
            <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <a
                href="mailto:mabiriziderick26@gmail.com"
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-white bg-amber-950/80 hover:bg-amber-900/90 px-3 py-2 rounded-xl transition-colors border border-amber-500/40 max-w-full"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">mabiriziderick26@gmail.com</span>
              </a>
              <span className="text-[11px] text-stone-400 shrink-0">Software Craftsman</span>
            </div>
          </div>

          {/* Card 2: 24/7 Kampala Customer Support */}
          <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-stone-800 relative flex flex-col justify-between space-y-5 sm:space-y-6 shadow-xl hover:border-emerald-500/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Customer Support & Dispatch</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Dispatch Active
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Kampala Help & Escrow Desk
                </h3>
                <div className="text-xs text-stone-400 mt-0.5">
                  Available daily 7:00 AM – 10:30 PM EAT
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Central Operations Hub</div>
                    <div className="text-stone-400 text-[11px]">Plot 14 Acacia Avenue, Kololo, Kampala, Uganda</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Direct Phone Hotlines</div>
                    <div className="text-stone-400 text-[11px]">+256 701 234 567 (MTN) · +256 772 345 678 (Airtel)</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Inquiries & Escrow Support</div>
                    <div className="text-stone-400 text-[11px]">support@bandaservices.ug · escrow@bandaservices.ug</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Actions */}
            <div className="pt-4 border-t border-stone-800 flex items-center gap-3">
              <a
                href="tel:+256701234567"
                className="flex-1 py-2 px-3 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors text-center cursor-pointer shadow-md"
              >
                Call Hotline
              </a>
              <button
                onClick={onOpenLiveGps}
                className="flex-1 py-2 px-3 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors text-center cursor-pointer border border-stone-700"
              >
                Track Dispatch
              </button>
            </div>
          </div>

          {/* Card 3: Brand & Security Assurance */}
          <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-stone-800 relative flex flex-col justify-between space-y-5 sm:space-y-6 shadow-xl hover:border-amber-400/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Platform Authenticity</span>
                </div>
                <span className="text-[10px] font-mono bg-stone-950 text-stone-400 border border-stone-800 px-2 py-0.5 rounded-full">
                  v2.5 Production
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  BANDA SERVICES
                </h3>
                <div className="text-xs text-stone-400 mt-0.5">
                  Official Website: bandaservices.ug
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                The authoritative on-demand beauty booking system for Kampala, connecting patrons with certified nail artists and African hair braiders at home, student hostels, or salons. Protected with MTN and Airtel Mobile Money escrow.
              </p>

              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5 text-[11px] text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Payment Security:</span>
                  <span className="font-semibold text-amber-300">MTN MoMo & Airtel Escrow</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Service Coverage:</span>
                  <span className="font-semibold text-stone-200">Greater Kampala Metro</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Average ETA:</span>
                  <span className="font-semibold text-emerald-400">15–20 Minutes</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 px-4 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Sign In to Customer Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
