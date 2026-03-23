"use client";

import { useState, useEffect } from "react";
import {
  getBestActiveDiscount,
  applyDiscount,
  type Discount,
} from "@/libs/discounts";
import config from "@/config";

export default function DiscountBanner() {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const best = getBestActiveDiscount();
    if (best) {
      const key = `discount_dismissed_${best.code}`;
      if (!sessionStorage.getItem(key)) {
        setDiscount(best);
      }
    }
  }, []);

  if (!discount || dismissed) return null;

  const basePrice = config.stripe.plans[0]?.price ?? 29;
  const discountedPrice = applyDiscount(basePrice, discount);

  const handleDismiss = () => {
    sessionStorage.setItem(`discount_dismissed_${discount.code}`, "1");
    setDismissed(true);
  };

  // Parse markdown bold (**text**) in banner message
  const renderMessage = (msg: string) => {
    const parts = msg.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-bold text-white">
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div
      className="relative flex items-center justify-center gap-4 px-6 py-2.5 text-sm z-[60]"
      style={{ backgroundColor: discount.theme.badgeColor }}
    >
      <span
        className="font-[family-name:var(--font-data)] text-[0.7rem] tracking-wide"
        style={{ color: discount.theme.badgeText }}
      >
        {renderMessage(discount.theme.bannerMessage)}
        <span className="ml-3 opacity-70">
          ${basePrice} &rarr; ${discountedPrice}
        </span>
      </span>

      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: discount.theme.badgeText }}
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
