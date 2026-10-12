import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, CreditCard, Shield, Film } from 'lucide-react';
import { Link } from 'wouter';

export const OffersPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offers = [
    {
      code: 'CINEBOOK100',
      title: 'Cinebook Welcome Treat',
      discount: 'Flat ₹100 Off',
      minAmount: 'Min spend ₹350',
      description: 'Exclusive welcome voucher on your Hindi blockbuster tickets across PVR, INOX, and Cinépolis.',
      category: 'Special Promo',
      validTill: 'Valid till 31 Dec 2026'
    },
    {
      code: 'BOLLYWOOD50',
      title: 'Bollywood Fan Friday',
      discount: 'Flat ₹50 Off',
      minAmount: 'Min spend ₹200',
      description: 'Valid on all Hindi movies including Stree 2, Jawan, Fighter, 12th Fail, and Animal.',
      category: 'Movie Special',
      validTill: 'Valid all weekdays'
    },
    {
      code: 'CINEVIP20',
      title: 'VIP Recliner & IMAX Discount',
      discount: '20% Off (up to ₹150)',
      minAmount: 'Min spend ₹400',
      description: 'Pamper yourself with premium leather recliner sofa seats and IMAX laser screens.',
      category: 'Premium Experience',
      validTill: 'Valid on IMAX & Recliner'
    },
    {
      code: 'ICICIBOGO',
      title: 'ICICI Bank Cardholder Special',
      discount: 'Flat ₹180 Off',
      minAmount: 'Min spend ₹500',
      description: 'Applicable when paying with any ICICI Bank Coral, Sapphiro, or Emeralde Credit/Debit Card.',
      category: 'Bank Partner',
      validTill: 'Valid on Card Checkout'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#f84464] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Cinema Rewards & Deals
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-display">
            Exclusive Offers & Promo Codes
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Save on movie tickets, food & beverages, and multiplex passes with Cinebook partner offers.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const isCopied = copiedCode === offer.code;
            return (
              <div
                key={offer.code}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#f84464] text-[11px] font-bold">
                      {offer.category}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {offer.validTill}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 font-display">
                    {offer.title}
                  </h3>

                  <div className="text-2xl font-black text-[#f84464] font-display mt-1">
                    {offer.discount}
                  </div>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="text-[11px] font-semibold text-gray-400 mt-2">
                    {offer.minAmount}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="px-3.5 py-2 rounded-xl bg-gray-50 border border-dashed border-gray-300 font-mono text-sm font-bold text-gray-800">
                    {offer.code}
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="px-5 py-2.5 rounded-xl bg-[#222436] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="px-8 py-3.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white font-bold text-sm shadow-cine-red inline-flex items-center gap-2 cursor-pointer"
          >
            <Film className="w-4 h-4" />
            <span>Apply Coupon on Hindi Movie Tickets →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
