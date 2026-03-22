"use client";

import { useState } from "react";

interface DoctorLetterButtonProps {
  studyId: string;
}

export default function DoctorLetterButton({ studyId }: DoctorLetterButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/report/${studyId}/letter`);
      if (response.ok) {
        const { url } = await response.json();
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Failed to generate letter:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
