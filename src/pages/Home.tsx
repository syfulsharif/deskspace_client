import React, { useState, useEffect } from 'react';
import { Search, Compass, Shield, Zap, Sparkles, Star, ArrowRight, BookOpen, MessageSquare, PlusCircle, CheckCircle } from 'lucide-react';
import { Workspace } from '../types.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { api } from '../lib/api.js';
import { motion } from 'motion/react';

// Recharts imports for our Highlights/Stats section
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface HomeProps {
  navigate: (path: string) => void;
  featuredSpaces: Workspace[];
}

export function Home({ navigate, featuredSpaces }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [statsData, setStatsData] = useState<any[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  // Active slide state for interactive element in Hero
  const [heroSlide, setHeroSlide] = useState(0);
  const heroSlides = [
    {
      title: "Desks & Studios Built for Deep Work",
      tagline: "Discover professional, premium, hourly co-working spaces and acoustically engineered studios around Seattle.",
      bg: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Escape the Cafe Noise. Unleash Creativity.",
      tagline: "From fully-equipped podcast labs to private offices and photo lofts. Ready in minutes.",
      bg: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  useEffect(() => {
    // Fetch stats data for Recharts line chart
    api.getBookingStats().then(res => {
      if (res.success && res.data) {
        setStatsData(res.data);
      }
    });

    // Toggle hero slide every 5 seconds
    const slideTimer = setInterval(() => {
      setHeroSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);

    return () => clearInterval(slideTimer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('search', searchQuery);
    if (activeCategory !== 'all') queryParams.append('category', activeCategory);
    
    navigate(`/explore?${queryParams.toString()}`);
  };

  const categories = [
    { value: 'coworking', label: 'Co-working Desks', desc: 'Sleek hot-desks and lounges', count: '100+ Desks' },
    { value: 'private_office', label: 'Private Offices', desc: 'Secure rooms for absolute focus', count: '12 Suites' },
    { value: 'meeting_room', label: 'Meeting Rooms', desc: 'Conference setups with smart hubs', count: '8 Rooms' },
    { value: 'creative_studio', label: 'A/V & Photo Studios', desc: 'Tuned sound booths and daylight photography lofts', count: '15 Studios' },
  ];

  const testimonials = [
    {
      quote: "DeskSpace completely revolutionized my routine. I book a podcast booth in the morning, then work from a sunlit co-working desk. The sound insulation and 1Gbps fiber internet are flawlessly professional.",
      author: "Marcus Vance",
      role: "Lead UI Engineer & Host of Synthesize Podcast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "The cyclorama studio is an incredible deal. Booking is completely hands-off through their portal, and the space was fully stocked with pre-calibrated lights and studio softboxes when I unlocked the door.",
      author: "Elena Rostova",
      role: "Architectural & Fashion Photographer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "We hosted a client board session in the Skyline Boardroom. High-floor views, absolute acoustic privacy, a flawless teleconference speaker bar, and superb espresso. Our clients were deeply impressed.",
      author: "Dominic Chen",
      role: "Founder, Capital Ventures NW",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const faqs = [
    {
      q: "How does the keyless workspace entry work?",
      a: "Once your booking is confirmed, you'll receive a secure digital entry code via email and SMS. This code activates exactly 10 minutes before your scheduled start time and automatically expires at the end of your duration."
    },
    {
      q: "Can I book a workspace on short notice?",
      a: "Absolutely! Desks and meeting rooms can be booked instantly with as little as 15 minutes of advanced notice, provided there is open capacity. Our real-time calendar updates on-demand."
    },
    {
      q: "Is coffee, water, and printing included?",
      a: "Yes! All bookings include unlimited premium coffee/beverage bar access, ultra-high-speed fiber WiFi, soundproofed phone booths, and access to secure wireless laser printing stations."
    },
    {
      q: "What is your cancellation policy?",
      a: "Bookings can be fully cancelled for a 100% refund up to 24 hours prior to the scheduled start time. Cancellations inside 24 hours will be credited back to your account as space credits."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-zinc-50"
    >
      
      {/* 1. HERO SECTION (Constrained to 65% height, interactive) */}
      <section className="relative h-[65vh] min-h-[460px] max-h-[600px] flex items-center overflow-hidden bg-zinc-950 text-white">
        {/* Background Image Slider / Fade effect */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroSlides[heroSlide].bg}
            alt="Workspace Slide bg"
            className="w-full h-full object-cover opacity-35 transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-xs font-semibold text-amber-400 tracking-wide uppercase mb-4">
              <Sparkles className="h-3 w-3" /> Space Directory & Live Reservation
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight transition-all duration-500">
              {heroSlides[heroSlide].title}
            </h1>
            <p className="text-base md:text-lg text-zinc-300 mb-8 max-w-xl leading-relaxed transition-all duration-500">
              {heroSlides[heroSlide].tagline}
            </p>

            {/* Interactive Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 p-2 rounded-xl border border-white/15 backdrop-blur-md max-w-xl">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-zinc-900">
                <Search className="h-5 w-5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What style of workspace or studio?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-zinc-900"
                />
              </div>
              <Button type="submit" variant="secondary" className="px-5">
                Find Space
              </Button>
            </form>
          </div>
        </div>

        {/* Floating Slide Indicators */}
        <div className="absolute bottom-6 right-8 flex items-center space-x-2 z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${heroSlide === idx ? 'w-6 bg-amber-500' : 'w-2.5 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. VALUE PROPOSITION FEATURES (Section 1) */}
      <section className="py-20 bg-white border-b border-zinc-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Engineered for Professional Excellence
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mt-3 leading-relaxed">
              Every detail of our spaces has been calibrated for deep creative output and commercial productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4.5 items-start p-6.5 rounded-2xl bg-zinc-50/50 border border-zinc-100/80 hover:border-amber-200 hover:shadow-lg hover:shadow-zinc-200/10 transition-all duration-300">
              <div className="p-3 bg-amber-500/5 text-amber-600 rounded-xl border border-amber-500/10 shrink-0">
                <Zap className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 tracking-tight">Instant Digital Entry</h3>
                <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed">
                  Keyless passcode doors. Reserve, unlock, and step in immediately. No reception wait times.
                </p>
              </div>
            </div>

            <div className="flex gap-4.5 items-start p-6.5 rounded-2xl bg-zinc-50/50 border border-zinc-100/80 hover:border-amber-200 hover:shadow-lg hover:shadow-zinc-200/10 transition-all duration-300">
              <div className="p-3 bg-amber-500/5 text-amber-600 rounded-xl border border-amber-500/10 shrink-0">
                <Shield className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 tracking-tight">Acoustic Isolation</h3>
                <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed">
                  Double soundproofed glass and custom acoustic panel insulation for undisturbed concentration and flawless sound capture.
                </p>
              </div>
            </div>

            <div className="flex gap-4.5 items-start p-6.5 rounded-2xl bg-zinc-50/50 border border-zinc-100/80 hover:border-amber-200 hover:shadow-lg hover:shadow-zinc-200/10 transition-all duration-300">
              <div className="p-3 bg-amber-500/5 text-amber-600 rounded-xl border border-amber-500/10 shrink-0">
                <Compass className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 tracking-tight">Enterprise Amenities</h3>
                <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed">
                  Includes 1Gbps redundant fiber WiFi, color-calibrated monitors, premium coffee bars, and physical prototyping tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES HUB (Section 2) */}
      <section className="py-20 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Select Your Environment
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mt-3 leading-relaxed">
              Browse through our specialized workspaces and professional-grade creative environments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Card
                key={cat.value}
                className="p-7.5 cursor-pointer flex flex-col justify-between border border-zinc-100/65 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.04)]"
                onClick={() => navigate(`/explore?category=${cat.value}`)}
              >
                <div className="space-y-5">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/40 px-3 py-1 rounded-lg uppercase tracking-wider">
                    {cat.count}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-tight">{cat.label}</h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 mt-8 group hover:text-amber-600 transition-colors">
                  <span>Explore Rooms</span>
                  <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HIGHLIGHTS & LIVE ANALYTICS (Section 3 - Recharts) */}
      <section className="py-16 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Analytics Text */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/5 border border-amber-200/40 px-3 py-1 rounded-lg">
                DeskSpace Insights
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                Empowering the Seattle Tech and Creative Boom
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our platform has seen incredible reservation density growth over the past year. High-performing freelancers and scaleups consistently choose DeskSpace for reliable infrastructure and inspiring communities.
              </p>
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100">
                <div>
                  <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">4,200+</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Hours Booked</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">99.8%</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">WiFi Uptime</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">4.91 ★</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Avg Rating</p>
                </div>
              </div>
            </div>

            {/* Recharts Graphical Chart Container */}
            <div className="lg:col-span-7 bg-white border border-zinc-100 p-6.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-[340px] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Live Reservation Hours Booked</p>
                <div className="flex gap-4 text-xs font-semibold text-zinc-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Coworking</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-900" /> Offices</span>
                </div>
              </div>

              <div className="w-full flex-1 min-h-[220px]">
                {statsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCowork" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.12}/>
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOffices" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#18181b" stopOpacity={0.08}/>
                          <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                      <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                      <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #f4f4f5', borderRadius: '12px', fontSize: '11px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }} />
                      <Area type="monotone" dataKey="coworking" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCowork)" />
                      <Area type="monotone" dataKey="offices" stroke="#18181b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOffices)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400 font-semibold tracking-wide">
                    Loading telemetry data...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FEATURED WORKSPACES (Section 4) */}
      <section className="py-16 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Featured Spaces This Week
              </h2>
              <p className="text-sm md:text-base text-zinc-500 mt-1">
                A hand-curated selection of premium, highly demanded workspaces around Seattle.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/explore')}
              className="mt-4 sm:mt-0 flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              Browse All Spaces <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSpaces.map((space) => (
              <Card key={space.id} className="flex flex-col h-full border border-zinc-100/65 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.04)]">
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden shrink-0">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-103"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-zinc-950/80 backdrop-blur-md rounded-lg text-[9px] font-bold text-amber-400 uppercase tracking-wider border border-white/5">
                    {space.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mb-3">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" strokeWidth={1.75} />
                      <span>{space.rating} <span className="text-zinc-400 font-medium">({space.reviewsCount} reviews)</span></span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 line-clamp-1 mb-2.5">{space.name}</h3>
                    <p className="text-xs text-zinc-400 mb-4 font-semibold flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-zinc-400" strokeWidth={1.75} /> {space.location}
                    </p>
                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">{space.shortDescription}</p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-5 mt-5 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hourly Rate</p>
                      <p className="text-base font-extrabold text-zinc-900 mt-0.5">${space.pricePerHour}<span className="text-xs font-medium text-zinc-400"> / hr</span></p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/${space.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. POLISHED TESTIMONIALS (Section 5) */}
      <section className="py-16 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
              Success Stories
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight mt-4">
              Loved by Top Professionals
            </h2>
            <p className="text-sm md:text-base text-zinc-500 mt-2">
              See how architects, video editors, podcasters, and developers are utilizing our hourly spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white border border-zinc-100 p-7.5 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.04)] transition-all duration-300">
                <p className="text-sm text-zinc-500 leading-relaxed italic mb-7">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3.5 pt-4 border-t border-zinc-100/60">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="h-11 w-11 rounded-full object-cover border border-zinc-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-none">{t.author}</h4>
                    <p className="text-xs text-zinc-400 font-semibold mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQS ACCORDION (Section 6) */}
      <section className="py-16 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-zinc-500 mt-1">
              Have questions about booking or managing a space? We have answers.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
                    isOpen ? 'border-amber-200/60 shadow-[0_12px_40px_rgba(217,119,6,0.025)]' : 'border-zinc-100 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center px-6.5 py-4.5 text-left font-bold text-zinc-900 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm md:text-base leading-tight">{faq.q}</span>
                    <span className="text-amber-600 font-bold text-xl leading-none ml-4 shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6.5 pb-5.5 pt-1 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-zinc-50 bg-zinc-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CALL-TO-ACTION BANNER (Section 7) */}
      <section className="py-16 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to Do Your Best Work?
          </h2>
          <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Reserve hourly hot desks, dynamic conference setups, and acoustically isolated sound studios instantly. Join DeskSpace today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button variant="secondary" size="lg" onClick={() => navigate('/explore')} className="w-full sm:w-auto">
              Browse Workspaces <Compass className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/add-workspace')} className="text-white border-white/20 hover:bg-white/10 w-full sm:w-auto">
              List Your Studio <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
