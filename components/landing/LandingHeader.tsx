"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface LandingHeaderProps {
  links: NavLink[];
  ctaText: string;
  ctaHref: string;
  brandName?: string;
}

export default function LandingHeader({
  links,
  ctaText,
  ctaHref,
  brandName = "Lumen Radiology",
}: LandingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-[#0c1324]/70 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/15 transition-shadow ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-[var(--color-primary)] font-[family-name:var(--font-display)] uppercase"
        >
          {brandName}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-display)] font-semibold tracking-tight text-sm text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href={ctaHref}
          className="hidden md:inline-block bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] px-6 py-2 rounded font-[family-name:var(--font-data)] font-bold text-sm tracking-wide active:scale-95 transition-transform uppercase"
        >
          {ctaText}
        </Link>

        <button
          type="button"
          className="md:hidden -m-2.5 p-2.5 text-slate-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Menu</span>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[var(--color-surface-container-low)] border-t border-white/5 px-8 py-6 space-y-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block font-[family-name:var(--font-display)] font-semibold text-sm text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={ctaHref}
            onClick={() => setIsOpen(false)}
            className="block mt-4 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] px-5 py-3 rounded font-[family-name:var(--font-data)] font-bold text-sm uppercase text-center"
          >
            {ctaText}
          </Link>
        </div>
      )}
    </nav>
  );
}
