import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Search,
  MapPin,
  ChevronDown,
  Ticket,
  User,
  Film,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { useUser } from '../../context/UserContext';
import { cinebookApi } from '../../api/cinebookApi';
import { Movie } from '../../types';

export const Navbar: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { currentCity, openCityModal } = useCity();
  const { user, bookings } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await cinebookApi.getMovies({ search: searchQuery });
        setSearchResults(results.slice(0, 5));
        setShowSearchDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a24] text-white shadow-md">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f84464] to-[#ff6b8b] flex items-center justify-center shadow-cine-red group-hover:scale-105 transition-transform">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-2xl font-black tracking-tight text-white font-display">cine</span>
                  <span className="text-2xl font-black tracking-tight text-[#f84464] font-display">book</span>
                </div>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold -mt-1 hidden sm:inline">
                  Hindi Movies & Theatres
                </span>
              </div>
            </Link>
          </div>

          {/* Instant Search Bar */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for Hindi Movies, Actors, Theatres (e.g. Stree 2, Jawan, PVR...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#252533] border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#f84464] focus:ring-1 focus:ring-[#f84464] transition-all"
              />
              {isSearching && (
                <div className="absolute right-3 w-4 h-4 border-2 border-[#f84464] border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#222436] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-white/5 bg-[#1b1c2b]">
                  Movies Matching "{searchQuery}"
                </div>
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                  {searchResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                        setLocation(`/movie/${m.id}`);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[#2c2d44] transition-colors group"
                    >
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-10 h-14 object-cover rounded shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white group-hover:text-[#f84464] transition-colors truncate">
                          {m.title}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span className="text-[#f84464] font-semibold">★ {m.rating}</span>
                          <span>•</span>
                          <span>{m.genres.join(', ')}</span>
                          <span>•</span>
                          <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px]">{m.certificate}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#f84464] opacity-0 group-hover:opacity-100 transition-opacity">
                        Book Now →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Actions: City, Bookings, User */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* City Selector Pill */}
            <button
              onClick={openCityModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252533] hover:bg-[#2f2f42] border border-white/10 text-xs sm:text-sm font-medium text-white transition-all group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#f84464]" />
              <span className="max-w-[80px] sm:max-w-none truncate">{currentCity.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
            </button>

            {/* My Bookings Button */}
            <Link
              href="/my-bookings"
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#252533] hover:bg-[#2f2f42] border border-white/10 text-xs sm:text-sm font-medium text-white transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-[#f84464]" />
              <span className="hidden sm:inline">My Bookings</span>
              {bookings.filter((b) => b.status === 'CONFIRMED').length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-[10px] font-black rounded-full bg-[#f84464] text-white">
                  {bookings.filter((b) => b.status === 'CONFIRMED').length}
                </span>
              )}
            </Link>

            {/* User Pill */}
            <div className="flex items-center gap-2 pl-1 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs shadow">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold hidden lg:inline text-gray-200">
                {user.name.split(' ')[0]}
              </span>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Hindi movies, theatres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#252533] border border-white/10 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#f84464]"
            />
          </div>
        </div>
      </div>

      {/* BookMyShow Style Secondary Categories Bar */}
      <div className="bg-[#222436] border-t border-white/5 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 overflow-x-auto no-scrollbar gap-6">
            <div className="flex items-center gap-6 text-gray-300">
              <Link href="/" className="hover:text-white text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <Film className="w-3.5 h-3.5 text-[#f84464]" />
                Movies
              </Link>
              <Link href="/stream" className="hover:text-white transition-colors cursor-pointer">
                Stream
              </Link>
              <Link href="/events" className="hover:text-white transition-colors cursor-pointer">
                Events
              </Link>
              <Link href="/plays" className="hover:text-white transition-colors cursor-pointer">
                Plays
              </Link>
              <Link href="/sports" className="hover:text-white transition-colors cursor-pointer">
                Sports
              </Link>
              <Link href="/buzz" className="hover:text-white transition-colors cursor-pointer">
                Buzz
              </Link>
            </div>

            <div className="flex items-center gap-5 text-gray-400">
              <Link href="/offers" className="hover:text-[#f84464] text-[#f84464] flex items-center gap-1 font-semibold transition-colors cursor-pointer">
                <Sparkles className="w-3.5 h-3.5" />
                Offers & Promo Codes
              </Link>
              <span className="hidden sm:inline hover:text-white transition-colors cursor-pointer">
                Gift Cards
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
