import React, { useState } from 'react';
import { User, NotificationItem } from '../types/index.ts';
import { Bell, Smartphone, Monitor, User as UserIcon, Sparkles, ShieldCheck, Home, Menu, X, Scissors, MapPin } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'nail_art' | 'hair_gallery' | 'gps' | 'loyalty' | 'reviews' | 'admin' | 'provider';
  setActiveTab: (tab: 'explore' | 'nail_art' | 'hair_gallery' | 'gps' | 'loyalty' | 'reviews' | 'admin' | 'provider') => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  notifications: NotificationItem[];
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenNotifications,
  notifications,
  isMobileView,
  setIsMobileView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavClick = (tab: NavbarProps['activeTab']) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-xl border-b border-stone-800/80 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Luxury Brand Emblem + BANDA SERVICES Wordmark + Dedicated Home Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => handleNavClick('explore')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            {/* Prestige Gold Logo Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
                  BANDA SERVICES
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase font-bold tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  UGANDA
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-medium">
                Kampala On-Demand Beauty
              </span>
            </div>
          </button>

          {/* Dedicated Elevated Home Button */}
          <button
            onClick={() => handleNavClick('explore')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-amber-500/20 ring-1 ring-amber-300'
                : 'bg-stone-900/90 hover:bg-stone-850 text-stone-300 border border-stone-800 hover:border-amber-400/50 hover:text-white'
            }`}
            title="Go to Homepage"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>

        {/* Zone 2: Clean Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold text-stone-300">
          <button
            onClick={() => handleNavClick('explore')}
            className={`transition-all py-1 cursor-pointer ${
              activeTab === 'explore'
                ? 'text-amber-300 border-b-2 border-amber-400 font-bold drop-shadow-sm'
                : 'hover:text-white text-stone-300'
            }`}
          >
            Salons & Stylists
          </button>

          <button
            onClick={() => handleNavClick('nail_art')}
            className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nail_art'
                ? 'text-rose-300 border-b-2 border-rose-400 font-bold drop-shadow-sm'
                : 'hover:text-rose-200 text-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Nail Art Studio</span>
          </button>

          <button
            onClick={() => handleNavClick('hair_gallery')}
            className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hair_gallery'
                ? 'text-amber-300 border-b-2 border-amber-400 font-bold drop-shadow-sm'
                : 'hover:text-amber-200 text-stone-300'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>Hair & Braids</span>
          </button>

          <button
            onClick={() => handleNavClick('gps')}
            className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gps'
                ? 'text-emerald-300 border-b-2 border-emerald-400 font-bold drop-shadow-sm'
                : 'hover:text-white text-stone-300'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live GPS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => handleNavClick('loyalty')}
            className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'loyalty'
                ? 'text-amber-300 border-b-2 border-amber-400 font-bold drop-shadow-sm'
                : 'hover:text-white text-stone-300'
            }`}
          >
            <span>Privilege Club</span>
            {user && (
              <span className="text-[10px] font-mono tabular-nums bg-amber-950/80 border border-amber-500/40 text-amber-300 px-1.5 py-0.5 rounded-full">
                {user.loyaltyPoints} pts
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('provider')}
            className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'provider'
                ? 'text-amber-300 border-b-2 border-amber-400 font-bold drop-shadow-sm'
                : 'hover:text-amber-300 text-stone-300'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Stylist Mode</span>
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'text-emerald-300 border-b-2 border-emerald-400 font-bold drop-shadow-sm'
                : 'hover:text-emerald-300 text-emerald-400/90'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dual View Toggle */}
          <button
            onClick={() => setIsMobileView(!isMobileView)}
            title={isMobileView ? 'Switch to Full Website View' : 'Switch to Mobile App View'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            {isMobileView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Web View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">App View</span>
              </>
            )}
          </button>

          {/* Push Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Push Notifications"
            className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-900/90 border border-stone-800 hover:border-stone-700 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center font-mono ring-2 ring-stone-950">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Sign In / Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md shadow-amber-500/10 ring-1 ring-amber-300"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{user && user.name ? user.name.split(' ')[0] : user ? 'Profile' : 'Sign In'}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-300 hover:text-white hover:bg-stone-900 rounded-xl border border-stone-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950/95 border-b border-stone-800 px-4 py-4 space-y-2 backdrop-blur-2xl">
          <button
            onClick={() => handleNavClick('explore')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'explore' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home · All Salons & Stylists</span>
          </button>

          <button
            onClick={() => handleNavClick('nail_art')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'nail_art' ? 'bg-rose-500 text-white font-bold' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Nail Art Studio (Independent Lookbook)</span>
          </button>

          <button
            onClick={() => handleNavClick('hair_gallery')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hair_gallery' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Hair & Braids (Knotless & Locs)</span>
          </button>

          <button
            onClick={() => handleNavClick('gps')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'gps' ? 'bg-emerald-500 text-white font-bold' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Live GPS Telemetry Tracker</span>
          </button>

          <button
            onClick={() => handleNavClick('loyalty')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'loyalty' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Privilege Club & Rewards</span>
          </button>

          <button
            onClick={() => handleNavClick('provider')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'provider' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-amber-300 hover:bg-stone-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Stylist Mode (Incoming Dispatch Alerts)</span>
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'admin' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:bg-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </div>
      )}
    </header>
  );
};
