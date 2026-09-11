import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { ShinyText } from '../reactbits/ShinyText';
import { ClickSpark } from '../reactbits/ClickSpark';
import { MagneticButton } from '../common/MagneticButton';
import { Aurora } from '../reactbits/Aurora';
import { Particles } from '../reactbits/Particles';
import { DecryptedText } from '../reactbits/DecryptedText';

interface ReviewItem {
  id: number;
  author: string;
  device: string;
  rating: number;
  date: string;
  comment: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    author: 'Vikramaditya S., Vijay Nagar Indore',
    device: 'iPhone 16 Pro Max Natural Titanium 512GB',
    rating: 5,
    date: 'Yesterday',
    comment: 'Collected the 100% manufacturer-sealed Indian unit directly from their Pithampur showroom. Original Apple VAT tax invoice provided with full manufacturer warranty. The white-glove concierge was impeccable.'
  },
  {
    id: 2,
    author: 'Pooja Agarwal, Pithampur Industrial Area',
    device: 'Samsung Galaxy S25 Ultra 256GB',
    rating: 5,
    date: '2 days ago',
    comment: '0% No-Cost EMI was verified in under 3 minutes on my HDFC card at the store counter. Pristine condition and best pricing in Madhya Pradesh. The Titanium finish is breathtaking.'
  },
  {
    id: 3,
    author: 'Arjun Mehta, Dhar Road Indore',
    device: 'Google Pixel 9 Pro Fold Obsidian',
    rating: 5,
    date: '4 days ago',
    comment: 'Packaging was bulletproof with security seal integrity. The hinge mechanics on the Pixel 9 Fold are marvelous. New Radhaswami Mobile Gallery has set a new gold standard for smartphone acquisition in MP.'
  }
];

export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newDevice, setNewDevice] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const added: ReviewItem = {
      id: Date.now(),
      author: newAuthor.trim(),
      device: newDevice.trim() || 'Flagship Handset',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim()
    };

    setReviews([added, ...reviews]);
    setIsModalOpen(false);
    setNewAuthor('');
    setNewDevice('');
    setNewComment('');
  };

  return (
    <section id="reviews" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] border-b border-black/[0.08] dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Pro React Bits: Aurora Flowing Wave (Subtle monochrome) */}
      <Aurora colorStops={['#000000', '#64748B', '#CBD5E1', '#0B0F19']} blend={0.1} speed={16} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/[0.08] dark:border-white/10 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-ping" />
              <DecryptedText
                text="VERIFIED BUYER REVIEWS • 100% AUTHENTIC"
                speed={28}
                maxIterations={10}
                className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-neutral-950 dark:text-white tracking-tight">
              Customer Reviews &amp; <span className="font-semibold text-black dark:text-white"><ShinyText text="Verified Ratings" speed={3.5} /></span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-light mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Over 2,450+ patrons trust New Radhaswami Mobile Gallery for genuine sealed phones and express air delivery.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-semibold text-lg font-serif-luxury text-black dark:text-white">
              <Star size={18} className="fill-black text-black dark:fill-white dark:text-white" />
              <span className="text-neutral-950 dark:text-white font-bold">4.9 / 5.0 Rating</span>
            </div>
            <ClickSpark sparkColor="#000000" sparkCount={8}>
              <MagneticButton
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-black/15 flex items-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquarePlus size={14} className="text-white dark:text-black" />
                <span>Share Experience</span>
              </MagneticButton>
            </ClickSpark>
          </div>
        </div>

        {/* Reviews Cards Grid with React Bits SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {reviews.map(r => (
            <SpotlightCard
              key={r.id}
              spotlightColor="rgba(255, 255, 255, 0.08)"
              borderColor="rgba(255, 255, 255, 0.15)"
              className="p-8 shadow-md hover:shadow-xl flex flex-col justify-between bg-white dark:bg-[#0F1117] rounded-3xl border border-neutral-200 dark:border-white/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-black text-black dark:fill-white dark:text-white" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">{r.date}</span>
                </div>

                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-white/10 mt-6 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                    <span>{r.author}</span>
                    <CheckCircle2 size={13} className="text-black dark:text-white" />
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[200px] mt-0.5">
                    {r.device}
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 text-[10px] uppercase tracking-wider font-semibold">
                  Verified Patron
                </span>
              </div>
            </SpotlightCard>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-tab-in">
          <div className="bg-white dark:bg-[#0F1117] border border-neutral-200 dark:border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl text-neutral-900 dark:text-white">
            <h3 className="text-2xl font-serif-luxury font-bold text-neutral-950 dark:text-white">Share Your Experience</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Your review assists other patrons in selecting their authentic sealed flagship handset.
            </p>

            <form onSubmit={handleAddReview} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Your Name &amp; Location</label>
                <input
                  type="text"
                  placeholder="e.g. Sameer K., Vijay Nagar Indore"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-white/15 text-neutral-900 dark:text-white text-xs outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Handset Acquired</label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 16 Pro Max Natural Titanium"
                  value={newDevice}
                  onChange={(e) => setNewDevice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-white/15 text-neutral-900 dark:text-white text-xs outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        size={20}
                        className={star <= newRating ? 'fill-black text-black dark:fill-white dark:text-white' : 'text-neutral-300 dark:text-neutral-700'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Review Commentary</label>
                <textarea
                  rows={3}
                  placeholder="Share details regarding packaging, delivery speed, and device condition..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-white/15 text-neutral-900 dark:text-white text-xs outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <MagneticButton
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs uppercase tracking-wider font-extrabold shadow-md shadow-black/10 cursor-pointer"
                >
                  Submit Endorsement
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
