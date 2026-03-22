"use client";

import { useState, useEffect } from "react";
import type { JSX } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";

const links: {
  href: string;
  label: string;
}[] = [
  {
    href: "/#upload",
    label: "Upload",
  },
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/dashboard",
    label: "My Studies",
  },
];

const cta: JSX.Element = <ButtonSignin extraStyle="btn-primary" />;

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="bg-[var(--color-surface-low)]">
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8"
              placeholder="blur"
              priority={true}
              width={32}
              height={32}
            />
            <span className="font-extrabold text-lg tracking-tight text-[var(--color-rm-on-surface)]">
              {config.appName}
            </span>
          </Link>
        </div>

        {/* Mobile burger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-sm p-2.5 text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-on-surface)] transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="label-md hover:text-[var(--color-rm-primary)] transition-colors"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1">{cta}</div>
      </nav>

      {/* Mobile menu */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-[var(--color-surface-low)] sm:max-w-sm transform origin-right transition ease-in-out duration-300"
        >
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-2 shrink-0"
              title={`${config.appName} homepage`}
              href="/"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8"
                placeholder="blur"
                priority={true}
                width={32}
                height={32}
              />
              <span className="font-extrabold text-lg tracking-tight">
                {config.appName}
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-sm p-2.5 text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-on-surface)]"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flow-root mt-6">
            <div className="py-4">
              <div className="flex flex-col gap-y-4 items-start">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="label-md hover:text-[var(--color-rm-primary)] transition-colors"
                    title={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="my-4 h-px bg-[var(--color-surface-highest)]"></div>
            <div className="flex flex-col">{cta}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
