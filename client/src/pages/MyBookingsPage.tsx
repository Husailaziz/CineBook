import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Booking } from '../types';

export const MyBookingsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, bookings, cancelBooking, refreshBookings, isLoadingBookings } = useUser();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const pastBookings = bookings.filter((b) => b.status === 'CANCELLED');

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancellingId(cancelModalBooking.id);
    try {
      await cancelBooking(cancelModalBooking.id);
      setCancelModalBooking(null);
    } catch (e: any) {
      alert(e.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Ticket className="w-6 h-6 text-[#f84464]" />
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                My Movie Bookings
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your confirmed Hindi movie tickets, view QR passes, or cancel bookings.
            </p>
          </div>

          <button
            onClick={() => refreshBookings()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-xs font-bold text-gray-700 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            Refresh
          </button>
        </div>

        {/* Content */}
        {isLoadingBookings ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl border border-gray-200 animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center max-w-md mx-auto shadow-sm">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Bookings Found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              You haven't booked any movie tickets yet. Explore today's Hindi blockbusters!
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white text-xs font-bold shadow-cine-red inline-block cursor-pointer"
            >
              Browse Movies Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Bookings */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <span>Active Tickets ({activeBookings.length})</span>
              </h2>

              {activeBookings.length === 0 ? (
                <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
                  No currently active tickets.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex gap-4">
                        <img
                          src={b.moviePoster}
                          alt={b.movieTitle}
                          className="w-20 sm:w-24 aspect-[2/3] object-cover rounded-xl shadow shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-gray-900">
                              {b.movieTitle}
                            </h3>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              CONFIRMED
                            </span>
                          </div>

                          <div className="text-xs text-gray-500">
                            {b.theatreName} • {b.screenName}
                          </div>

                          <div className="text-xs text-gray-700 font-semibold pt-1 flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {b.showDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {b.showTime}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-[#f84464] font-bold">
                              Seats: {b.seatIds.join(', ')} ({b.seatTier})
                            </span>
                          </div>

                          <div className="text-[11px] text-gray-400 pt-1">
                            PNR: <strong className="font-mono text-gray-800">{b.bookingCode}</strong> • Total Paid: <strong className="text-gray-900">₹{b.totalAmount}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap sm:flex-col items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                        <Link
                          href={`/booking/confirmation/${b.id}`}
                          className="px-4 py-2 rounded-xl bg-[#222436] hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#f84464]" />
                          View M-Ticket Pass
                        </Link>

                        <button
                          onClick={() => setCancelModalBooking(b)}
                          className="px-4 py-2 rounded-xl border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-600 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past / Cancelled Bookings */}
            {pastBookings.length > 0 && (
              <div className="pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Cancelled / Refunded Bookings ({pastBookings.length})
                </h2>
                <div className="space-y-3 opacity-75">
                  {pastBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-800 text-sm">{b.movieTitle}</strong>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            CANCELLED
                          </span>
                        </div>
                        <div className="text-gray-500 mt-0.5">
                          {b.theatreName} • {b.showDate} {b.showTime} • Seats: {b.seatIds.join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600 font-bold block">Refund Processed</span>
                        <span className="text-gray-400 text-[11px]">₹{b.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Cancel Movie Booking?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to cancel your tickets for{' '}
                <strong className="text-gray-900">{cancelModalBooking.movieTitle}</strong> at{' '}
                {cancelModalBooking.theatreName}?
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 text-xs text-left space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Seats:</span>
                <strong className="text-gray-900">{cancelModalBooking.seatIds.join(', ')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Refund Amount:</span>
                <strong className="text-emerald-600 font-bold">₹{cancelModalBooking.totalAmount}</strong>
              </div>
              <div className="text-[11px] text-gray-400 pt-1">
                Seats will be released back for other moviegoers. Refund will be credited to original payment mode.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!!cancellingId}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                {cancellingId ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
