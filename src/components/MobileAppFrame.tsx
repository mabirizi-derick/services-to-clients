import React from 'react';
import { Home, Navigation, Bell, Monitor, Sparkles, Scissors } from 'lucide-react';
import { User, NotificationItem } from '../types/index.ts';

interface MobileAppFrameProps {
  children: React.ReactNode;
  activeTab: 'explore' | 'nail_art' | 'hair_gallery' | 'gps' | 'loyalty' | 'reviews' | 'admin' | 'provider';
  setActiveTab: (tab: 'explore' | 'nail_art' | 'hair_gallery' | 'gps' | 'loyalty' | 'reviews' | 'admin' | 'provider') => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  notifications: NotificationItem[];
  onExitMobileView: () => void;
}

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({
  children,
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenNotifications,
  notifications,
  onExitMobileView,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-0 sm:py-8 sm:px-4">
      {/* Top Bar Switcher to return to desktop */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between pb-3 text-stone-300 text-xs">
        <span className="font-serif font-bold text-amber-300">BANDA SERVICES · Mobile App Preview</span>
        <button
          onClick={onExitMobileView}
          className="flex items-center gap-1.5 text-stone-300 hover:text-white px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5 text-amber-400" />
          <span>Exit to Full Website</span>
        </button>
      </div>

      {/* Simulated Smartphone Frame */}
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[844px] bg-stone-950 text-stone-100 sm:rounded-[44px] sm:border-[8px] sm:border-stone-800 sm:shadow-2xl overflow-hidden flex flex-col relative">
        {/* Phone Notch & Status Bar */}
        <div className="h-10 bg-stone-950/95 backdrop-blur-md px-6 flex items-center justify-between text-xs font-semibold text-stone-200 shrink-0 border-b border-stone-800/80 select-none">
          <span>9:41</span>
          <div className="w-24 h-4 bg-stone-900 border border-stone-800 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[11px] text-stone-300">
            <span>MTN 5G</span>
            <div className="w-5 h-2.5 border border-stone-500 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="px-4 py-2.5 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base font-serif font-black tracking-wide bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent truncate">
              BANDA SERVICES
            </span>
            <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold shrink-0">
              GPS
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-300 hover:text-white cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-stone-950 text-[11px] font-bold cursor-pointer"
            >
              {user?.name ? user.name.split(' ')[0] : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {children}
        </div>

        {/* Fixed Ergonomic Bottom Tab Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 grid grid-cols-5 items-center z-40">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'explore' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('nail_art')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'nail_art' ? 'text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Nails</span>
          </button>

          <button
            onClick={() => setActiveTab('hair_gallery')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'hair_gallery' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Scissors className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Hair</span>
          </button>

          <button
            onClick={() => setActiveTab('gps')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors relative ${
              activeTab === 'gps' ? 'text-emerald-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Navigation className="w-5 h-5 mb-0.5 rotate-45" />
            <span className="text-[10px]">GPS</span>
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('provider')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'provider' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bell className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Stylist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
