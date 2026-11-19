import React, { useState } from 'react';
import { Review, Provider, User } from '../types/index.ts';
import { Star, ShieldCheck, Plus, Sparkles, X, AlertCircle } from 'lucide-react';
import { api } from '../api/client.ts';

interface ReviewsSectionProps {
  reviews: Review[];
  providers: Provider[];
  user: User | null;
  onReviewAdded: (newReview: Review) => void;
  onOpenAuth: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  providers,
  user,
  onReviewAdded,
  onOpenAuth,
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Write modal state
  const [providerId, setProviderId] = useState(providers[0]?._id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [serviceName, setServiceName] = useState('Russian Precision Manicure');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredReviews = selectedProviderId === 'all'
    ? reviews
    : reviews.filter((r) => r.providerId === selectedProviderId);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please write a short review comment');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const created = await api.postReview(providerId, rating, comment, serviceName);
      onReviewAdded(created);
      setIsWriteModalOpen(false);
      setComment('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-5 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Community Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Client Testimonials & Ratings
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Real feedback from Kampala residents and university students across Kololo, Bukoto, Bugolobi, and hostels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Provider Filter */}
          <select
            value={selectedProviderId}
            onChange={(e) => setSelectedProviderId(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-900/90 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            <option value="all">All Salons & Stylists</option>
            {providers.map((p) => (
              <option key={p._id} value={p._id} className="bg-stone-900 text-white">
                {p.businessName}
              </option>
            ))}
          </select>

          {/* Write a Review Button */}
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((review) => {
          const provider = providers.find((p) => p._id === review.providerId);
          return (
            <div
              key={review._id}
              className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 p-6 shadow-xl space-y-3.5 hover:border-amber-400/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-serif font-bold text-white text-base">
                    {review.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                    <span className="text-amber-300 font-medium">{review.serviceName}</span>
                    <span aria-hidden="true" className="text-stone-700">·</span>
                    <span className="font-medium text-stone-300">{provider?.businessName}</span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 bg-stone-950/80 px-2 py-1 rounded-lg border border-stone-800">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                "{review.comment}"
              </p>

              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Client</span>
                </div>
                <span>{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 w-full max-w-lg rounded-2xl shadow-2xl border border-stone-700 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-400">
                  Rate Your Experience
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Write a Verified Review
                </h3>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Select Salon or Stylist
                </label>
                <select
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {providers.map((p) => (
                    <option key={p._id} value={p._id} className="bg-stone-900 text-white">
                      {p.businessName} ({p.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-amber-400 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Service Completed
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  placeholder="e.g. Russian Precision Manicure"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about punctuality, hygiene, nail art quality, or styling..."
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Bonus points reward notice */}
              <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>You will earn +50 Banda Services loyalty points for publishing this review!</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl cursor-pointer shadow-md"
                >
                  {isSubmitting ? 'Posting...' : 'Submit Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
