import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import {
  ChevronLeft,
  Plus,
  Minus,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { cinebookApi } from '../api/cinebookApi';
import { SnackItem, BookingSnack } from '../types';

export const FoodBeveragePage: React.FC = () => {
  const [, params] = useRoute('/booking/:showId/snacks');
  const [, setLocation] = useLocation();
  const showId = params?.showId || '';

  const [snacks, setSnacks] = useState<SnackItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Retrieve seat selection from session storage
  const savedBookingJson = sessionStorage.getItem(`cinebook_booking_${showId}`);
  const savedBooking = savedBookingJson ? JSON.parse(savedBookingJson) : null;

  useEffect(() => {
    cinebookApi
      .getSnacks()
      .then((data) => setSnacks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Popcorn', 'Combos', 'Beverages', 'Quick Bites'];

  const filteredSnacks = selectedCategory === 'All'
    ? snacks
    : snacks.filter((s) => s.category === selectedCategory);

  const handleAdd = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const calculateSnacksTotal = () => {
    return Object.entries(cart).reduce((sum, [snackId, qty]) => {
      const item = snacks.find((s) => s.id === snackId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleProceed = () => {
    const snacksPayload: BookingSnack[] = Object.entries(cart).map(([snackId, qty]) => {
      const item = snacks.find((s) => s.id === snackId)!;
      return {
        snackId: item.id,
        name: item.name,
        price: item.price,
        quantity: qty
      };
    });

    // Update session storage
    if (savedBooking) {
      sessionStorage.setItem(
        `cinebook_booking_${showId}`,
        JSON.stringify({
          ...savedBooking,
          snacks: snacksPayload,
          snacksAmount: calculateSnacksTotal()
        })
      );
    }

    setLocation(`/booking/${showId}/checkout`);
  };

  const handleSkip = () => {
    if (savedBooking) {
      sessionStorage.setItem(
        `cinebook_booking_${showId}`,
        JSON.stringify({
          ...savedBooking,
          snacks: [],
          snacksAmount: 0
        })
      );
    }
    setLocation(`/booking/${showId}/checkout`);
  };

  const totalSnackItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-between">
      {/* 1. Header */}
      <header className="bg-[#181926] text-white py-4 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation(`/booking/${showId}`)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white font-display">
                  Grab a Bite!
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f84464]/20 text-[#f84464]">
                  Multiplex Dining
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pre-order hot snacks & save up to 20% on combo meals
              </p>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-gray-300 hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Skip to Payment →
          </button>
        </div>
      </header>

      {/* 2. Main Menu */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#f84464] text-white shadow-cine-red'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Snack Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white p-4 rounded-2xl border border-gray-200 animate-pulse space-y-3">
                <div className="aspect-video bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredSnacks.map((snack) => {
              const qty = cart[snack.id] || 0;
              return (
                <div
                  key={snack.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={snack.imageUrl}
                        alt={snack.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Veg indicator badge */}
                      <div className="absolute top-2 left-2 p-1 rounded bg-white/90 shadow">
                        <div className="w-3 h-3 rounded-full bg-emerald-600 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                        {snack.category}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{snack.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {snack.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Quantity Adder */}
                  <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">
                      ₹{snack.price}
                    </span>

                    {qty === 0 ? (
                      <button
                        onClick={() => handleAdd(snack.id)}
                        className="px-4 py-1.5 rounded-lg border border-[#f84464] text-[#f84464] hover:bg-[#f84464] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-0.5">
                        <button
                          onClick={() => handleRemove(snack.id)}
                          className="w-6 h-6 rounded bg-white text-[#f84464] flex items-center justify-center font-bold text-xs shadow-sm hover:bg-rose-100 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#f84464] px-1">{qty}</span>
                        <button
                          onClick={() => handleAdd(snack.id)}
                          className="w-6 h-6 rounded bg-[#f84464] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:bg-[#e03657] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. Bottom Checkout Bar */}
      <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-40 p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-[#f84464]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {totalSnackItemsCount === 0
                  ? 'No snacks added yet'
                  : `${totalSnackItemsCount} Snacks Added`}
              </div>
              <div className="text-xs text-gray-500">
                Snacks Total: <strong className="text-[#f84464]">₹{calculateSnacksTotal()}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSkip}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Skip
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white font-bold text-xs shadow-cine-red transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
