import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Film,
  Star,
  Play,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Clock,
  Compass,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { cinebookApi } from '../api/cinebookApi';
import { Movie, Theatre } from '../types';
import { TrailerModal } from '../components/common/TrailerModal';

export const HomePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { currentCity } = useCity();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [isLoading, setIsLoading] = useState(true);

  // Hero carousel state
  const [heroIndex, setHeroIndex] = useState(0);

  // Trailer modal state
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  // Interested click state
  const [interestedIds, setInterestedIds] = useState<Record<string, number>>({});

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      cinebookApi.getMovies(),
      cinebookApi.getTheatres(currentCity.id)
    ])
      .then(([movieList, theatreList]) => {
        setMovies(movieList);
        setTheatres(theatreList);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentCity.id]);

  const nowShowing = movies.filter((m) => m.status === 'now_showing');
  const comingSoon = movies.filter((m) => m.status === 'coming_soon');

  // Filter now showing movies by genre and format
  const filteredNowShowing = nowShowing.filter((m) => {
    const matchesGenre =
      selectedGenre === 'All' ||
      m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
    const matchesFormat =
      selectedFormat === 'All Formats' ||
      m.formats.some((f) => f.toLowerCase() === selectedFormat.toLowerCase());
    return matchesGenre && matchesFormat;
  });

  const featuredMovies = nowShowing.slice(0, 4);

  // Auto rotate hero carousel every 6s
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const activeHero = featuredMovies[heroIndex] || featuredMovies[0];

  const handleInterested = (movieId: string, currentCount: number = 0) => {
    setInterestedIds((prev) => ({
      ...prev,
      [movieId]: (prev[movieId] || currentCount) + 1
    }));
  };

  const genresList = ['All', 'Action', 'Comedy', 'Horror', 'Drama', 'Thriller', 'Fantasy'];
  const formatsList = ['All Formats', '2D', '3D', 'IMAX 2D', '4DX'];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* 1. Hero Featured Bollywood Carousel */}
      {activeHero && (
        <section className="relative bg-[#10111a] text-white overflow-hidden">
          {/* Backdrop with gradient overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src={activeHero.bannerUrl}
              alt={activeHero.title}
              className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10111a] via-[#10111a]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#10111a] via-[#10111a]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Info Column */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f84464]/20 border border-[#f84464]/40 text-[#f84464] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Blockbuster in {currentCity.name}
                </div>

                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display">
                    {activeHero.title}
                  </h1>
                  {activeHero.hindiTitle && (
                    <p className="text-xl sm:text-2xl font-bold text-gray-400 font-display">
                      {activeHero.hindiTitle}
                    </p>
                  )}
                </div>

                {/* Rating & Badges */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{activeHero.rating}/10</span>
                    <span className="text-gray-400 text-xs">({(activeHero.votesCount / 1000).toFixed(0)}K+ Votes)</span>
                  </div>

                  <span className="px-2.5 py-1 rounded bg-white/10 text-gray-200 font-semibold text-xs">
                    {activeHero.certificate}
                  </span>

                  <span className="text-gray-300 font-medium">
                    {activeHero.runtimeFormatted}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {activeHero.formats.map((fmt) => (
                      <span key={fmt} className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#f84464]/20 text-[#f84464] border border-[#f84464]/30">
                        {fmt}
                      </span>
                    ))}
                  </div>

                  <span className="text-gray-400">
                    {activeHero.genres.join(' • ')}
                  </span>
                </div>

                {/* Synopsis */}
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-2xl">
                  {activeHero.synopsis}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setLocation(`/movie/${activeHero.id}/shows`)}
                    className="px-8 py-3.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white font-bold text-sm sm:text-base shadow-cine-red transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <Film className="w-4 h-4" />
                    Book Tickets
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {activeHero.trailerEmbedId && (
                    <button
                      onClick={() => setTrailerMovie(activeHero)}
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Watch Trailer
                    </button>
                  )}

                  <Link
                    href={`/movie/${activeHero.id}`}
                    className="text-xs sm:text-sm text-gray-300 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    View Cast & Reviews
                  </Link>
                </div>
              </div>

              {/* Right Poster Column */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="relative group cursor-pointer" onClick={() => setLocation(`/movie/${activeHero.id}`)}>
                  <img
                    src={activeHero.posterUrl}
                    alt={activeHero.title}
                    className="w-56 sm:w-64 h-80 sm:h-96 object-cover rounded-2xl shadow-2xl border-2 border-white/10 group-hover:scale-[1.02] transition-transform"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-bold text-white bg-[#f84464] px-3 py-1.5 rounded-lg w-full text-center">
                      Explore Movie Details →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel navigation pills */}
            <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-6">
              <div className="flex items-center gap-2">
                {featuredMovies.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === heroIndex ? 'w-8 bg-[#f84464]' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHeroIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setHeroIndex((prev) => (prev + 1) % featuredMovies.length)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Offers Banner Strip */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                Special Offer
              </span>
              <span className="text-gray-700">
                Use code <strong className="text-[#f84464] font-mono font-bold">CINEBOOK100</strong> for Flat ₹100 Off on your first movie booking!
              </span>
            </div>
            <Link
              href="/offers"
              className="text-[#f84464] hover:text-[#e03657] font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All Cinema Offers →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Recommended Hindi Movies (Now Showing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#222436] tracking-tight font-display">
                Recommended Movies
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#f84464]">
                Hindi
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Top Bollywood blockbusters currently running in theatres across {currentCity.name}
            </p>
          </div>

          <div className="text-xs text-gray-500">
            Showing <strong className="text-gray-900">{filteredNowShowing.length}</strong> movies
          </div>
        </div>

        {/* Filters: Genre & Format Chips */}
        <div className="space-y-3 mb-8">
          {/* Genre Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> Genre:
            </span>
            {genresList.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-[#f84464] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Format Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-gray-500 shrink-0 mr-1">
              Format:
            </span>
            {formatsList.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFormat(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedFormat === f
                    ? 'bg-[#222436] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="animate-pulse space-y-3">
                <div className="aspect-[2/3] bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredNowShowing.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
            <Film className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Movies Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              No movies match the selected filters "{selectedGenre}" and "{selectedFormat}".
            </p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSelectedFormat('All Formats');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#f84464] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
            {filteredNowShowing.map((movie) => (
              <div
                key={movie.id}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Rating Tag (BookMyShow style bottom black bar) */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{movie.rating}/10</span>
                    </div>
                    <span className="text-[10px] text-gray-300 font-medium">
                      {(movie.votesCount / 1000).toFixed(0)}K Votes
                    </span>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 backdrop-blur-sm text-white">
                      {movie.certificate}
                    </span>
                  </div>

                  {/* Quick Trailer overlay button */}
                  {movie.trailerEmbedId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrailerMovie(movie);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-[#f84464] text-white transition-colors shadow"
                      title="Watch Trailer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  )}
                </div>

                {/* Movie Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setLocation(`/movie/${movie.id}`)}
                      className="font-bold text-sm text-gray-900 line-clamp-1 hover:text-[#f84464] cursor-pointer transition-colors"
                    >
                      {movie.title}
                    </h3>

                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                      <span className="truncate">{movie.genres.slice(0, 2).join('/')}</span>
                      <span className="font-semibold text-gray-700">Hindi</span>
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setLocation(`/movie/${movie.id}/shows`)}
                      className="w-full py-2 rounded-lg bg-[#f84464] hover:bg-[#e03657] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      Book Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Upcoming Releases ("Coming Soon") Section */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[#222436] tracking-tight font-display">
                  Explore Upcoming Hindi Releases
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Blockbusters heading soon to theatres near you. Set reminders and reserve first-day tickets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {comingSoon.map((movie) => {
              const interest = interestedIds[movie.id] || movie.interestedCount || 0;
              return (
                <div
                  key={movie.id}
                  className="bg-[#f8f9fc] border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg transition-all"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full sm:w-40 aspect-[2/3] object-cover rounded-xl shadow-md shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#f84464] bg-[#f84464]/10 px-2.5 py-0.5 rounded-full">
                          Releasing {movie.releaseDate}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {movie.formats.join(', ')}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mt-2 font-display">
                        {movie.title}
                      </h3>
                      {movie.hindiTitle && (
                        <p className="text-sm text-gray-500 font-medium">{movie.hindiTitle}</p>
                      )}

                      <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                        {movie.synopsis}
                      </p>

                      <div className="mt-3 text-xs text-gray-500">
                        <strong>Starring:</strong> {movie.cast.slice(0, 3).map((c) => c.name).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleInterested(movie.id, movie.interestedCount)}
                        className="flex-1 py-2 px-3 rounded-lg bg-white border border-gray-300 hover:border-[#f84464] hover:text-[#f84464] text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-100 text-rose-500" />
                        <span>I'm Interested ({(interest / 1000).toFixed(1)}K)</span>
                      </button>

                      {movie.trailerEmbedId && (
                        <button
                          onClick={() => setTrailerMovie(movie)}
                          className="py-2 px-3 rounded-lg bg-[#222436] hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Trailer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. The Cinebook Premium Experience Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#f84464] uppercase tracking-wider">
            Why Book With Cinebook
          </span>
          <h2 className="text-3xl font-black text-[#222436] tracking-tight font-display mt-1">
            The Ultimate Cinema Experience
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Seamless seat reservation, verified M-tickets, and multiplex-exclusive amenities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Film className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-1">IMAX & 4DX Screenings</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Crystal-clear laser projection, deep immersion, and synchronized motion seats across partner chains.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#f84464] flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-1">Guaranteed M-Ticket</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Paperless digital tickets delivered directly to WhatsApp & SMS. Direct gate scanner entry.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-1">Grab a Bite in Advance</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Pre-order gourmet cheese popcorn, piping hot samosas, and chilled beverages at discounted combos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-1">Cancellation Protection</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hassle-free ticket cancellation up to 2 hours before showtime on eligible cinema multiplexes.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Partner Cinemas in Selected City */}
      <section className="bg-[#1f202e] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold font-display">
                Top Multiplexes in {currentCity.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Select your preferred theatre for live show timings and luxury recliner seating
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {theatres.length} Theatres Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {theatres.map((theatre) => (
              <div
                key={theatre.id}
                className="bg-[#282a3d] border border-white/5 rounded-xl p-5 hover:border-[#f84464]/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-white line-clamp-1">
                    {theatre.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    {theatre.chain}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {theatre.address}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {theatre.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-gray-300"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className={theatre.cancellationAvailable ? 'text-emerald-400' : 'text-gray-400'}>
                    {theatre.cancellationAvailable ? '✓ Cancellation Available' : 'Non-cancellable'}
                  </span>
                  <button
                    onClick={() => setLocation(`/movie/${movies[0]?.id || 'stree-2'}/shows`)}
                    className="text-[#f84464] font-semibold hover:underline"
                  >
                    View Shows →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          isOpen={!!trailerMovie}
          onClose={() => setTrailerMovie(null)}
          title={trailerMovie.title}
          embedId={trailerMovie.trailerEmbedId}
        />
      )}
    </div>
  );
};
