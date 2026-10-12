import React, { useState } from 'react';
import { Search, X, MapPin, Check } from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { City } from '../../types';

export const CityModal: React.FC = () => {
  const { isCityModalOpen, closeCityModal, currentCity, cities, selectCity } = useCity();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isCityModalOpen) return null;

  const popularCities = cities.filter((c) => c.isPopular);
  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1e202f] border border-white/10 text-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header & Search */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#f84464]" />
              <h3 className="text-lg font-bold text-white">Select Your City</h3>
            </div>
            <button
              onClick={closeCityModal}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your city (e.g. Mumbai, Delhi, Bengaluru...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#282a3e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#f84464] focus:ring-1 focus:ring-[#f84464]"
              autoFocus
            />
          </div>
        </div>

        {/* Popular Cities Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {!searchTerm && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-4">
                Popular Cities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {popularCities.map((city) => {
                  const isSelected = city.id === currentCity.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => selectCity(city)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center group ${
                        isSelected
                          ? 'border-[#f84464] bg-[#f84464]/10 text-white'
                          : 'border-white/5 bg-[#252738] hover:border-white/20 hover:bg-[#2c2e42] text-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-1.5 transform group-hover:scale-110 transition-transform">
                        {city.monumentIcon || '🏛️'}
                      </span>
                      <span className="text-xs font-semibold truncate w-full">{city.name}</span>
                      {isSelected && (
                        <span className="text-[10px] text-[#f84464] font-bold mt-1 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All / Filtered Cities */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3">
              {searchTerm ? 'Search Results' : 'Other Cities'}
            </h4>
            {filteredCities.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No cities found matching "{searchTerm}"
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredCities.map((city) => {
                  const isSelected = city.id === currentCity.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => selectCity(city)}
                      className={`text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#f84464] text-white font-bold'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <span>{city.name}</span>
                      <span className="text-[10px] opacity-60">{city.state}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-[#181926] px-6 py-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>Current Location: <strong className="text-white">{currentCity.name}</strong></span>
          <span className="text-[11px] text-[#f84464]">Showtimes update automatically</span>
        </div>
      </div>
    </div>
  );
};
