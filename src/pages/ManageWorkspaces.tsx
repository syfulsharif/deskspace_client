import React, { useState, useEffect } from 'react';
import { Calendar, Briefcase, Trash2, ExternalLink, XCircle, AlertTriangle, CheckCircle, PlusCircle, Compass } from 'lucide-react';
import { api } from '../lib/api.js';
import { User, Workspace, Booking } from '../types.js';
import { Button } from '../components/ui/Button.js';
import { Modal } from '../components/ui/Modal.js';

interface ManageWorkspacesProps {
  user: User | null;
  navigate: (path: string) => void;
  initialTab?: string;
  refreshWorkspacesGlobal: () => void;
}

export function ManageWorkspaces({ user, navigate, initialTab = 'bookings', refreshWorkspacesGlobal }: ManageWorkspacesProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [ownedWorkspaces, setOwnedWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Control States
  const [deleteSpaceId, setDeleteSpaceId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelSubmitting, setIsCancelSubmitting] = useState(false);

  // Sync tab from props (like URL tab parameter)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Auth Guard
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [user, activeTab]);

  const fetchDashboardData = () => {
    setIsLoading(true);
    if (activeTab === 'bookings') {
      api.getBookings()
        .then((res) => {
          if (res.success && res.data) {
            setUserBookings(res.data);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      // Fetch workspaces listed by this user
      api.getWorkspaces({ limit: 100 })
        .then((res) => {
          if (res.success && res.data) {
            // Filter locally by logged-in user's id
            const filtered = res.data.filter(w => w.ownerId === user?.id);
            setOwnedWorkspaces(filtered);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  // --- DELETE WORKSPACE ACTION ---
  const triggerDeleteSpace = (spaceId: string) => {
    setDeleteSpaceId(spaceId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSpaceConfirm = () => {
    if (!deleteSpaceId) return;
    setIsDeleteSubmitting(true);
    
    api.deleteWorkspace(deleteSpaceId)
      .then((res) => {
        if (res.success) {
          setIsDeleteModalOpen(false);
          setDeleteSpaceId(null);
          fetchDashboardData();
          refreshWorkspacesGlobal(); // Refresh global index
        }
        setIsDeleteSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsDeleteSubmitting(false);
      });
  };

  // --- CANCEL BOOKING ACTION ---
  const triggerCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setIsCancelModalOpen(true);
  };

  const handleCancelBookingConfirm = () => {
    if (!cancelBookingId) return;
    setIsCancelSubmitting(true);

    api.cancelBooking(cancelBookingId)
      .then((res) => {
        if (res.success) {
          setIsCancelModalOpen(false);
          setCancelBookingId(null);
          fetchDashboardData();
        }
        setIsCancelSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsCancelSubmitting(false);
      });
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">User Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your active hour reservations and hosted co-working space listings in Seattle.</p>
      </div>

      {/* Tabs Menu Selection */}
      <div className="flex border-b border-zinc-200">
        <button
          onClick={() => {
            setActiveTab('bookings');
            navigate('/items/manage?tab=bookings');
          }}
          className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Calendar className="h-4 w-4" /> My Booking Reserves
        </button>

        <button
          onClick={() => {
            setActiveTab('spaces');
            navigate('/items/manage?tab=spaces');
          }}
          className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'spaces'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Briefcase className="h-4 w-4" /> My Hosted Listings
        </button>
      </div>

      {/* RENDER ACTIVE TAB BODY */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-zinc-200 rounded w-full" />
          <div className="h-20 bg-zinc-200 rounded w-full" />
          <div className="h-20 bg-zinc-200 rounded w-full" />
        </div>
      ) : activeTab === 'bookings' ? (
        // --- MY BOOKINGS VIEW ---
        userBookings.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="h-14 w-14 bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No Active Reservations</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
              You do not have any hour reservations booked yet. Explore our directory and reserve spaces.
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/explore')}>
              Explore Workspaces <Compass className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Workspace</th>
                    <th className="px-6 py-4">Reserved Date</th>
                    <th className="px-6 py-4">Time & Hours</th>
                    <th className="px-6 py-4">Total Cost</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {userBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {booking.workspace ? (
                          <button
                            onClick={() => navigate(`/workspace/${booking.workspaceId}`)}
                            className="font-bold text-zinc-950 hover:text-amber-600 flex items-center gap-1 cursor-pointer text-left focus:outline-none"
                          >
                            {booking.workspace.name} <ExternalLink className="h-3 w-3 shrink-0" />
                          </button>
                        ) : (
                          <span className="text-zinc-400 italic">Deleted workspace listing</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-700">{booking.date}</td>
                      <td className="px-6 py-4 text-zinc-500">
                        {booking.startTime} ({booking.durationHours} hrs)
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-900">${booking.totalPrice}</td>
                      <td className="px-6 py-4">
                        {booking.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-wide">
                            <CheckCircle className="h-3 w-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 uppercase tracking-wide">
                            <XCircle className="h-3 w-3" /> Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => triggerCancelBooking(booking.id)}
                          >
                            Cancel Reserve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card list View */}
            <div className="block md:hidden divide-y divide-zinc-150">
              {userBookings.map((booking) => (
                <div key={booking.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      {booking.workspace ? (
                        <h4 className="font-bold text-zinc-900">{booking.workspace.name}</h4>
                      ) : (
                        <h4 className="font-bold text-zinc-400 italic">Deleted space</h4>
                      )}
                      <p className="text-xs text-zinc-400 mt-0.5">{booking.date} @ {booking.startTime}</p>
                    </div>
                    {booking.status === 'confirmed' ? (
                      <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded uppercase">
                        Confirmed
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200 rounded uppercase">
                        Cancelled
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-zinc-500 bg-zinc-50 p-2.5 rounded-lg border border-zinc-150">
                    <span>Duration: <strong className="text-zinc-700">{booking.durationHours} hrs</strong></span>
                    <span>Total cost: <strong className="text-zinc-900">${booking.totalPrice}</strong></span>
                  </div>

                  {booking.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 border-red-100 hover:bg-red-50/50 justify-center"
                      onClick={() => triggerCancelBooking(booking.id)}
                    >
                      Cancel Reservation
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        // --- MY HOSTED LISTINGS VIEW ---
        ownedWorkspaces.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="h-14 w-14 bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No Workspaces Listed Yet</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
              You are not hosting any workspaces. Put your desks or recording studios to work and list your first workspace.
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/items/add')}>
              List a Workspace <PlusCircle className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Workspace Cover</th>
                    <th className="px-6 py-4">Workspace Details</th>
                    <th className="px-6 py-4">Hourly Price</th>
                    <th className="px-6 py-4">Neighborhood Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {ownedWorkspaces.map((space) => (
                    <tr key={space.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-3 shrink-0">
                        <img
                          src={space.image}
                          alt={space.name}
                          className="h-10 w-16 object-cover rounded border border-zinc-200"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <h4 className="font-bold text-zinc-950 capitalize">{space.name}</h4>
                        <p className="text-xs text-zinc-400 capitalize">{space.category.replace('_', ' ')} (Max {space.capacity} pax)</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-900">${space.pricePerHour} / hr</td>
                      <td className="px-6 py-4 text-zinc-500">{space.location}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/workspace/${space.id}`)}
                          className="text-xs px-2 py-1"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => triggerDeleteSpace(space.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card list View */}
            <div className="block md:hidden divide-y divide-zinc-150">
              {ownedWorkspaces.map((space) => (
                <div key={space.id} className="p-5 space-y-4">
                  <div className="flex gap-3">
                    <img
                      src={space.image}
                      alt={space.name}
                      className="h-14 w-20 object-cover rounded border border-zinc-200"
                    />
                    <div>
                      <h4 className="font-bold text-zinc-900 line-clamp-1">{space.name}</h4>
                      <p className="text-xs text-zinc-400 capitalize">{space.category.replace('_', ' ')} • Max {space.capacity} pax</p>
                      <p className="text-xs font-bold text-zinc-800 mt-1">${space.pricePerHour} / hour</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center text-xs"
                      onClick={() => navigate(`/workspace/${space.id}`)}
                    >
                      View details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-100 px-3"
                      onClick={() => triggerDeleteSpace(space.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* --- CONFIRM CANCEL BOOKING DIALOG MODAL --- */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Hour Reservation"
      >
        <div className="space-y-4 text-center py-2">
          <div className="h-12 w-12 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-zinc-950">Are you absolutely sure?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This will cancel your scheduled workspace reservation. If inside 24 hours of your start time, refunds will be issued as credits.
            </p>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100">
            <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isCancelSubmitting}
              onClick={handleCancelBookingConfirm}
            >
              Cancel Reservation
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- CONFIRM DELETE SPACE DIALOG MODAL --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Space Listing"
      >
        <div className="space-y-4 text-center py-2">
          <div className="h-12 w-12 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-zinc-950">Confirm Workspace Deletion</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This will permanently delete this co-working/studio listing from our directory. This action is irreversible. All pending reservations for this space may be invalidated.
            </p>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleteSubmitting}
              onClick={handleDeleteSpaceConfirm}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
