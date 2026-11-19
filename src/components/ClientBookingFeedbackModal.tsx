import React from 'react';
import { Booking, Provider } from '../types/index.ts';
import { CheckCircle2, XCircle, MapPin, Clock, Phone, Sparkles, Navigation, ArrowRight, RefreshCw, Star } from 'lucide-react';

interface ClientBookingFeedbackModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackGps: () => void;
  onChooseAlternativeProvider?: () => void;
}

export const ClientBookingFeedbackModal: React.FC<ClientBookingFeedbackModalProps> = ({
  booking,
  isOpen,
  onClose,
  onTrackGps,
  onChooseAlternativeProvider,
}) => {
  if (!isOpen || !booking) return null;

  const isAccepted = booking.status === 'accepted' || booking.status === 'confirmed' || booking.status === 'en_route';
  const isDeclined = booking.status === 'declined' || booking.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-stone-900 text-stone-100 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-700/80 overflow-hidden my-2 sm:my-6 flex flex-col max-h-[92vh]">
        
        {/* Header Banner */}
        <div
          className={`px-4 sm:px-6 py-4 sm:py-5 border-b flex items-center gap-3 shrink-0 ${
            isAccepted
              ? 'bg-gradient-to-r from-emerald-950 via-stone-950 to-emerald-950 border-emerald-500/30'
              : 'bg-gradient-to-r from-rose-950 via-stone-950 to-rose-950 border-rose-500/30'
          }`}
        >
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isAccepted
                ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/30'
                : 'bg-rose-500 text-white shadow-rose-500/30'
            }`}
          >
            {isAccepted ? (
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            ) : (
              <XCircle className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            )}
          </div>

          <div className="min-w-0">
            <div
              className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                isAccepted ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isAccepted ? 'FEEDBACK: PROVIDER IS AVAILABLE' : 'FEEDBACK: PROVIDER NOT AVAILABLE'}
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
              {isAccepted ? 'Booking Confirmed & Dispatched!' : 'Stylist Unavailable at This Time'}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Main Feedback Message */}
          {isAccepted ? (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 text-xs space-y-2">
              <div className="text-emerald-200 font-medium leading-relaxed">
                <span className="font-bold text-white">{booking.providerName}</span> answered your dispatch and is <span className="text-emerald-400 font-bold">AVAILABLE</span>!
              </div>
              <div className="text-stone-300 text-[11px] leading-relaxed">
                Your artist has accepted the session and is preparing tools for dispatch to your location at <span className="text-white font-medium">{booking.address}</span>.
              </div>
            </div>
          ) : (
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 text-xs space-y-2">
              <div className="text-rose-200 font-medium leading-relaxed">
                <span className="font-bold text-white">{booking.providerName}</span> responded that they are <span className="text-rose-400 font-bold">NOT AVAILABLE</span> for this slot (currently attending another client or offline).
              </div>
              <div className="text-stone-300 text-[11px] leading-relaxed">
                No worries! Kampala has certified nearby service providers ready to take your appointment immediately.
              </div>
            </div>
          )}

          {/* Booking Summary Card */}
          <div className="bg-stone-950/80 rounded-2xl p-3.5 sm:p-4 border border-stone-800 space-y-3 text-xs">
            <div className="flex items-start justify-between gap-3 pb-2 border-b border-stone-800">
              <span className="text-stone-400 font-medium shrink-0">Service Provider</span>
              <span className="text-white font-semibold text-right break-words">{booking.providerName}</span>
            </div>

            <div className="flex items-start justify-between gap-3 pb-2 border-b border-stone-800">
              <span className="text-stone-400 font-medium shrink-0">Destination</span>
              <span className="text-stone-200 text-right break-words max-w-[65%]">{booking.address}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-stone-400 font-medium shrink-0">Services</span>
              <span className="text-amber-400 font-semibold text-right break-words max-w-[65%]">{booking.services.map((s) => s.name).join(', ')}</span>
            </div>
          </div>

          {/* Next Steps Prompt */}
          {isAccepted ? (
            <div className="flex items-center gap-2 p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Estimated travel time: ~{booking.etaMinutes || 20} minutes to your doorstep.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300">
              <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
              <span>We recommend choosing another certified provider from the Kampala directory.</span>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 shrink-0">
          {isAccepted ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTrackGps();
                }}
                className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Track Provider on GPS</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Close
              </button>
              {onChooseAlternativeProvider && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onChooseAlternativeProvider();
                  }}
                  className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Choose Another Provider</span>
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
