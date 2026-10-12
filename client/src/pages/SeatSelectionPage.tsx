import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import {
  ChevronLeft,
  Info,
  CheckCircle2,
  Users,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cinebookApi } from '../api/cinebookApi';
import { Show, Movie, Theatre, Seat } from '../types';

export const SeatSelectionPage: React.FC = () => {
  const [, params] = useRoute('/booking/:showId');
  const [, setLocation] = useLocation();
  const showId = params?.showId || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [show, setShow] = useState<Show | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [seatsByTier, setSeatsByTier] = useState<Record<string, { tier: string; price: number; rows: Record<string, Seat[]> }>>({});
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  // Seat Count target
  const [seatCountTarget, setSeatCountTarget] = useState(2);

  // Selected seats state
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    cinebookApi
      .getShowSeats(showId)
      .then((data) => {
        setShow(data.show);
        setMovie(data.movie);
        setTheatre(data.theatre);
        setSeatsByTier(data.seatsByTier);
        setBookedSeats(data.bookedSeats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [showId]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked' || bookedSeats.includes(seat.id)) {
      return;
    }

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((s) => s !== seat.id));
    } else {
      if (selectedSeatIds.length >= seatCountTarget) {
        // If already selected target seats, shift selection or replace
        setSelectedSeatIds([...selectedSeatIds.slice(1), seat.id]);
      } else {
        setSelectedSeatIds([...selectedSeatIds, seat.id]);
      }
    }
  };

  // Calculate pricing for selected seats
  const calculateTotal = () => {
    let total = 0;
    selectedSeatIds.forEach((seatId) => {
      const row = seatId[0];
      // find price
      for (const tierKey in seatsByTier) {
        const tier = seatsByTier[tierKey];
        if (tier.rows[row]) {
          total += tier.price;
          break;
        }
      }
    });
    return total;
  };

  const handleProceed = () => {
    if (selectedSeatIds.length === 0) return;
    // Save selected state in session storage for multi-step flow
    sessionStorage.setItem(
      `cinebook_booking_${showId}`,
      JSON.stringify({
        showId,
        selectedSeatIds,
        ticketsAmount: calculateTotal()
      })
    );
    setLocation(`/booking/${showId}/snacks`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14151f] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#f84464] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading cinema auditorium seat layout...</p>
        </div>
      </div>
    );
  }

  if (error || !show || !movie || !theatre) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900">Show Unavailable</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            {error || 'Unable to retrieve auditorium seat matrix.'}
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
    <div className="min-h-screen bg-[#0f1017] text-white flex flex-col justify-between">
      {/* 1. Header with Movie & Show Info */}
      <header className="bg-[#181926] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation(`/movie/${movie.id}/shows`)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white font-display">
                  {movie.title}
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                  {movie.certificate}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f84464]/20 text-[#f84464]">
                  {show.format}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                <span>{theatre.name}</span>
                <span>•</span>
                <span className="text-white font-medium">{show.screenName}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{show.time}</span>
              </div>
            </div>
          </div>

          {/* Seat count quick picker */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-gray-400 font-medium">Seats:</span>
            <div className="flex items-center gap-1 bg-[#222436] p-1 rounded-xl border border-white/10">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setSeatCountTarget(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    seatCountTarget === num
                      ? 'bg-[#f84464] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Interactive Seat Matrix Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        {/* Cinema Screen Curve Graphic */}
        <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
          <div className="w-full h-3 rounded-[100%] bg-gradient-to-r from-transparent via-cyan-400 to-transparent screen-glow shadow-cyan-500/50" />
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-cyan-400/80 mt-3 text-center">
            All Eyes This Way (Screen)
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-xs text-gray-400 bg-[#181926] px-6 py-2.5 rounded-full border border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md border border-white/40 bg-transparent flex items-center justify-center text-[10px] font-bold" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#f84464] flex items-center justify-center text-[10px] font-bold text-white shadow-sm" />
            <span>Selected ({selectedSeatIds.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-gray-700/60 opacity-40 cursor-not-allowed flex items-center justify-center text-[10px] font-bold text-gray-400" />
            <span>Sold</span>
          </div>
        </div>

        {/* Seat Rows by Tier */}
        <div className="w-full space-y-10 overflow-x-auto pb-6">
          {Object.entries(seatsByTier).map(([tierKey, tierData]) => (
            <div key={tierKey} className="space-y-3">
              {/* Tier Header with Price */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  {tierData.tier}
                </span>
                <span className="text-xs font-black text-[#f84464]">
                  ₹{tierData.price}
                </span>
              </div>

              {/* Rows inside this tier */}
              <div className="space-y-2.5 min-w-[600px]">
                {Object.entries(tierData.rows).map(([rowLetter, seats]) => (
                  <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3">
                    {/* Left Row Label */}
                    <span className="w-6 text-center text-xs font-bold text-gray-500">
                      {rowLetter}
                    </span>

                    {/* Seats with aisle divisions */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {seats.map((seat, seatIdx) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const isBooked = seat.status === 'booked' || bookedSeats.includes(seat.id);
                        // Add aisle spacer in the middle
                        const isMiddleAisle = seatIdx === Math.floor(seats.length / 2);

                        return (
                          <React.Fragment key={seat.id}>
                            {isMiddleAisle && <div className="w-4 sm:w-8" />}
                            <button
                              onClick={() => handleSeatClick(seat)}
                              disabled={isBooked}
                              title={`${seat.id} - ₹${seat.price}`}
                              className={`seat-button w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center ${
                                isSelected
                                  ? 'bg-[#f84464] text-white shadow-cine-red scale-105'
                                  : isBooked
                                  ? 'bg-gray-800 text-gray-600 border border-transparent cursor-not-allowed opacity-40'
                                  : 'border border-white/20 bg-[#1e202f] text-gray-200 hover:border-[#f84464] hover:text-[#f84464] hover:bg-[#25283b] cursor-pointer'
                              }`}
                            >
                              {seat.number}
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Right Row Label */}
                    <span className="w-6 text-center text-xs font-bold text-gray-500">
                      {rowLetter}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3. Bottom Sticky Action Drawer */}
      <footer className="bg-[#181926] border-t border-white/10 sticky bottom-0 z-40 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {selectedSeatIds.length === 0 ? (
              <div className="text-sm text-gray-400">
                Please select <strong className="text-white">{seatCountTarget} seats</strong> on the screen to proceed.
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-400">Selected Seats:</span>
                  <span className="font-mono font-bold text-white text-base">
                    {selectedSeatIds.sort().join(', ')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                    ({selectedSeatIds.length} {selectedSeatIds.length === 1 ? 'Seat' : 'Seats'})
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Tickets Subtotal: <strong className="text-[#f84464] text-sm">₹{calculateTotal()}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleProceed}
              disabled={selectedSeatIds.length === 0}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#f84464] hover:bg-[#e03657] disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm shadow-cine-red transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Snacks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
