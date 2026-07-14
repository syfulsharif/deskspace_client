import React, { useState, useEffect } from 'react';
import { Compass, Clock, MapPin, Users, Star, ArrowLeft, Check, Calendar, HelpCircle, Briefcase, Sparkles, MessageSquare } from 'lucide-react';
import { Workspace, User } from '../types.js';
import { api } from '../lib/api.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { motion } from 'motion/react';

interface DetailsProps {
  workspaceId: string;
  user: User | null;
  navigate: (path: string) => void;
}

export function Details({ workspaceId, user, navigate }: DetailsProps) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [relatedSpaces, setRelatedSpaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00');
  const [bookingHours, setBookingHours] = useState('2');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setBookingSuccess(false);
    setBookingError(null);

    // Fetch workspace details
    api.getWorkspaceById(workspaceId)
      .then((res) => {
        if (res.success && res.data) {
          setWorkspace(res.data);
          
          // Fetch related spaces based on same category
          api.getWorkspaces({ category: res.data.category, limit: 4 })
            .then((relatedRes) => {
              if (relatedRes.success && relatedRes.data) {
                // Exclude the current workspace itself
                const filtered = relatedRes.data.filter(w => w.id !== workspaceId).slice(0, 3);
                setRelatedSpaces(filtered);
              }
            });
        } else {
          setError(res.error || 'Failed to fetch workspace details.');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError('A network connection error occurred while loading details.');
        setIsLoading(false);
      });
  }, [workspaceId]);

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!user) {
      navigate('/login');
      return;
    }

    if (!bookingDate) {
      setBookingError('Please select a reservation date.');
      return;
    }

    setIsBookingSubmitting(true);
    api.createBooking({
      workspaceId,
      date: bookingDate,
      startTime: bookingTime,
      durationHours: Number(bookingHours)
    })
    .then((res) => {
      if (res.success) {
        setBookingSuccess(true);
        // Automatically redirect to Bookings Tab in 2 seconds
        setTimeout(() => {
          navigate('/items/manage?tab=bookings');
        }, 2200);
      } else {
        setBookingError(res.error || 'Failed to complete reservation.');
      }
      setIsBookingSubmitting(false);
    })
    .catch((err) => {
      setBookingError('Network error. Failed to create reservation.');
      setIsBookingSubmitting(false);
    });
  };

  // Live Price Calculation
  const hourlyRate = workspace?.pricePerHour || 0;
  const estimatedPrice = hourlyRate * Number(bookingHours);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-zinc-200 rounded w-1/6" />
        <div className="h-[350px] bg-zinc-200 rounded-xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 bg-zinc-200 rounded w-1/2" />
            <div className="h-4 bg-zinc-200 rounded w-full" />
            <div className="h-4 bg-zinc-200 rounded w-5/6" />
          </div>
          <div className="h-[250px] bg-zinc-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="h-14 w-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <HelpCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Workspace not found</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">{error || "The space you're looking for doesn't exist or was deleted."}</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/explore')}>
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10"
    >
      
      {/* Back navigation link */}
      <div>
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-amber-600 uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Workspace Directory
        </button>
      </div>

      {/* Grid: Details & Cover Banner */}
      <div className="space-y-6">
        {/* Title, rating, location */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/5 border border-amber-500/10 text-amber-700 text-[9px] font-bold uppercase rounded-lg tracking-wider">
                {workspace.category.replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" strokeWidth={1.75} /> {workspace.rating} <span className="text-zinc-400 font-semibold">({workspace.reviewsCount} reviews)</span>
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">{workspace.name}</h1>
            <p className="text-xs md:text-sm text-zinc-400 font-semibold flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-zinc-400" strokeWidth={1.75} /> {workspace.location}
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-100/80 px-5.5 py-3.5 rounded-2xl self-start md:self-auto flex items-baseline gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Hourly Rate</span>
            <span className="text-2xl font-extrabold text-zinc-950">${workspace.pricePerHour}</span>
            <span className="text-xs text-zinc-400 font-bold">/ hr</span>
          </div>
        </div>

        {/* Large Image Showcase */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-zinc-100">
          <img
            src={workspace.image}
            alt={workspace.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Layout Grid: Left Specs + Description; Right Booking Sticky */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: ABOUT, DETAILS, AMENITIES */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Overview description */}
          <div className="bg-white border border-zinc-100/80 p-6 md:p-8 rounded-2xl space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <h2 className="text-base font-extrabold text-zinc-950 uppercase tracking-widest border-b border-zinc-100 pb-4">About the Space</h2>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
              {workspace.description}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-zinc-100/80 p-5 rounded-2xl text-center space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              <Users className="h-5 w-5 text-amber-600 mx-auto" strokeWidth={1.75} />
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Capacity</p>
              <p className="text-xs font-bold text-zinc-850">Up to {workspace.capacity} people</p>
            </div>
            <div className="bg-white border border-zinc-100/80 p-5 rounded-2xl text-center space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              <Clock className="h-5 w-5 text-amber-600 mx-auto" strokeWidth={1.75} />
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Timing</p>
              <p className="text-xs font-bold text-zinc-850">Hourly Booking</p>
            </div>
            <div className="bg-white border border-zinc-100/80 p-5 rounded-2xl text-center space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              <Briefcase className="h-5 w-5 text-amber-600 mx-auto" strokeWidth={1.75} />
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Workspace Type</p>
              <p className="text-xs font-bold text-zinc-850 capitalize">{workspace.category.replace('_', ' ')}</p>
            </div>
            <div className="bg-white border border-zinc-100/80 p-5 rounded-2xl text-center space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              <Star className="h-5 w-5 text-amber-600 mx-auto" strokeWidth={1.75} />
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Rating</p>
              <p className="text-xs font-bold text-zinc-850">{workspace.rating} / 5.0</p>
            </div>
          </div>

          {/* Amenities Badges Checklist */}
          <div className="bg-white border border-zinc-100/80 p-6 md:p-8 rounded-2xl space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <h2 className="text-base font-extrabold text-zinc-950 uppercase tracking-widest border-b border-zinc-100 pb-4">Premium Amenities Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {workspace.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-zinc-650">
                  <div className="h-5 w-5 bg-amber-500/5 border border-amber-500/10 text-amber-700 rounded-full flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="bg-white border border-zinc-100/80 p-6 md:p-8 rounded-2xl space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <h2 className="text-base font-extrabold text-zinc-950 uppercase tracking-widest border-b border-zinc-100 pb-4 flex items-center gap-2.5">
              <MessageSquare className="h-5 w-5 text-amber-600" strokeWidth={1.75} /> Reviews ({workspace.reviewsCount})
            </h2>
            <div className="space-y-6 divide-y divide-zinc-100">
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-700">
                      JS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Jonathan Stark</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">May 2026</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 text-xs font-bold">★★★★★ 5.0</div>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Incredibly high quality space. The high speed fiber internet was extremely consistent, and the gourmet coffee machine is a lovely luxury. Would absolutely recommend to anyone looking to get real deep work done.
                </p>
              </div>

              {workspace.reviewsCount > 1 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-700">
                        MR
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">Maya Rodriguez</h4>
                        <p className="text-[10px] text-zinc-400 font-medium">April 2026</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400 text-xs font-bold">★★★★★ 4.8</div>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Easy access code system, extremely quiet environment, and comfortable seating. Spent 4 hours here writing documentation and had zero interruptions. Very impressed!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: BOOKING STICKY PANEL */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-zinc-100/80 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] space-y-6 sticky top-24">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 uppercase tracking-widest">Reserve Space</h3>
              <p className="text-xs text-zinc-400 mt-1">Book instantly. Enter reservation details below.</p>
            </div>

            {bookingSuccess ? (
              <div className="bg-amber-500/5 border border-amber-500/10 text-amber-800 p-6 rounded-2xl text-center space-y-3">
                <Check className="h-8 w-8 text-amber-600 mx-auto" strokeWidth={1.75} />
                <h4 className="font-extrabold text-xs uppercase tracking-widest text-amber-900">Reservation Confirmed!</h4>
                <p className="text-xs text-amber-700/90 leading-relaxed">
                  Your reservation is submitted. We are generating your keypad code. Redirecting you...
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Date Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reservation Date</label>
                  <div className="flex items-center gap-2.5 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-zinc-50/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-500/5 focus-within:border-amber-500 transition-all duration-200">
                    <Calendar className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-transparent outline-none border-none text-zinc-850 font-bold cursor-pointer"
                    />
                  </div>
                </div>

                {/* Grid: Start Time & Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Start Time</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs font-bold bg-zinc-50/50 text-zinc-700 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all cursor-pointer"
                    >
                      <option value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hours Duration</label>
                    <select
                      value={bookingHours}
                      onChange={(e) => setBookingHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs font-bold bg-zinc-50/50 text-zinc-700 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all cursor-pointer"
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="3">3 Hours</option>
                      <option value="4">4 Hours</option>
                      <option value="6">6 Hours</option>
                      <option value="8">8 Hours</option>
                    </select>
                  </div>
                </div>

                {/* Cost Summary Box */}
                <div className="bg-zinc-50/50 p-4 border border-zinc-150 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400 font-bold">
                    <span>Hourly Rate</span>
                    <span className="text-zinc-700">${hourlyRate} / hr</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-bold">
                    <span>Duration</span>
                    <span className="text-zinc-700">{bookingHours} hours</span>
                  </div>
                  <div className="flex justify-between text-xs font-extrabold text-zinc-950 border-t border-zinc-100 pt-3 mt-1 uppercase tracking-wider">
                    <span>Estimated Total</span>
                    <span className="text-sm font-extrabold text-zinc-950">${estimatedPrice}</span>
                  </div>
                </div>

                {bookingError && (
                  <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">
                    {bookingError}
                  </p>
                )}

                {/* Booking Button based on Auth Session */}
                {user ? (
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full justify-center text-xs font-bold py-3.5 uppercase tracking-widest"
                    isLoading={isBookingSubmitting}
                  >
                    Confirm & Reserve Space
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => navigate('/login')}
                      className="w-full justify-center text-xs font-bold py-3.5 uppercase tracking-widest"
                    >
                      Sign In to Book Space
                    </Button>
                    <p className="text-[10px] text-zinc-400 text-center leading-normal">
                      An authenticated user account is required to verify booking schedules and receive digital entry lock codes.
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

      </div>

      {/* RELATED WORKSPACES SUGGESTIONS */}
      {relatedSpaces.length > 0 && (
        <div className="pt-10 border-t border-zinc-100 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-zinc-950 uppercase tracking-widest flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-500" strokeWidth={1.75} /> Similar Workspace Suggestions
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-medium">Explore similar co-working spots or creative studios in this neighborhood.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedSpaces.map((space) => (
              <Card key={space.id} className="flex flex-col h-[390px] border border-zinc-100/65 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.04)] transition-all duration-300">
                <div className="relative h-44 w-full overflow-hidden shrink-0">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-103"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-zinc-950/80 backdrop-blur-md rounded-lg text-[9px] font-bold text-amber-400 uppercase tracking-wider border border-white/5">
                    {space.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">{space.name}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} /> {space.location}
                    </p>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-medium">{space.shortDescription}</p>
                  </div>
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between mt-3">
                    <p className="text-sm font-extrabold text-zinc-900">${space.pricePerHour}<span className="text-[10px] text-zinc-400 font-bold ml-0.5">/hr</span></p>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/${space.id}`)} className="text-xs">
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
}
