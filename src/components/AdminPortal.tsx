import React, { useState } from 'react';
import { Provider, Booking, User, ServiceItem } from '../types/index.ts';
import { BEAUTY_GALLERY } from '../data/beautyGallery.ts';
import { Plus, Trash2, CheckCircle2, ShieldCheck, MapPin, Zap, Clock, DollarSign, Store, Sparkles, X, Phone, User as UserIcon, BarChart3 } from 'lucide-react';
import { api } from '../api/client.ts';
import { SiteTrafficAnalytics } from './SiteTrafficAnalytics.tsx';

interface AdminPortalProps {
  providers: Provider[];
  bookings: Booking[];
  onProviderAdded: (provider: Provider) => void;
  onProviderDeleted: (providerId: string) => void;
  onProviderUpdated: (provider: Provider) => void;
  onSelectProvider: (provider: Provider) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  providers,
  bookings,
  onProviderAdded,
  onProviderDeleted,
  onProviderUpdated,
  onSelectProvider,
}) => {
  const [adminView, setAdminView] = useState<'traffic' | 'providers'>('traffic');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State for Adding New Provider
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'nail_salon' | 'beauty_stylist' | 'mobile_stylist'>('nail_salon');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('Kololo, Kampala');
  const [address, setAddress] = useState('Acacia Avenue, Suite 4');
  const [phone, setPhone] = useState('+256 701 456 789');
  const [selectedImage, setSelectedImage] = useState(BEAUTY_GALLERY[0].image);
  const [isOnDemand, setIsOnDemand] = useState(true);
  const [etaMinutes, setEtaMinutes] = useState(20);
  const [pricingLevel, setPricingLevel] = useState<'$$' | '$$$' | '$$$$'>('$$$');

  // Services list in new provider
  const [serviceName, setServiceName] = useState('Bespoke Nail Art Painting');
  const [servicePrice, setServicePrice] = useState(70000); // UGX 70,000
  const [serviceDuration, setServiceDuration] = useState(60);

  const totalVolumeUgx = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !name.trim()) {
      setErrorMsg('Please enter both the salon business name and lead artist name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const newService: ServiceItem = {
        id: 'srv_' + Date.now(),
        name: serviceName,
        category: type === 'nail_salon' ? 'nail_salon' : 'beauty_stylist',
        price: servicePrice,
        durationMinutes: serviceDuration,
        description: 'Professional bespoke beauty treatment delivered with sterilized instruments.',
      };

      const payload: Partial<Provider> = {
        businessName,
        name,
        type,
        rating: 5.0,
        reviewsCount: 1,
        location: {
          address,
          city,
          lat: 0.3345,
          lng: 32.5892,
        },
        image: selectedImage,
        services: [newService],
        isOnDemandAvailable: isOnDemand,
        estimatedArrivalMinutes: etaMinutes,
        pricingLevel,
        tagline: tagline || 'Specialist in Ugandan and African luxury beauty artistry.',
        bio: bio || `${businessName} provides exquisite salon experiences and rapid on-demand dispatch across Kampala.`,
        badges: ['Verified Artisan', 'Hospital Sterilized', 'Escrow Protected'],
      };

      const res = await api.addProvider(payload);
      onProviderAdded(res.provider);
      setIsAddModalOpen(false);
      setSuccessMsg(`"${businessName}" successfully registered to Kampala network!`);
      setTimeout(() => setSuccessMsg(''), 4000);

      // Reset form
      setBusinessName('');
      setName('');
      setTagline('');
      setBio('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (providerId: string, pName: string) => {
    if (!confirm(`Are you sure you want to remove "${pName}" from the platform?`)) return;
    try {
      await api.deleteProvider(providerId);
      onProviderDeleted(providerId);
      setSuccessMsg(`Provider "${pName}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete provider');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Admin Title & Add Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Administrator Control Center · Uganda</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Platform Provider &amp; Service Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Admin dashboard for Mabirizi Derick — add, configure, and monitor salons and mobile artists across Kampala.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddModalOpen(true);
            setErrorMsg('');
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Provider</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admin Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-stone-900/85 backdrop-blur-xl p-5 rounded-2xl border border-stone-800 shadow-xl">
          <div className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Registered Salons
          </div>
          <div className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            {providers.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Kololo, Bukoto, Bugolobi, Nakasero</div>
        </div>

        <div className="bg-stone-900/85 backdrop-blur-xl p-5 rounded-2xl border border-stone-800 shadow-xl">
          <div className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Total Bookings
          </div>
          <div className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            {bookings.length}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">Live Kampala dispatches</div>
        </div>

        <div className="bg-stone-900/85 backdrop-blur-xl p-5 rounded-2xl border border-stone-800 shadow-xl">
          <div className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Gross Dispatched Volume
          </div>
          <div className="text-2xl font-serif font-bold text-amber-300 font-mono tabular-nums">
            UGX {totalVolumeUgx.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">MTN & Airtel MoMo + Cards</div>
        </div>

        <div className="bg-stone-900/85 backdrop-blur-xl p-5 rounded-2xl border border-stone-800 shadow-xl">
          <div className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider mb-1">
            On-Demand Active Artists
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-400 font-mono tabular-nums">
            {providers.filter((p) => p.isOnDemandAvailable).length} Available
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Ready for under 20m dispatch</div>
        </div>
      </div>

      {/* Admin Sub-Navigation: Site Visitors (Hourly/Daily/Weekly/Monthly) vs Providers */}
      <div className="grid grid-cols-2 sm:inline-flex gap-1.5 bg-stone-950/90 p-1.5 rounded-2xl border border-stone-800 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setAdminView('traffic')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminView === 'traffic'
              ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
              : 'text-stone-300 hover:text-white hover:bg-stone-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 shrink-0" />
          <span className="truncate">Site Visitors (Hourly / Daily / Weekly / Monthly)</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminView('providers')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminView === 'providers'
              ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20'
              : 'text-stone-300 hover:text-white hover:bg-stone-900'
          }`}
        >
          <Store className="w-4 h-4 shrink-0" />
          <span className="truncate">Salons &amp; Providers ({providers.length})</span>
        </button>
      </div>

      {adminView === 'traffic' ? (
        <SiteTrafficAnalytics />
      ) : (
        /* Existing Providers Management List (Mobile Cards + Desktop Table) */
        <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-white">
              Active Service Providers ({providers.length})
            </h3>
            <p className="text-xs text-stone-400">
              Manage salon profiles, pricing, and on-demand availability
            </p>
          </div>
        </div>

        {/* Mobile Stacked Cards (< md) */}
        <div className="md:hidden divide-y divide-stone-800">
          {providers.map((p) => (
            <div key={p._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-950 shrink-0 border border-stone-800">
                    <img
                      src={p.image}
                      alt={p.businessName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{p.businessName}</div>
                    <div className="text-[11px] text-stone-400 truncate">Lead: {p.name}</div>
                    <div className="text-[11px] text-amber-300 font-medium mt-0.5">
                      {p.type === 'nail_salon'
                        ? 'Nail Salon & Art'
                        : p.type === 'beauty_stylist'
                        ? 'Hairmaking & Braids'
                        : 'Mobile Glam Van'}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs text-stone-200 shrink-0">★ {p.rating}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{p.location.city}</span>
                </div>
                {p.isOnDemandAvailable ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>Online (~{p.estimatedArrivalMinutes}m)</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                    Studio Only
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onSelectProvider(p)}
                  className="flex-1 py-2 text-xs font-semibold text-stone-200 bg-stone-950 hover:bg-stone-800 rounded-xl cursor-pointer border border-stone-800 text-center"
                >
                  Preview Salon
                </button>
                <button
                  onClick={() => handleDelete(p._id, p.businessName)}
                  title="Delete provider"
                  className="px-3 py-2 text-rose-400 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/30 rounded-xl cursor-pointer transition-colors flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/90 text-stone-400 uppercase font-semibold border-b border-stone-800">
              <tr>
                <th className="p-3.5">Provider / Salon</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location in Kampala</th>
                <th className="p-3.5">Rating &amp; Reviews</th>
                <th className="p-3.5">On-Demand Dispatch</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-200">
              {providers.map((p) => (
                <tr key={p._id} className="hover:bg-stone-800/50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-950 shrink-0 border border-stone-800">
                        <img
                          src={p.image}
                          alt={p.businessName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">
                          {p.businessName}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          Lead: {p.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-amber-300">
                    {p.type === 'nail_salon'
                      ? 'Nail Salon & Art'
                      : p.type === 'beauty_stylist'
                      ? 'Hairmaking & Braids'
                      : 'Mobile Glam Van'}
                  </td>
                  <td className="p-3.5 text-stone-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{p.location.city}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono tabular-nums text-stone-200">
                    ★ {p.rating} ({p.reviewsCount} reviews)
                  </td>
                  <td className="p-3.5">
                    {p.isOnDemandAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                        <span>Online (~{p.estimatedArrivalMinutes}m)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                        Studio Appointments Only
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectProvider(p)}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-200 bg-stone-950 hover:bg-stone-800 rounded-lg cursor-pointer border border-stone-800"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.businessName)}
                        title="Delete provider"
                        className="p-1.5 text-rose-400 hover:bg-rose-950/80 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Modal: Add New Service Provider */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-stone-900 text-stone-100 w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-700 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80 shrink-0">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-400">
                  Admin Onboarding Form
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Add New Salon or Stylist to Uganda
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="m-6 mb-0 p-3 bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateProvider} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Salon Name and Lead Artist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Salon / Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acacia Velvet Nail Lounge"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Lead Artist / Stylist Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Grace Nabirye"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              {/* Service Category & Pricing Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Service Specialty
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="nail_salon" className="bg-stone-900 text-white">Nail Salon & Intricate Art Painting</option>
                    <option value="beauty_stylist" className="bg-stone-900 text-white">African Hairmaking, Braids & Dreadlocks</option>
                    <option value="mobile_stylist" className="bg-stone-900 text-white">Mobile Glam Van (On-Demand Dispatch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Pricing Tier
                  </label>
                  <select
                    value={pricingLevel}
                    onChange={(e) => setPricingLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="$$" className="bg-stone-900 text-white">$$ (Budget Accessible: UGX 30,000 - 60,000)</option>
                    <option value="$$$" className="bg-stone-900 text-white">$$$ (Premium Salon: UGX 60,000 - 120,000)</option>
                    <option value="$$$$" className="bg-stone-900 text-white">$$$$ (VIP Luxe / Bridal: UGX 120,000+)</option>
                  </select>
                </div>
              </div>

              {/* Kampala Location & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Neighborhood (Kampala, Uganda)
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="Kololo, Kampala" className="bg-stone-900 text-white">Kololo, Kampala</option>
                    <option value="Nakasero, Kampala" className="bg-stone-900 text-white">Nakasero, Kampala</option>
                    <option value="Bukoto, Kampala" className="bg-stone-900 text-white">Bukoto, Kampala</option>
                    <option value="Ntinda, Kampala" className="bg-stone-900 text-white">Ntinda, Kampala</option>
                    <option value="Bugolobi, Kampala" className="bg-stone-900 text-white">Bugolobi, Kampala</option>
                    <option value="Muyenga, Kampala" className="bg-stone-900 text-white">Muyenga, Kampala</option>
                    <option value="Entebbe, Uganda" className="bg-stone-900 text-white">Entebbe, Uganda</option>
                    <option value="Kampala Central" className="bg-stone-900 text-white">Kampala Road / Central</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Physical Address / Studio Suite
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Plot 14 Acacia Avenue, Suite 3"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Kampala's specialist in gel nail art & African knotless braids."
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Image Selection from Gallery */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Select Showcase Cover Photo ({BEAUTY_GALLERY.length} styles)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-stone-950 rounded-xl border border-stone-800">
                  {BEAUTY_GALLERY.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedImage(item.image)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage === item.image ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-transparent opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Featured Service */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  Initial Featured Service
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Service Name</label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="e.g. Russian Gel Manicure"
                      className="w-full px-2.5 py-1.5 text-xs bg-stone-900 border border-stone-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Price in UGX</label>
                    <input
                      type="number"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(Number(e.target.value))}
                      placeholder="70000"
                      className="w-full px-2.5 py-1.5 text-xs bg-stone-900 border border-stone-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={serviceDuration}
                      onChange={(e) => setServiceDuration(Number(e.target.value))}
                      placeholder="60"
                      className="w-full px-2.5 py-1.5 text-xs bg-stone-900 border border-stone-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* On-Demand Dispatch Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-stone-800">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Enable Instant On-Demand House Calls
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Broadcasting live GPS dispatch to clients across Kampala
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOnDemand}
                    onChange={(e) => setIsOnDemand(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-800 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  {isSubmitting ? 'Registering...' : 'Add Service Provider'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
