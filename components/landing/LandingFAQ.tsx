"use client";

import { useRef, useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface LandingFAQProps {
  items: FAQItem[];
  title?: string;
}

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[var(--color-surface-container)] p-6 rounded-lg ghost-border">
      <button
        className="flex justify-between items-center w-full text-left font-[family-name:var(--font-display)] font-semibold text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{item.question}</span>
        <span
          className={`material-symbols-outlined text-[var(--color-primary)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={
          isOpen
            ? { maxHeight: contentRef.current?.scrollHeight ?? 500, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <p className="mt-4 text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function LandingFAQ({
  items,
  title = "Frequently Asked Questions",
}: LandingFAQProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-12 text-center">
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <FAQAccordionItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
