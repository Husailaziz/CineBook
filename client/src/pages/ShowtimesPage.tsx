import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Film,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { cinebookApi } from '../api/cinebookApi';
import { Movie, Theatre, Show } from '../types';

export const ShowtimesPage: React.FC = () => {
  const [, params] = useRoute('/movie/:id/shows');
  const [, setLocation] = useLocation();
  const { currentCity } = useCity();
  const movieId = params?.id || 'stree-2';

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatresWithShows, setTheatresWithShows] = useState<Array<Theatre & { shows: Show[] }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Date selection
  const [datesList, setDatesList] = useState<{ date: string; day: string; dateNum: string; month: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Filters
  const [filterPrice, setFilterPrice] = useState<'ALL' | 'UNDER_250' | '250_TO_450' | 'ABOVE_450'>('ALL');
  const [filterTime, setFilterTime] = useState<'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'>('ALL');
  const [filterFormat, setFilterFormat] = useState('ALL');

  useEffect(() => {
    // Generate next 7 dates
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const day = i === 0 ? 'TODAY' : i === 1 ? 'TOM' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dateNum = d.getDate().toString();
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      dates.push({ date: iso, day, dateNum, month });
    }
    setDatesList(dates);
    setSelectedDate(dates[0].date);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setIsLoading(true);
    Promise.all([
      cinebookApi.getMovieById(movieId),
      cinebookApi.getShows(movieId, currentCity.id, selectedDate)
    ])
      .then(([movieData, showsData]) => {
        setMovie(movieData);
        setTheatresWithShows(showsData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [movieId, currentCity.id, selectedDate]);

  // Apply filters on shows
  const filteredTheatres = theatresWithShows
    .map((theatre) => {
      const matchingShows = theatre.shows.filter((show) => {
        // Price filter: match if any seat tier matches price range
        if (filterPrice !== 'ALL') {
          const minPrice = Math.min(...show.seatTiers.map((t) => t.price));
          if (filterPrice === 'UNDER_250' && minPrice > 250) return false;
          if (filterPrice === '250_TO_450' && (minPrice < 250 || minPrice > 450)) return false;
          if (filterPrice === 'ABOVE_450' && minPrice < 450) return false;
        }

        // Timing filter
        if (filterTime !== 'ALL') {
          const hour = parseInt(show.time.split(':')[0]);
          const isPM = show.time.includes('PM');
          const hour24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

          if (filterTime === 'MORNING' && (hour24 >= 12 || hour24 < 6)) return false;
          if (filterTime === 'AFTERNOON' && (hour24 < 12 || hour24 >= 16)) return false;
          if (filterTime === 'EVENING' && (hour24 < 16 || hour24 >= 19)) return false;
          if (filterTime === 'NIGHT' && hour24 < 19) return false;
        }

        // Format filter
        if (filterFormat !== 'ALL' && show.format !== filterFormat) {
          return false;
        }

        return true;
      });

      return {
        ...theatre,
        shows: matchingShows
      };
    })
    .filter((t) => t.shows.length > 0);

  const getStatusColor = (status: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL') => {
    switch (status) {
      case 'AVAILABLE':
        return 'border-emerald-500/50 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-500 hover:text-white';
      case 'FILLING_FAST':
        return 'border-amber-500/50 text-amber-700 bg-amber-50/50 hover:bg-amber-500 hover:text-white';
      case 'ALMOST_FULL':
        return 'border-rose-500/50 text-rose-600 bg-rose-50/50 hover:bg-rose-500 hover:text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* 1. Movie Mini Banner Header */}
      {movie && (
        <div className="bg-[#1a1a24] text-white py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href={`/movie/${movie.id}`}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                      {movie.title}
                    </h1>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15 text-gray-200">
                      {movie.certificate}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <span>{movie.genres.join(' • ')}</span>
                    <span>•</span>
                    <span>Hindi</span>
                    <span>•</span>
                    <span>{movie.runtimeFormatted}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-gray-400 block">Selected City</span>
                  <strong className="text-white text-sm">{currentCity.name}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Horizontal Date Selector Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {datesList.map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <button
                  key={item.date}
                  onClick={() => setSelectedDate(item.date)}
                  className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#f84464] text-white shadow-cine-red font-bold'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <span className="text-[10px] tracking-wider font-semibold opacity-90">{item.day}</span>
                  <span className="text-lg font-black leading-none my-0.5">{item.dateNum}</span>
                  <span className="text-[10px] tracking-wider font-semibold opacity-80">{item.month}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Price filter */}
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:border-[#f84464]"
            >
              <option value="ALL">Price: All</option>
              <option value="UNDER_250">₹0 - ₹250 (Classic)</option>
              <option value="250_TO_450">₹250 - ₹450 (Prime)</option>
              <option value="ABOVE_450">₹450+ (Recliner VIP)</option>
            </select>

            {/* Time filter */}
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:border-[#f84464]"
            >
              <option value="ALL">Showtimes: All Day</option>
              <option value="MORNING">Morning (12am - 12pm)</option>
              <option value="AFTERNOON">Afternoon (12pm - 4pm)</option>
              <option value="EVENING">Evening (4pm - 7pm)</option>
              <option value="NIGHT">Night (7pm - 12am)</option>
            </select>

            {/* Format filter */}
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:border-[#f84464]"
            >
              <option value="ALL">Special Formats: All</option>
              <option value="2D">Standard 2D</option>
              <option value="IMAX 2D">IMAX 2D Laser</option>
              <option value="4DX">4DX Motion</option>
            </select>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Filling Fast
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Almost Full
            </span>
          </div>
        </div>
      </div>

      {/* 4. Theatres & Timings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl border border-gray-200 animate-pulse space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="flex gap-3">
                  <div className="h-10 w-24 bg-gray-200 rounded-xl" />
                  <div className="h-10 w-24 bg-gray-200 rounded-xl" />
                  <div className="h-10 w-24 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTheatres.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center max-w-lg mx-auto">
            <Film className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Shows Available</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              There are no matching showtimes for the selected filters in {currentCity.name}. Try selecting another date or adjusting filters.
            </p>
            <button
              onClick={() => {
                setFilterPrice('ALL');
                setFilterTime('ALL');
                setFilterFormat('ALL');
              }}
              className="px-5 py-2 rounded-xl bg-[#f84464] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTheatres.map((theatre) => (
              <div
                key={theatre.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Theatre Details */}
                  <div className="space-y-1.5 lg:max-w-sm">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-gray-900 font-display">
                        {theatre.name}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {theatre.address}
                    </p>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      {theatre.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium"
                        >
                          {amenity}
                        </span>
                      ))}

                      {theatre.cancellationAvailable && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                          Cancellation Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Show Timing Buttons Grid */}
                  <div className="flex-1 flex flex-wrap gap-3">
                    {theatre.shows.map((show) => {
                      const colorClass = getStatusColor(show.fillingStatus);
                      return (
                        <button
                          key={show.id}
                          onClick={() => setLocation(`/booking/${show.id}`)}
                          className={`group relative p-3 rounded-xl border transition-all text-center min-w-[120px] cursor-pointer ${colorClass}`}
                        >
                          <div className="font-bold text-sm tracking-wide">
                            {show.time}
                          </div>

                          <div className="text-[10px] uppercase font-semibold mt-0.5 flex items-center justify-center gap-1">
                            <span>{show.format}</span>
                            <span>•</span>
                            <span>Hindi</span>
                          </div>

                          <div className="text-[10px] opacity-80 mt-1">
                            From ₹{Math.min(...show.seatTiers.map((t) => t.price))}
                          </div>

                          {/* Hover Tooltip with seat tier prices */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-44 p-2.5 rounded-xl bg-[#1a1a24] text-white text-[11px] shadow-xl pointer-events-none">
                            <div className="font-bold border-b border-white/10 pb-1 mb-1 text-center text-[#f84464]">
                              {show.screenName}
                            </div>
                            <div className="space-y-0.5 text-left">
                              {show.seatTiers.map((tier) => (
                                <div key={tier.tier} className="flex justify-between">
                                  <span>{tier.tier}:</span>
                                  <strong>₹{tier.price}</strong>
                                </div>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
