import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import {
  CheckCircle2,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Share2,
  Film,
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cinebookApi } from '../api/cinebookApi';
import { Booking } from '../types';

export const BookingConfirmationPage: React.FC = () => {
  const [, params] = useRoute('/booking/confirmation/:bookingId');
  const [, setLocation] = useLocation();
  const bookingId = params?.bookingId || '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    cinebookApi
      .getBookingById(bookingId)
      .then((data) => {
        setBooking(data);
        // Shoot celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 }
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share && booking) {
      navigator.share({
        title: `Cinebook Movie Ticket: ${booking.movieTitle}`,
        text: `I just booked tickets for ${booking.movieTitle} at ${booking.theatreName} on ${booking.showDate} (${booking.showTime})!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14151f] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#f84464] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Retrieving your confirmed ticket pass...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md">
          <Ticket className="w-12 h-12 text-[#f84464] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Booking Not Found</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Unable to locate this booking ID.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-[#f84464] text-white text-xs font-bold inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Celebration Header */}
        <div className="text-center mb-8 print:hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
            Booking Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your M-Ticket has been confirmed and dispatched to{' '}
            <strong className="text-gray-900">{booking.customerEmail}</strong> and WhatsApp{' '}
            <strong className="text-gray-900">+91 {booking.customerPhone}</strong>.
          </p>
        </div>

        {/* Digital M-Ticket Card (BookMyShow Styling) */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl print:border-none print:shadow-none">
          {/* Header strip */}
          <div className="bg-[#1a1a24] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f84464] flex items-center justify-center text-white font-bold">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black tracking-wider uppercase text-[#f84464]">
                  Official Cinema Pass • M-Ticket
                </span>
                <h3 className="text-lg font-bold text-white font-display">
                  {booking.theatreName}
                </h3>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                Booking ID / PNR
              </span>
              <span className="font-mono text-base font-black text-emerald-400">
                {booking.bookingCode}
              </span>
            </div>
          </div>

          {/* Ticket Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Poster & Movie Meta */}
              <div className="md:col-span-8 flex gap-4">
                <img
                  src={booking.moviePoster}
                  alt={booking.movieTitle}
                  className="w-24 sm:w-28 aspect-[2/3] object-cover rounded-xl shadow-md shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-display">
                      {booking.movieTitle}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 font-bold text-gray-700">
                      {booking.movieCertificate}
                    </span>
                    <span>•</span>
                    <span>{booking.language}</span>
                    <span>•</span>
                    <span className="font-bold text-[#f84464]">{booking.format}</span>
                  </div>

                  <div className="pt-2 text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Date: <strong className="text-gray-900">{booking.showDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Time: <strong className="text-emerald-700 font-bold">{booking.showTime}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{booking.screenName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scannable QR Code */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                <img
                  src={booking.qrCodeUrl}
                  alt="Entry QR Pass"
                  className="w-32 h-32 rounded-lg bg-white p-1 border border-gray-200 shadow-sm"
                />
                <span className="text-[10px] font-bold text-gray-500 mt-2">
                  Scan at Cinema Turnstile
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Gate Entry Valid
                </span>
              </div>
            </div>

            {/* Dashed Tear-off Separator */}
            <div className="relative my-4">
              <div className="border-t-2 border-dashed border-gray-200" />
              <div className="absolute -left-10 -top-3 w-6 h-6 rounded-full bg-[#f5f5f7] print:hidden" />
              <div className="absolute -right-10 -top-3 w-6 h-6 rounded-full bg-[#f5f5f7] print:hidden" />
            </div>

            {/* Seat Numbers Highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Seat Category</span>
                <strong className="text-sm font-black text-gray-900">{booking.seatTier}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Seat Numbers</span>
                <strong className="text-base font-black text-[#f84464] font-mono">
                  {booking.seatIds.join(', ')}
                </strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Tickets</span>
                <strong className="text-sm font-black text-gray-900">{booking.seatIds.length}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Amount Paid</span>
                <strong className="text-base font-black text-gray-900 font-display">₹{booking.totalAmount}</strong>
              </div>
            </div>

            {/* Pre-ordered Food & Beverages if any */}
            {booking.snacks && booking.snacks.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">
                  🍿 Pre-Ordered Food & Beverages (Collect at Cinema Snack Counter):
                </span>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {booking.snacks.map((s) => (
                    <span key={s.snackId} className="px-2 py-1 rounded-lg bg-white border border-amber-200 font-semibold">
                      {s.quantity}x {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Details info */}
            <div className="pt-2 text-xs text-gray-500 flex flex-wrap justify-between gap-2 border-t border-gray-100">
              <div>Booked by: <strong className="text-gray-900">{booking.customerName}</strong></div>
              <div>Payment Mode: <strong className="text-gray-900">{booking.paymentMethod}</strong></div>
              <div>Booked on: <strong className="text-gray-900">{new Date(booking.bookedAt).toLocaleString('en-IN')}</strong></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF Ticket
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Link Copied!' : 'Share Pass'}
          </button>

          <Link
            href="/my-bookings"
            className="px-6 py-2.5 rounded-xl bg-[#222436] hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            View in My Bookings
          </Link>

          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white text-xs font-bold shadow-cine-red transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Film className="w-4 h-4" />
            Book More Movies
          </Link>
        </div>
      </div>
    </div>
  );
};
