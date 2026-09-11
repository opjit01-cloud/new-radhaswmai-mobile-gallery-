import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { HashgraphButton } from './HashgraphButton';

interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  bio: string;
}

interface Review {
  id: number;
  author: string;
  device: string;
  rating: number;
  date: string;
  comment: string;
}

export const HashgraphTeam: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Radhaswami Sharma',
      role: 'FOUNDER & CHIEF HARDWARE CURATOR',
      credentials: '20+ Years Flagship Retail Leadership',
      bio: 'Pioneered direct factory-sealed distribution pipelines with certified Indian manufacturers and authorized service hubs.'
    },
    {
      name: 'Viren K. Parekh',
      role: 'HEAD OF TECHNICAL DIAGNOSTICS',
      credentials: 'Apple Certified Technician & Imaging Specialist',
      bio: 'Oversees 40-point hardware telemetry checks, battery health verification, and laser optical alignment on every unit.'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'VIP CLIENT RELATIONS & CONCIERGE',
      credentials: 'Flagship Data Migration & Security Expert',
      bio: 'Directs on-demand video unboxing, secure WhatsApp and iCloud data transfer, and 2-hour doorstep handovers.'
    }
  ];

  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Vikramaditya Sharma, Bandra West, Mumbai',
      device: 'iPhone 16 Pro Max Desert Titanium (256GB)',
      rating: 5,
      date: 'Yesterday',
      comment: 'Received the 100% sealed Indian unit within 2 hours in Mumbai! Official Apple tax invoice provided with serial matching on Apple Support app. The concierge even transferred my 40GB backup seamlessly.'
    },
    {
      id: 2,
      author: 'Dr. Pooja Agarwal, Pune',
      device: 'Samsung Galaxy S25 Ultra 512GB Titanium Silver',
      rating: 5,
      date: '3 days ago',
      comment: '0% No-Cost EMI got approved in 3 minutes on my HDFC Credit Card. Best price compared to mall chains. Genuine Indian warranty registered.'
    },
    {
      id: 3,
      author: 'Arjun Mehta, Ahmedabad',
      device: 'Sony WH-1000XM5 ANC + Watch Ultra 2',
      rating: 5,
      date: '5 days ago',
      comment: 'The packaging was bulletproof with BlueDart Air express dispatch. Genuine audio clarity and authentic titanium casing. Highly recommended gallery!'
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

  const handleNextTeam = () => {
    setActiveTeamIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrevTeam = () => {
    setActiveTeamIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

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

  const activeMember = teamMembers[activeTeamIndex];

  return (
    <section id="concierge" className="relative min-h-[90vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-16 border-t border-white/5 bg-[#000209]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title Index */}
        <div className="section-title mb-8 sm:mb-12">
          <span className="section-title__id">//04</span>
          <span>CONCIERGE &bull; ENDORSEMENTS</span>
        </div>

        {/* Asymmetric Offset Title Matching HashgraphVC */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05]">
            <span className="block">Experience</span>
            <span className="block pl-8 sm:pl-20 text-[#9BB8E1]">you can trust.</span>
          </h2>
          <p className="mt-6 text-sm sm:text-base text-gray-400 font-light max-w-xl">
            No unverified middlemen. Over 20 years of authorized consumer tech expertise, certified Apple &amp; Samsung diagnostics, and thousands of verified client relationships.
          </p>
        </div>

        {/* Team Member Spotlight Carousel (HashgraphVC style) */}
        <div className="p-8 sm:p-12 rounded-3xl hashgraph-card mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="text-[11px] font-mono text-[#9BB8E1] tracking-widest uppercase">
                {activeMember.role}
              </div>
              <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                {activeMember.name}
              </h3>
              <div className="text-xs font-mono text-gray-400">
                {activeMember.credentials}
              </div>
              <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl pt-2">
                "{activeMember.bio}"
              </p>
            </div>

            <div className="lg:col-span-4 flex items-center justify-end gap-3">
              <button
                onClick={handlePrevTeam}
                className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#9BB8E1]/30 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Previous specialist"
              >
                <ChevronLeft className="w-5 h-5 text-[#9BB8E1]" />
              </button>
              
              <span className="text-xs font-mono text-gray-400 px-2">
                0{activeTeamIndex + 1} / 0{teamMembers.length}
              </span>

              <button
                onClick={handleNextTeam}
                className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#9BB8E1]/30 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Next specialist"
              >
                <ChevronRight className="w-5 h-5 text-[#9BB8E1]" />
              </button>
            </div>

          </div>
        </div>

        {/* Client Endorsements Wall (Google 4.9★) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase text-[#9BB8E1] tracking-wider mb-1">
              // VERIFIED REPUTATION
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-white">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white" />
                ))}
              </div>
              <span className="text-sm font-bold text-white">4.9 / 5.0</span>
              <span className="text-xs font-mono text-gray-500">(2,450+ Verified Client Reviews)</span>
            </div>
          </div>

          <HashgraphButton onClick={() => setIsModalOpen(true)} hoverText="Submit Review" small>
            Write a Review
          </HashgraphButton>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl hashgraph-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-white">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-white" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{rev.author}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] font-mono text-[#9BB8E1] mt-0.5 truncate">
                  Purchased: {rev.device}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#080C14] border border-[#9BB8E1]/30 p-8 shadow-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-display font-bold text-white mb-1">
                Client Review Submission
              </h3>
              <p className="text-xs text-gray-400 mb-6 font-mono">
                Share your verification experience with the New Radhaswami community.
              </p>

              {submittedMessage ? (
                <div className="py-12 text-center text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8" />
                  <span>Thank you! Your verified review has been published.</span>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Full Name &amp; City</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Vikramaditya Sharma, Mumbai"
                      className="w-full bg-[#000209] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#9BB8E1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Hardware Purchased</label>
                    <select
                      value={newDevice}
                      onChange={(e) => setNewDevice(e.target.value)}
                      className="w-full bg-[#000209] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    >
                      <option>iPhone 16 Pro Max Desert Titanium</option>
                      <option>Samsung Galaxy S25 Ultra</option>
                      <option>OnePlus 13 Hasselblad</option>
                      <option>Sony WH-1000XM5 ANC</option>
                      <option>Apple Watch Ultra 2 Titanium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Rating</label>
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
                    <label className="block text-xs font-mono text-gray-400 mb-1">Comments</label>
                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share notes on packaging, sealed condition, serial verification, and delivery..."
                      className="w-full bg-[#000209] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#9BB8E1]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#9BB8E1] to-[#2C4E73] text-white font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
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
