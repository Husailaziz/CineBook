import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import {
  ChevronLeft,
  ShieldCheck,
  Tag,
  CreditCard,
  QrCode,
  Smartphone,
  CheckCircle2,
  Lock,
  Heart,
  HelpCircle,
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cinebookApi } from '../api/cinebookApi';
import { useUser } from '../context/UserContext';
import { Show, Movie, Theatre, BookingSnack } from '../types';

export const CheckoutPage: React.FC = () => {
  const [, params] = useRoute('/booking/:showId/checkout');
  const [, setLocation] = useLocation();
  const showId = params?.showId || '';
  const { user, refreshBookings } = useUser();

  const [show, setShow] = useState<Show | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [loading, setLoading] = useState(true);

  // Read session storage booking details
  const [sessionData, setSessionData] = useState<{
    selectedSeatIds: string[];
    ticketsAmount: number;
    snacks: BookingSnack[];
    snacksAmount: number;
  }>({
    selectedSeatIds: [],
    ticketsAmount: 0,
    snacks: [],
    snacksAmount: 0
  });

  // Contact Info
  const [customerName, setCustomerName] = useState(user.name);
  const [customerEmail, setCustomerEmail] = useState(user.email);
  const [customerPhone, setCustomerPhone] = useState(user.phone);

  // Promo Code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);

  // Donation
  const [donationOptIn, setDonationOptIn] = useState(true);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('');

  // Submitting
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem(`cinebook_booking_${showId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSessionData({
          selectedSeatIds: parsed.selectedSeatIds || [],
          ticketsAmount: parsed.ticketsAmount || 0,
          snacks: parsed.snacks || [],
          snacksAmount: parsed.snacksAmount || 0
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (!showId) return;
    setLoading(true);
    cinebookApi
      .getShowSeats(showId)
      .then((data) => {
        setShow(data.show);
        setMovie(data.movie);
        setTheatre(data.theatre);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [showId]);

  // Convenience Fee calculation
  const convenienceFee = (sessionData.selectedSeatIds.length || 1) * 35;
  const convenienceGst = +(convenienceFee * 0.18).toFixed(2);
  const donation = donationOptIn ? 2 : 0;
  const discount = appliedPromo ? appliedPromo.discount : 0;

  const grandTotal = Math.max(
    0,
    +(sessionData.ticketsAmount + convenienceFee + convenienceGst + sessionData.snacksAmount + donation - discount).toFixed(2)
  );

  const handleApplyPromo = async (codeToTry?: string) => {
    const code = codeToTry || promoInput;
    if (!code.trim()) return;

    setIsVerifyingPromo(true);
    setPromoError('');
    try {
      const subtotal = sessionData.ticketsAmount + sessionData.snacksAmount;
      const result = await cinebookApi.verifyPromo(code, subtotal);
      if (result.valid) {
        setAppliedPromo({ code: code.toUpperCase(), discount: result.discount, message: result.message });
        setPromoInput('');
      } else {
        setPromoError(result.message);
        setAppliedPromo(null);
      }
    } catch (err: any) {
      setPromoError(err.message || 'Failed to verify promo');
    } finally {
      setIsVerifyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handlePayAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerPhone || !customerName) {
      setBookingError('Please enter your name, email and phone number');
      return;
    }

    if (sessionData.selectedSeatIds.length === 0) {
      setBookingError('No seats selected. Please go back and select seats.');
      return;
    }

    setIsProcessing(true);
    setBookingError('');

    try {
      const booking = await cinebookApi.createBooking({
        showId,
        seatIds: sessionData.selectedSeatIds,
        snacks: sessionData.snacks,
        customerName,
        customerEmail,
        customerPhone,
        promoCode: appliedPromo?.code,
        donationOptIn,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI (Google Pay / PhonePe)' : paymentMethod === 'CARD' ? 'Visa / Mastercard' : 'Net Banking'
      });

      // Trigger Confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      await refreshBookings();
      // Clear session storage
      sessionStorage.removeItem(`cinebook_booking_${showId}`);

      // Navigate to confirmation page
      setLocation(`/booking/confirmation/${booking.id}`);
    } catch (err: any) {
      setBookingError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !show || !movie || !theatre) {
    return (
      <div className="min-h-screen bg-[#14151f] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#f84464] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Preparing payment checkout summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setLocation(`/booking/${showId}/snacks`)}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Snacks
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted Checkout
          </div>
        </div>

        {bookingError && (
          <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {bookingError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact & Payment Modes */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact Information Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-sm text-gray-900">
                  Share Your Contact Details
                </h3>
                <span className="text-[11px] text-[#f84464] font-semibold">
                  For M-Ticket Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="e.g. Aman Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#f84464]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-xs text-gray-600 font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#f84464]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email Address (Ticket sent here) *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    placeholder="aman.sharma@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#f84464]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Options Simulator */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
                Select Payment Mode
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-[#f84464] bg-rose-50 text-[#f84464] font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1.5" />
                  <span className="text-xs">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'border-[#f84464] bg-rose-50 text-[#f84464] font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1.5" />
                  <span className="text-xs">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-[#f84464] bg-rose-50 text-[#f84464] font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1.5" />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">Scan & Pay via any UPI App</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Instant Confirmation
                    </span>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm shrink-0">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=cinebook@upi&pn=Cinebook&am=999"
                        alt="UPI QR Code"
                        className="w-20 h-20"
                      />
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="font-semibold text-gray-900">Google Pay • PhonePe • Paytm • BHIM</p>
                      <p className="text-[11px] text-gray-500">Scan this QR code with any UPI app on your phone, or enter UPI ID below.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Or Enter UPI ID (e.g. mobile@upi)
                    </label>
                    <input
                      type="text"
                      placeholder="username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#f84464]"
                    />
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8821"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs text-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking options */}
              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-xs font-semibold text-gray-700 block mb-2">Select Your Bank</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'SBI Bank', 'Axis Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        className="p-2 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:border-[#f84464]"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Promo Code */}
          <div className="lg:col-span-5 space-y-5">
            {/* Booking Summary Box (BookMyShow Styled) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
              <div className="flex gap-4 border-b border-gray-100 pb-4">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-xl shadow shrink-0"
                />
                <div>
                  <h3 className="font-bold text-base text-gray-900 leading-tight">
                    {movie.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>{movie.certificate}</span> • <span>Hindi</span> • <span>{show.format}</span>
                  </div>
                  <div className="text-xs font-semibold text-gray-800 mt-2">
                    {theatre.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {show.screenName}
                  </div>
                </div>
              </div>

              {/* Show & Seats Detail */}
              <div className="bg-[#f8f9fc] p-3.5 rounded-xl text-xs space-y-1.5 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Show Date & Time:</span>
                  <strong className="text-gray-900">{show.date} | {show.time}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Seats ({sessionData.selectedSeatIds.length}):</span>
                  <strong className="text-[#f84464] font-mono text-sm">
                    {sessionData.selectedSeatIds.join(', ')}
                  </strong>
                </div>
              </div>

              {/* Promo Code Input & Badges */}
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#f84464]" />
                  Unlock Offers or Apply Promo Code
                </label>

                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div>
                      <div className="font-bold text-emerald-800">{appliedPromo.code} Applied</div>
                      <div className="text-emerald-600 text-[11px]">{appliedPromo.message}</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Promo Code (e.g. CINEBOOK100)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 font-mono focus:outline-none focus:border-[#f84464]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyPromo()}
                        disabled={isVerifyingPromo || !promoInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#222436] hover:bg-black text-white text-xs font-bold disabled:opacity-40 transition-colors"
                      >
                        {isVerifyingPromo ? 'Checking...' : 'Apply'}
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{promoError}</p>
                    )}

                    {/* Quick promo code suggestions */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['CINEBOOK100', 'BOLLYWOOD50', 'CINEVIP20'].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleApplyPromo(code)}
                          className="px-2 py-0.5 rounded bg-gray-100 hover:bg-rose-50 text-[10px] font-mono font-bold text-gray-700 hover:text-[#f84464] border border-gray-200"
                        >
                          +{code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tickets Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{sessionData.ticketsAmount}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Convenience Fee (₹35 × {sessionData.selectedSeatIds.length})</span>
                  <span className="font-semibold text-gray-900">₹{convenienceFee}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>GST on Convenience Fee (18%)</span>
                  <span className="font-semibold text-gray-900">₹{convenienceGst}</span>
                </div>

                {sessionData.snacksAmount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Food & Beverage ({sessionData.snacks.length} items)</span>
                    <span className="font-semibold text-gray-900">₹{sessionData.snacksAmount}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Coupon ({appliedPromo.code})</span>
                    <span>- ₹{appliedPromo.discount}</span>
                  </div>
                )}

                {/* BookASmile Charity donation toggle */}
                <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700 text-xs">
                    <input
                      type="checkbox"
                      checked={donationOptIn}
                      onChange={(e) => setDonationOptIn(e.target.checked)}
                      className="rounded text-[#f84464] focus:ring-[#f84464]"
                    />
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      BookASmile Contribution
                    </span>
                  </label>
                  <span className="font-bold text-gray-900">₹2</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t-2 border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Total Payable Amount</span>
                  <strong className="text-2xl font-black text-[#f84464] font-display">
                    ₹{grandTotal}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handlePayAndBook}
                  disabled={isProcessing}
                  className="px-8 py-3.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] disabled:opacity-50 text-white font-bold text-sm shadow-cine-red transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{grandTotal}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
