"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UploadContent() {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        {cancelled && (
          <div className="alert alert-warning mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Payment was cancelled. Your files are still in memory — try again.</span>
          </div>
        )}

        <h1 className="text-3xl font-extrabold">Upload your MRI</h1>
        <p className="text-base-content/60">
          Go back to the homepage to upload and analyse your DICOM files.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          Go to Upload
        </Link>
      </div>
    </main>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
