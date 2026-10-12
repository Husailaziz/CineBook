import React from 'react';
import { Link } from 'wouter';
import { Film, ShieldCheck, Headphones, RefreshCw, Mail, Phone } from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const Footer: React.FC = () => {
  const { cities, selectCity } = useCity();

  return (
    <footer className="bg-[#1a1a24] text-gray-400 text-xs border-t border-white/10 mt-16">
      {/* Top Value Propositions */}
      <div className="bg-[#222436] py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f84464]/10 text-[#f84464]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Customer Care</h4>
              <p className="text-gray-400 text-xs">Helpdesk available around the clock for your bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f84464]/10 text-[#f84464]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Resend Booking Confirmation</h4>
              <p className="text-gray-400 text-xs">Instantly retrieve your M-Ticket via SMS or WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f84464]/10 text-[#f84464]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Safe & Verified</h4>
              <p className="text-gray-400 text-xs">Official multiplex partner tickets with instant QR scanning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Popular Hindi Movies */}
        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Popular Hindi Movies in Theatres</h5>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {['Stree 2: Sarkate Ka Aatank', 'Jawan', 'Fighter', 'Animal', '12th Fail', 'Shaitaan', 'Bhool Bhulaiyaa 3', 'Singham Again', 'Brahmāstra', 'Chhaava'].map((m) => (
              <span key={m} className="hover:text-white transition-colors cursor-pointer">
                {m} <span className="text-gray-600">|</span>
              </span>
            ))}
          </div>
        </div>

        {/* Cities Directory */}
        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Cinema Theatres by City</h5>
          <div className="flex flex-wrap gap-2 text-xs">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => selectCity(city)}
                className="px-2.5 py-1 rounded bg-[#252533] hover:bg-[#f84464] hover:text-white text-gray-300 transition-colors"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Multiplex Partners */}
        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Official Cinema Multiplex Partners</h5>
          <p className="text-gray-400 text-xs leading-relaxed">
            PVR Cinemas • INOX Megaplex • Cinépolis India • Miraj Cinemas • Carnival Cinemas • MovieMax • Wave Cinemas • Rajhans Cinemas • Mukta A2 Cinemas
          </p>
        </div>

        {/* Brand & Disclaimer */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f84464] flex items-center justify-center text-white font-black text-sm">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              cine<span className="text-[#f84464]">book</span>
            </span>
          </div>

          <p className="text-gray-500 text-xs max-w-xl">
            Copyright 2026 © Cinebook Entertainment Pvt. Ltd. All Rights Reserved. Reference inspired by BookMyShow.
            The content and images used are for educational & demonstration purposes.
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
