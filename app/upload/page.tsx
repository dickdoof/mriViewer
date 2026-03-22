"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UploadContent() {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-[var(--color-surface)]">
      <div className="text-center space-y-6 max-w-md">
        {cancelled && (
          <div className="p-4 rounded-sm bg-[var(--color-severity-moderate)] bg-opacity-10 ghost-border mb-8">
            <p className="text-[var(--color-severity-moderate)] text-sm">
              Payment was cancelled. Your files are still in memory &mdash; try again.
            </p>
          </div>
        )}

        <h1 className="headline-lg text-3xl">Upload your MRI</h1>
        <p className="text-[var(--color-rm-on-surface-dim)]">
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
        <main className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
          <span className="loading loading-spinner loading-lg text-[var(--color-rm-primary)]"></span>
        </main>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
