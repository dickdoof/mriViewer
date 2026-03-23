"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import config from "@/config";

const links = [
  { href: "#problem", label: "The Problem" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0c1324]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tighter text-primary font-[family-name:var(--font-display)]">
          {config.appName}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-400 hover:text-slate-100 transition-colors text-xs font-medium font-[family-name:var(--font-data)] uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="#upload"
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-5 py-2 rounded-lg text-xs font-bold font-[family-name:var(--font-data)] uppercase hover:brightness-110 transition-all active:scale-95 inline-block"
          >
            Analyze Your Scan
          </a>
        </div>

        {/* Mobile burger */}
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-surface-container-low border-t border-white/5 px-6 py-6 space-y-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-xs font-medium font-[family-name:var(--font-data)] uppercase text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#upload"
            onClick={() => setIsOpen(false)}
            className="block mt-4 bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-5 py-3 rounded-lg text-xs font-bold font-[family-name:var(--font-data)] uppercase text-center"
          >
            Analyze Your Scan
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;
