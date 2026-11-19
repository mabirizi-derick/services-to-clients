import React from 'react';
import { Compass, Navigation, Award, MessageSquare, Bell, User as UserIcon, Monitor, Sparkles, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-0 sm:py-8 sm:px-4">
      {/* Top Bar Switcher to return to desktop */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between pb-3 text-stone-300 text-xs">
        <span className="font-serif font-bold text-stone-100">GlamTrack Uganda · iOS & Android</span>
        <button
          onClick={onExitMobileView}
          className="flex items-center gap-1.5 text-stone-300 hover:text-white px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit to Full Website</span>
        </button>
      </div>

      {/* Simulated Smartphone Frame */}
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[844px] bg-[#FAF9F6] sm:rounded-[44px] sm:border-[8px] sm:border-stone-800 sm:shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Phone Notch & Status Bar */}
        <div className="h-10 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between text-xs font-semibold text-stone-900 shrink-0 border-b border-stone-100 select-none">
          <span>9:41</span>
          <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>MTN 5G</span>
            <div className="w-5 h-2.5 border border-stone-800 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-stone-800 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-stone-900">GlamTrack UG</span>
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
              Kampala GPS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-700 hover:text-stone-900 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenAuth}
              className="p-2 text-stone-700 hover:text-stone-900 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {children}
        </div>

        {/* Fixed Ergonomic Bottom Tab Bar (15% cap compliant, 44px min targets) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-stone-200 grid grid-cols-5 items-center z-40">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'explore' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Salons</span>
          </button>

          <button
            onClick={() => setActiveTab('nail_art')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'nail_art' ? 'text-rose-600 font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Nails</span>
          </button>

          <button
            onClick={() => setActiveTab('hair_gallery')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'hair_gallery' ? 'text-amber-700 font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Award className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Hair</span>
          </button>

          <button
            onClick={() => setActiveTab('gps')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors relative ${
              activeTab === 'gps' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Navigation className="w-5 h-5 mb-0.5 rotate-45" />
            <span className="text-[10px]">GPS</span>
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
              activeTab === 'admin' ? 'text-emerald-700 font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
};
