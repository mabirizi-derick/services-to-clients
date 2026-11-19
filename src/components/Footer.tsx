import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Code2, Globe, Clock, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'explore' | 'nail_art' | 'hair_gallery' | 'gps' | 'loyalty' | 'reviews' | 'admin' | 'provider') => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-12 sm:pt-16 pb-24 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Column 1: Website Name & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                BANDA SERVICES
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded font-bold">
                Kampala Network
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Uganda's pioneering on-demand salon dispatch platform. Bridging discerning clients to master nail technicians for intricate hand-painted gel art, plus African hair architects for knotless braids and dreadlocks with live satellite GPS precision.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-stone-900 border border-stone-800 text-stone-400 px-2.5 py-1 rounded-md">
                MTN MoMo (*165#)
              </span>
              <span className="text-[11px] bg-stone-900 border border-stone-800 text-stone-400 px-2.5 py-1 rounded-md">
                Airtel Money (*185#)
              </span>
              <span className="text-[11px] bg-stone-900 border border-stone-800 text-stone-400 px-2.5 py-1 rounded-md">
                Visa / Mastercard
              </span>
              <span className="text-[11px] bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 px-2.5 py-1 rounded-md font-semibold">
                Escrow Protected
              </span>
            </div>
          </div>

          {/* Column 2: Quick Platform Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Explore Services
            </div>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Salons Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('nail_art')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left font-medium text-rose-300/90"
                >
                  Nail Art Lookbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hair_gallery')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left font-medium text-amber-300/90"
                >
                  African Hair & Braids
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gps')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Live Satellite GPS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('loyalty')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privilege Loyalty Club
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Client Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer font-medium text-left"
                >
                  Admin: Add Salons
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support & Kampala Office (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Support & Kampala Dispatch
            </div>
            <ul className="text-xs space-y-2.5 text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Plot 14 Acacia Avenue, Kololo, Kampala, Uganda</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+256 701 234 567 / +256 772 345 678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@glamtrack.ug</span>
              </li>
              <li className="flex items-center gap-2 text-stone-400">
                <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Daily Dispatch: 7:00 AM – 10:30 PM EAT</span>
              </li>
            </ul>
          </div>

          {/* Column 4: About the Developer (3 cols) */}
          <div className="lg:col-span-3 space-y-3 p-4 bg-stone-900/90 rounded-2xl border border-stone-800">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-amber-400">
              <Code2 className="w-4 h-4" />
              <span>About the Developer</span>
            </div>

            <div>
              <div className="text-sm font-serif font-bold text-white">
                Mabirizi Derick
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Lead Full-Stack Software Engineer & Product Architect
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Architected the GlamTrack Uganda platform utilizing scalable Node.js server logic, flexible MongoDB document collections, JWT cryptosystems, and real-time GPS telemetry.
            </p>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
              <a
                href="mailto:mabiriziderick26@gmail.com"
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium underline flex items-center gap-1 text-[11px]"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>mabiriziderick26@gmail.com</span>
              </a>
              <span className="text-stone-500 text-[10px]">Kampala, UG</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-stone-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} BANDA SERVICES Uganda (bandaservices.ug). All rights reserved. Registered in Kampala, Uganda.
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
            <span>Kololo · Bukoto · Nakasero · Bugolobi · Ntinda</span>
            <span>Escrow Compliant</span>
            <button
              onClick={onOpenAuth}
              className="text-amber-400 hover:text-white transition-colors cursor-pointer font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
