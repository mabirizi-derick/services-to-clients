import React, { useState } from 'react';
import { Provider, ServiceItem, Booking } from '../types/index.ts';
import { X, Check, ShieldCheck, Zap, Calendar, MapPin, Sparkles, AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { api } from '../api/client.ts';

interface BookingPaymentModalProps {
  provider: Provider;
  preSelectedService?: ServiceItem;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking, pointsEarned: number) => void;
}

export const BookingPaymentModal: React.FC<BookingPaymentModalProps> = ({
  provider,
  preSelectedService,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  // Selected Services
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>(
    preSelectedService
      ? [preSelectedService]
      : provider.services && provider.services.length > 0
      ? [provider.services[0]]
      : []
  );

  // Booking Type & Details
  const [bookingType, setBookingType] = useState<'on_demand' | 'scheduled'>('on_demand');
  const [scheduledDate, setScheduledDate] = useState('Today, 4:30 PM');
  const [address, setAddress] = useState('Plot 14 Acacia Avenue, Kololo, Kampala');
  const [customerPhone, setCustomerPhone] = useState('+256 772 392 881');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Toggle service selection
  const handleToggleService = (service: ServiceItem) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      if (selectedServices.length === 1) return; // Keep at least one selected
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  const handleBookNow = async () => {
    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one service to book.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please provide a delivery address for your house or hostel call.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      // Create booking record directly without payment processing
      const bookingRes = await api.createBooking({
        providerId: provider._id,
        services: selectedServices,
        bookingType,
        scheduledTime: bookingType === 'scheduled' ? scheduledDate : undefined,
        address,
        specialNotes: notes,
        paymentMethod: 'pay_on_service',
        customerPhone,
      });

      onBookingSuccess(bookingRes.booking, bookingRes.pointsEarned || 50);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 text-stone-100 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-700/80 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80 shrink-0">
          <div className="min-w-0 pr-2">
            <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400">
              On-Demand Dispatch Checkout
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white truncate">
              {provider.businessName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Select Services (Prices Removed) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                1. Select Services
              </div>
              <div className="text-xs text-stone-400 font-sans">
                {selectedServices.length} selected · ~{totalDuration} mins total
              </div>
            </div>

            <div className="space-y-2">
              {provider.services.map((service) => {
                const isSelected = selectedServices.some((s) => s.id === service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-400/80 bg-stone-950/90 shadow-md ring-1 ring-amber-400/30'
                        : 'border-stone-800 bg-stone-950/50 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-400 border-amber-400 text-stone-950' : 'border-stone-600 bg-stone-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {service.name}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {service.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Duration only - Prices removed */}
                    <div className="text-right pl-3 shrink-0">
                      <span className="text-xs text-amber-300 font-mono font-medium bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        {service.durationMinutes} min
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Timing & Delivery Location */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 font-semibold">
              2. Timing & Delivery Location
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-3">
              <button
                type="button"
                onClick={() => setBookingType('on_demand')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  bookingType === 'on_demand'
                    ? 'border-amber-400/80 bg-stone-950 text-white shadow-md ring-1 ring-amber-400/30'
                    : 'border-stone-800 text-stone-300 bg-stone-950/50 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                  <Zap className={`w-3.5 h-3.5 ${bookingType === 'on_demand' ? 'text-amber-400 fill-amber-400' : 'text-stone-400'}`} />
                  <span>Instant Dispatch</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Arrives in ~{provider.estimatedArrivalMinutes} mins
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('scheduled')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  bookingType === 'scheduled'
                    ? 'border-amber-400/80 bg-stone-950 text-white shadow-md ring-1 ring-amber-400/30'
                    : 'border-stone-800 text-stone-300 bg-stone-950/50 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Schedule Ahead</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Pick date &amp; time slot
                </div>
              </button>
            </div>

            {bookingType === 'scheduled' && (
              <div className="mb-3">
                <label className="block text-[11px] font-medium text-stone-300 mb-1">
                  Preferred Appointment Date & Time
                </label>
                <input
                  type="text"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  placeholder="e.g. Tomorrow, 2:00 PM"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            )}

            {/* Address Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-300 mb-1">
                  House / Hostel / Office Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address for house call or hostel (e.g. Olympia Hostel, Kikoni)..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Customer Phone for Arrival Call */}
              <div>
                <label className="block text-[11px] font-medium text-stone-300 mb-1">
                  Contact Phone Number (For Stylist Arrival Call)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+256 772 000 000"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-[11px] font-medium text-stone-300 mb-1">
                  Special Notes or Custom Requests (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Room 204, gate passcode, preferred nail color, extra extensions..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Box (Without Prices) */}
          <div className="p-4 bg-stone-950/80 rounded-xl space-y-2 text-xs text-stone-300 border border-stone-800">
            <div className="flex items-center justify-between text-white font-medium">
              <span>Selected Services ({selectedServices.length})</span>
              <span className="text-amber-400">~{totalDuration} mins session</span>
            </div>
            <div className="text-[11px] text-stone-400">
              {selectedServices.map((s) => s.name).join(' · ')}
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-medium pt-2 border-t border-stone-800/80 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>You earn Banda Services Loyalty points upon completion</span>
            </div>
          </div>
        </div>

        {/* Modal Footer with Book Now CTA */}
        <div className="px-4 sm:px-6 py-4 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant Dispatch Guaranteed</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 sm:py-2 text-xs font-medium text-stone-300 bg-stone-900 sm:bg-transparent border border-stone-800 sm:border-transparent rounded-xl hover:text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBookNow}
              disabled={isSubmitting || selectedServices.length === 0}
              className="flex-1 sm:flex-initial px-7 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 text-center"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Booking...
                </span>
              ) : (
                <span>Book Now</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
