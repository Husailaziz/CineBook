import React from 'react';
import { Link, useLocation } from 'wouter';
import { Film, Sparkles, ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon?: string;
}

export const CategoryPlaceholderPage: React.FC<Props> = ({ title, description, icon = '🎬' }) => {
  return (
    <div className="min-h-screen bg-[#f5f5f7] py-16 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center max-w-lg shadow-sm">
        <span className="text-5xl mb-4 block">{icon}</span>
        <h1 className="text-2xl font-black text-gray-900 font-display mb-2">
          {title} on Cinebook
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-[#f84464] font-semibold mb-6 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Hindi Cinema tickets are live! Explore Bollywood movies in theatres now.</span>
        </div>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white text-xs font-bold shadow-cine-red inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Listings</span>
        </Link>
      </div>
    </div>
  );
};
