"use client";

import { useState, useEffect } from "react";

interface DevPremiumButtonProps {
  onActivate: () => void;
  isActive: boolean;
}

export default function DevPremiumButton({ onActivate, isActive }: DevPremiumButtonProps) {
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    setIsLocalhost(
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    );
  }, []);

  if (!isLocalhost) return null;

  return (
    <button
      onClick={onActivate}
      disabled={isActive}
      className={`px-3 py-1.5 font-[family-name:var(--font-data)] text-[0.7rem] uppercase tracking-wider transition-colors ${
        isActive
          ? "border border-emerald-500/40 text-emerald-400 cursor-default"
          : "border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
      }`}
    >
      {isActive ? "DEV: Premium Active" : "DEV: Enable Premium"}
    </button>
  );
}
