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
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth/login?redirect=${returnUrl}`;
      return;
    }

    onCheckout();
    setCheckingAuth(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      {/* Glassmorphism card — per design system spec */}
      <div
        className="glass-panel-deep relative max-w-lg w-full mx-4 p-8"
        style={{
          outline: "1px solid rgba(66, 71, 84, 0.15)",
        }}
      >
        <div className="text-center space-y-6">
          {/* Title */}
          <div>
            <h2 className="headline-lg text-2xl mb-2">
              Full MRI Analysis Ready
            </h2>
            <p className="text-[var(--color-rm-on-surface-dim)]">
              <span className="value-readout text-[var(--color-rm-tertiary)]">{findingCount}</span>
              {" "}finding{findingCount !== 1 ? "s" : ""} detected
              {regionCount > 0 && (
                <>
                  {" "}across{" "}
                  <span className="value-readout text-[var(--color-rm-tertiary)]">{regionCount}</span>
                  {" "}region{regionCount !== 1 ? "s" : ""}
                </>
              )}
              .
            </p>
          </div>

          {/* Feature comparison — two-column, no dividers */}
          <div className="grid grid-cols-2 gap-6 text-left">
            <div>
              <p className="label-md mb-3">Free</p>
              <ul className="space-y-2 text-sm text-[var(--color-rm-on-surface-dim)]">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-severity-normal)]">&#10003;</span> Upload & preview
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-severity-normal)]">&#10003;</span> Finding count
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-severity-normal)]">&#10003;</span> Blurred preview
                </li>
              </ul>
            </div>
            <div>
              <p className="label-md mb-3 text-[var(--color-rm-primary)]">Paid</p>
              <ul className="space-y-2 text-sm text-[var(--color-rm-on-surface-dim)]">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-rm-primary)]">&#10003;</span> Full resolution viewer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-rm-primary)]">&#10003;</span> All findings + severity
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-rm-primary)]">&#10003;</span> Slice-by-slice navigation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-rm-primary)]">&#10003;</span> Doctor&apos;s letter PDF
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-rm-primary)]">&#10003;</span> Permanent secure storage
                </li>
              </ul>
            </div>
          </div>

          {/* Price — Space Grotesk readout */}
          <p className="text-[var(--color-rm-on-surface-dim)]">
            <span className="text-3xl font-extrabold text-[var(--color-rm-on-surface)] font-[family-name:var(--font-space-grotesk)]">$29</span>
            <span className="ml-2 label-sm">&mdash; one-time, per study</span>
          </p>

          {/* CTAs — Primary gradient button */}
          <div className="space-y-3">
            <button
              onClick={handleUnlock}
              disabled={isCheckoutLoading || checkingAuth}
              className="btn btn-primary btn-block text-base"
            >
              {isCheckoutLoading || checkingAuth ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Unlock Full Report \u2014 $29"
              )}
            </button>
            <a
              href="/auth/login"
              className="block label-sm hover:text-[var(--color-rm-primary)] transition-colors"
            >
              Sign in if you&apos;ve already paid
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
