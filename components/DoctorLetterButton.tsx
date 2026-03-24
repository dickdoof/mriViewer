"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "preferred_letter_language";

const SUPPORTED_LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Fran\u00e7ais" },
  { code: "es", label: "Espa\u00f1ol" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Portugu\u00eas" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "tr", label: "T\u00fcrk\u00e7e" },
  { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" },
  { code: "ja", label: "\u65e5\u672c\u8a9e" },
  { code: "zh", label: "\u4e2d\u6587" },
];

function detectDefaultLanguage(): string {
  // 1. Check localStorage for user preference
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      return stored;
    }

    // 2. Read browser language
    const browserLang = navigator.language?.split("-")[0];
    if (browserLang && SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
      return browserLang;
    }
  }

  // 3. Fallback to English
  return "en";
}

interface DoctorLetterButtonProps {
  studyId: string;
}

export default function DoctorLetterButton({ studyId }: DoctorLetterButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setLanguage(detectDefaultLanguage());
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/report/${studyId}/letter?language=${language}`
      );
      if (response.ok) {
        const { url } = await response.json();
        window.open(url, "_blank");
      } else {
        setError("Failed to generate letter. Please try again.");
      }
    } catch (err) {
      console.error("Failed to generate letter:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Language selector */}
      <div className="flex items-center gap-2">
        <label className="label-md shrink-0">
          Language
        </label>
        <select
          className="select select-sm w-full"
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={isLoading}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="btn btn-primary btn-block"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        )}
        Download Doctor&apos;s Letter
      </button>

      {error && (
        <p className="text-[0.65rem] text-red-400">{error}</p>
      )}
    </div>
  );
}
