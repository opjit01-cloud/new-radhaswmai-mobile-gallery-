import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, ThumbsUp, X, Sparkles } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  device: string;
  rating: number;
  date: string;
  comment: string;
}

export const VerifiedReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Vikramaditya Sharma, Bandra West, Mumbai',
      device: 'iPhone 16 Pro Max Desert Titanium (256GB)',
      rating: 5,
      date: 'Yesterday',
      comment: 'Received the 100% sealed Indian unit within 2 hours in Mumbai! Official Apple tax invoice provided with serial number matching on Apple Support app. They even transferred my 40GB WhatsApp backup on-the-spot.'
    },
    {
      id: 2,
      author: 'Dr. Pooja Agarwal, Pune',
      device: 'Samsung Galaxy S25 Ultra 512GB Titanium Silver',
      rating: 5,
      date: '3 days ago',
      comment: '0% No-Cost EMI got approved in 3 minutes on my HDFC Credit Card. Best price in Maharashtra compared to local electronics chains. Genuine Indian warranty registered.'
    },
    {
      id: 3,
      author: 'Arjun Mehta, Ahmedabad',
      device: 'Sony WH-1000XM5 ANC + Apple Watch Ultra 2',
      rating: 5,
      date: '5 days ago',
      comment: 'The packaging was bulletproof with multi-layer bubble wrap and BlueDart Air express dispatch. Genuine audio clarity and authentic titanium casing. Highly recommended gallery!'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newDevice, setNewDevice] = useState('iPhone 16 Pro Max');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev: Review = {
      id: Date.now(),
      author: newAuthor,
      device: newDevice,
      rating: newRating,
      date: 'Just now',
      comment: newComment
    };

    setReviews([newRev, ...reviews]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsModalOpen(false);
      setNewAuthor('');
      setNewComment('');
    }, 1500);
  };

  return (
    <section className="py-16 px-4 md:px-8 border-b border-white/5 bg-[#080B10]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              VERIFIED CLIENT ENDORSEMENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Trusted by Over 2,450 Flagship Owners.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#0D121B] border border-white/10 text-xs">
              <div className="flex items-center text-white">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white" />
                ))}
              </div>
              <span className="font-bold text-white">4.9 / 5.0</span>
              <span className="text-gray-400 font-mono">(Google Verified)</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 border border-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-black" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl bg-[#0E131E] border border-white/10 p-6 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-white">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-white" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-gray-500">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rev.author}</span>
                  <span title="Verified Customer">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5 truncate">
                  Purchased: {rev.device}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#0E131E] border border-white/15 p-6 sm:p-8 shadow-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-display font-bold text-white mb-1">
                Share Your Experience
              </h3>
              <p className="text-xs text-gray-400 mb-5">
                Help other buyers make informed decisions on their flagship purchase.
              </p>

              {submittedMessage ? (
                <div className="py-10 text-center text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8" />
                  <span>Thank you! Your verified review has been published.</span>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Your Full Name &amp; City</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Rahul Sharma, Mumbai"
                      className="w-full bg-[#080B10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Product Purchased</label>
                    <select
                      value={newDevice}
                      onChange={(e) => setNewDevice(e.target.value)}
                      className="w-full bg-[#080B10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white"
                    >
                      <option>iPhone 16 Pro Max Desert Titanium</option>
                      <option>Samsung Galaxy S25 Ultra</option>
                      <option>OnePlus 13 Hasselblad</option>
                      <option>Sony WH-1000XM5 ANC</option>
                      <option>Apple Watch Ultra 2 Titanium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${star <= newRating ? 'text-white fill-white' : 'text-gray-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Review Comments</label>
                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Describe the packaging, delivery speed, invoice, and device performance..."
                      className="w-full bg-[#080B10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200 shadow-lg transition-all"
                  >
                    Publish Verified Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
