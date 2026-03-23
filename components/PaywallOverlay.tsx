"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";
import { getBestActiveDiscount, applyDiscount, type Discount } from "@/libs/discounts";

interface PaywallOverlayProps {
  findingCount: number;
  regionCount: number;
  highestSeverity: string;
  onCheckout: () => void;
  isCheckoutLoading?: boolean;
}

const severityColor: Record<string, string> = {
  severe: "#ff5451",
  moderate: "#ff9100",
  mild: "#ffd700",
  normal: "#69db7c",
};

export default function PaywallOverlay({
  findingCount,
  regionCount,
  highestSeverity,
  onCheckout,
  isCheckoutLoading,
}: PaywallOverlayProps) {
  const supabase = createClient();
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);

  const basePrice = config.stripe.plans[0]?.price ?? 29;
  const finalPrice = activeDiscount ? applyDiscount(basePrice, activeDiscount) : basePrice;

  useEffect(() => {
    setActiveDiscount(getBestActiveDiscount());
  }, []);

  const handleUnlock = async () => {
    setCheckingAuth(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth/login?redirect=${returnUrl}`;
      return;
    }

    onCheckout();
    setCheckingAuth(false);
  };

  const isLoading = isCheckoutLoading || checkingAuth;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
      <div className="bg-[#151b2d] border border-[#424754]/30 w-[420px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 flex flex-col items-center text-center">
        {/* Header */}
        <div className="text-[0.65rem] font-bold tracking-[0.3em] text-slate-500 mb-2 uppercase">
          AI Analysis Complete
        </div>
        <h2 className="text-xl font-bold text-white mb-6">
          Your scan has findings. Here&apos;s what we detected.
        </h2>

        {/* Summary Grid */}
        <div className="w-full grid grid-cols-3 gap-2 mb-8">
          <div className="bg-[#151b2d] p-3 border-b-2 border-[#adc6ff]/30">
            <div className="text-[0.6rem] text-slate-500 uppercase font-[family-name:var(--font-data)] mb-1">Total</div>
            <div className="text-sm font-bold text-white">{findingCount} Finding{findingCount !== 1 ? "s" : ""}</div>
          </div>
          <div className="bg-[#151b2d] p-3 border-b-2 border-[#adc6ff]/30">
            <div className="text-[0.6rem] text-slate-500 uppercase font-[family-name:var(--font-data)] mb-1">Scope</div>
            <div className="text-sm font-bold text-white">{regionCount} Region{regionCount !== 1 ? "s" : ""}</div>
          </div>
          <div
            className="bg-[#151b2d] p-3 border-b-2"
            style={{
              borderBottomColor: `${severityColor[highestSeverity] || severityColor.normal}99`,
              boxShadow: `inset 0 -2px 8px ${severityColor[highestSeverity] || severityColor.normal}15`,
            }}
          >
            <div className="text-[0.6rem] text-slate-500 uppercase font-[family-name:var(--font-data)] mb-1">Highest</div>
            <div className="text-sm font-bold capitalize" style={{ color: severityColor[highestSeverity] || severityColor.normal }}>
              {highestSeverity || "Normal"}
            </div>
          </div>
        </div>

        {/* What you'll unlock */}
        <div className="w-full mb-8 text-left">
          <div className="text-[0.6rem] font-bold text-slate-500 uppercase mb-3 px-1">What you&apos;ll unlock</div>
          <div className="space-y-2">
            {[
              "Detailed Clinical Descriptions",
              "Exact Anomaly Locations (X,Y,Z)",
              "Full PDF Report for Clinicians",
            ].map((item) => (
              <div key={item} className="flex justify-between items-center text-[0.7rem] px-2 py-1 bg-[#070d1f]/50 border-l border-[#adc6ff]/20">
                <span className="text-slate-300">{item}</span>
                <span className="material-symbols-outlined text-[#adc6ff] text-sm">check_circle</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discount badge */}
        {activeDiscount && (
          <div className="w-full mb-4 flex items-center justify-center gap-2 py-2 text-[0.7rem] font-[family-name:var(--font-data)] font-bold"
            style={{ backgroundColor: `${activeDiscount.theme.badgeColor}20`, color: activeDiscount.theme.badgeColor }}
          >
            <span className="material-symbols-outlined text-sm">local_offer</span>
            {activeDiscount.theme.label}: {activeDiscount.percentOff}% OFF with code {activeDiscount.code}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleUnlock}
          disabled={isLoading}
          className="w-full py-4 bg-[#adc6ff] text-[#002e6a] font-bold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:brightness-110 active:scale-[0.98] transition-all mb-4 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : activeDiscount ? (
            <>
              Unlock Full Report &mdash;{" "}
              <span className="line-through opacity-60">${basePrice}</span>{" "}
              ${finalPrice}
            </>
          ) : (
            `Unlock Full Report \u2014 $${basePrice}`
          )}
        </button>

        {/* Sign in link */}
        <div className="text-[0.65rem] text-slate-500">
          Already purchased?{" "}
          <a href="/auth/login" className="text-[#adc6ff] hover:underline">
            Sign in to access
          </a>
        </div>
      </div>
    </div>
  );
}
