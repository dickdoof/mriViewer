"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";

interface PaywallOverlayProps {
  findingCount: number;
  regionCount: number;
  onCheckout: () => void;
  isCheckoutLoading?: boolean;
}

export default function PaywallOverlay({
  findingCount,
  regionCount,
  onCheckout,
  isCheckoutLoading,
}: PaywallOverlayProps) {
  const supabase = createClient();
  const [checkingAuth, setCheckingAuth] = useState(false);

  const handleUnlock = async () => {
    setCheckingAuth(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth/login?redirect=${returnUrl}`;
      return;
    }

    onCheckout();
    setCheckingAuth(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div
        className="relative max-w-lg w-full mx-4 p-8 rounded-2xl shadow-2xl"
        style={{
          background: "rgba(0, 0, 0, 0.60)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="text-center text-white space-y-6">
          {/* Title */}
          <div>
            <p className="text-3xl mb-2">Full MRI Analysis Ready</p>
            <p className="text-white/70">
              {findingCount} finding{findingCount !== 1 ? "s" : ""} detected
              {regionCount > 0 &&
                ` across ${regionCount} region${regionCount !== 1 ? "s" : ""}`}
              .
            </p>
          </div>

          {/* Feature comparison */}
          <div className="grid grid-cols-2 gap-4 text-sm text-left">
            <div>
              <p className="font-semibold text-white/90 mb-2">Free</p>
              <ul className="space-y-1.5 text-white/60">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> Upload &
                  preview
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> Finding count
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> Blurred
                  preview
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white/90 mb-2">Paid</p>
              <ul className="space-y-1.5 text-white/60">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> Full
                  resolution viewer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> All findings
                  + severity
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> Slice-by-slice
                  navigation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> Doctor&apos;s
                  letter PDF
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">&#10003;</span> Permanent
                  secure storage
                </li>
              </ul>
            </div>
          </div>

          {/* Price */}
          <p className="text-lg text-white/80">
            <span className="text-2xl font-bold text-white">$29</span>{" "}
            &mdash; one-time, per study
          </p>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={handleUnlock}
              disabled={isCheckoutLoading || checkingAuth}
              className="btn btn-primary btn-block text-lg"
            >
              {isCheckoutLoading || checkingAuth ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Unlock Full Report — $29"
              )}
            </button>
            <a
              href="/auth/login"
              className="block text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Sign in if you&apos;ve already paid
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
