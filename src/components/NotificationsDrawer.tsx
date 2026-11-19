import React, { useState } from 'react';
import { NotificationItem } from '../types/index.ts';
import { X, Bell, Sparkles, Navigation, Calendar, Zap } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onSimulatePush: (title: string, body: string, type?: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onSimulatePush,
}) => {
  const [permStatus, setPermStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermStatus(perm);
        if (perm === 'granted') {
          new Notification('Banda Services Push Notifications Active', {
            body: 'You will receive real-time GPS tracking and stylist arrival alerts.',
            icon: '/src/assets/images/salon_manicure_luxury_1791273765852.jpg',
          });
        }
      } catch (e) {
        console.warn('Notification permission request failed', e);
      }
    }
  };

  const handleSendTestPush = () => {
    onSimulatePush(
      'Camille Nabatanzi is 3 minutes away! 🚗',
      'Your nail artist is arriving at Acacia Avenue with sterilized tools.',
      'tracking'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tracking':
        return <Navigation className="w-4 h-4 text-emerald-400 rotate-45" />;
      case 'loyalty':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-amber-300" />;
      default:
        return <Bell className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-stone-900 text-stone-100 h-full shadow-2xl flex flex-col border-l border-stone-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/90">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white">
              Push Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification Controls Card */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-200">Browser Push Alerts:</span>
            <span className="font-mono uppercase text-[11px] px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700">
              {permStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRequestPushPermission}
              className="py-2 px-3 text-xs font-medium rounded-xl bg-stone-900 border border-stone-700 text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Enable Notifications
            </button>
            <button
              onClick={handleSendTestPush}
              className="py-2 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{testSent ? 'Sent!' : 'Simulate Alert'}</span>
            </button>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No notifications yet. You'll receive live alerts when you book a stylist!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => onMarkRead(item._id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-stone-950/50 border-stone-800/80 text-stone-400'
                    : 'bg-stone-950/90 border-amber-500/40 font-medium text-white shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 shrink-0">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                      <span className="truncate">{item.title}</span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-stone-300 leading-snug">
                      {item.body}
                    </p>
                    <div className="text-[10px] text-stone-500 mt-1 font-mono">
                      {new Date(item.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/90 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-stone-200 bg-stone-800 border border-stone-700 rounded-xl hover:bg-stone-700 cursor-pointer transition-colors"
          >
            Close Feed
          </button>
        </div>

      </div>
    </div>
  );
};
