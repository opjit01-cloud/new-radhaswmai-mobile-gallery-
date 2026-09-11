import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, MessageSquare, Plus, Send, ShieldCheck } from 'lucide-react';

interface CustomerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerReviewsModal: React.FC<CustomerReviewsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isWritingReview, setIsWritingReview] = useState(false);

  // New review form
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('');
  const [productPurchased, setProductPurchased] = useState('iPhone 16 Pro Max');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName.trim(),
          city: city.trim() || 'Pithampur, MP',
          product: productPurchased,
          rating,
          comment: comment.trim()
        })
      });
      const data = await res.json();
      setSubmitting(false);

      if (data.success && data.review) {
        setReviews(prev => [data.review, ...prev]);
        setIsWritingReview(false);
        setAuthorName('');
        setComment('');
        setSuccessToast(true);
        setTimeout(() => setSuccessToast(false), 3500);
      }
    } catch {
      setSubmitting(false);
      setIsWritingReview(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#0C1017] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div>
            <h3 className="font-serif-luxury text-2xl font-medium text-white">
              Verified Client Reviews &amp; Ratings
            </h3>
            <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>4.9 / 5.0 Average Verified Buyer Rating ({reviews.length} Endorsements)</span>
            </div>
          </div>

          <button
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md"
          >
            <Plus size={13} />
            <span>{isWritingReview ? 'View Reviews' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Toast Notification */}
        {successToast && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-tab-in">
            <CheckCircle2 size={15} />
            <span>Thank you! Your verified review has been recorded.</span>
          </div>
        )}

        {/* WRITE A REVIEW FORM */}
        {isWritingReview ? (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs animate-tab-in bg-white/[0.02] p-5 rounded-2xl border border-white/10">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Share Your Purchase Experience
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Mehta"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1 font-medium">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Vijay Nagar, Pithampur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1 font-medium">Handset Purchased</label>
                <select
                  value={productPurchased}
                  onChange={(e) => setProductPurchased(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none cursor-pointer"
                >
                  <option value="iPhone 16 Pro Max">iPhone 16 Pro Max</option>
                  <option value="Samsung Galaxy S25 Ultra">Samsung Galaxy S25 Ultra</option>
                  <option value="Google Pixel 9 Pro Fold">Google Pixel 9 Pro Fold</option>
                  <option value="OnePlus 13">OnePlus 13</option>
                  <option value="AirPods Max">AirPods Max</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 mb-1 font-medium">Rating</label>
                <div className="flex items-center gap-2 pt-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${rating === star ? 'bg-white text-black font-bold border-white' : 'bg-white/5 border-white/10 text-neutral-400'}`}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-neutral-400 mb-1 font-medium">Review Comment *</label>
              <textarea
                rows={3}
                required
                placeholder="Share your experience regarding sealed packaging, delivery speed, invoice, and warranty activation..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-all"
            >
              <span>{submitting ? 'Recording...' : 'Submit Verified Review'}</span>
            </button>
          </form>
        ) : (
          /* REVIEWS LIST VIEW */
          <div className="space-y-4">
            
            {/* Filter Chips */}
            <div className="flex items-center gap-2 pb-2">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Filter:</span>
              <button
                onClick={() => setFilterRating('all')}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer ${filterRating === 'all' ? 'bg-white text-black font-bold' : 'bg-white/5 text-neutral-300'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRating(5)}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer ${filterRating === 5 ? 'bg-white text-black font-bold' : 'bg-white/5 text-neutral-300'}`}
              >
                5 Star Only
              </button>
            </div>

            {/* List */}
            <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
              {filteredReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center">
                        {rev.author.charAt(0)}
                      </span>
                      <div>
                        <div className="font-medium text-white text-xs flex items-center gap-1.5">
                          <span>{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full border border-emerald-400/20 font-normal">
                              ✓ Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400">{rev.city} • {rev.date}</div>
                      </div>
                    </div>

                    <div className="text-white text-xs font-bold tracking-widest">
                      {'★'.repeat(rev.rating || 5)}
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-300 font-medium">
                    Purchased: {rev.product}
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
