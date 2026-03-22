"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/libs/supabase/client";

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<
    "waiting" | "confirmed" | "uploading" | "complete" | "error"
  >("waiting");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentConfirmed = useCallback(async () => {
    setStatus("uploading");

    try {
      // Get pending study info
      const pendingStudy = sessionStorage.getItem("pendingStudy");
      if (!pendingStudy) {
        setError("No pending study found. Please re-upload your files.");
        setStatus("error");
        return;
      }

      const { tempStudyId } = JSON.parse(pendingStudy);

      // For now, redirect to dashboard since DICOM files in memory are lost
      // after redirect to Stripe. In production, files would be stored in
      // IndexedDB before redirect.
      setProgress(100);
      setStatus("complete");

      // Clean up
      sessionStorage.removeItem("pendingStudy");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setStatus("error");
    }
  }, [router]);

  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();

    // Subscribe to payment confirmation
    const channel = supabase
      .channel(`payment:${sessionId}`)
      .on("broadcast", { event: "payment_confirmed" }, () => {
        setStatus("confirmed");
        handlePaymentConfirmed();
      })
      .subscribe();

    // Also poll in case we missed the broadcast
    const pollInterval = setInterval(async () => {
      const { data } = await supabase
        .from("payments")
        .select("status")
        .eq("stripe_session_id", sessionId)
        .single();

      if (data?.status === "paid") {
        clearInterval(pollInterval);
        if (status === "waiting") {
          setStatus("confirmed");
          handlePaymentConfirmed();
        }
      }
    }, 3000);

    return () => {
      channel.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [sessionId, status, handlePaymentConfirmed]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        {status === "waiting" && (
          <>
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <h1 className="text-2xl font-bold">Processing your payment...</h1>
            <p className="text-base-content/60">
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {status === "confirmed" && (
          <>
            <div className="text-4xl">&#10003;</div>
            <h1 className="text-2xl font-bold text-success">
              Payment confirmed!
            </h1>
            <p className="text-base-content/60">Preparing your study...</p>
          </>
        )}

        {status === "uploading" && (
          <>
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <h1 className="text-2xl font-bold">Uploading your study...</h1>
            <progress
              className="progress progress-primary w-full"
              value={progress}
              max="100"
            ></progress>
            <p className="text-base-content/60">{progress}% complete</p>
          </>
        )}

        {status === "complete" && (
          <>
            <div className="text-5xl text-success">&#10003;</div>
            <h1 className="text-2xl font-bold text-success">All done!</h1>
            <p className="text-base-content/60">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl text-error">&#10007;</div>
            <h1 className="text-2xl font-bold text-error">
              Something went wrong
            </h1>
            <p className="text-base-content/60">{error}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-primary"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </main>
      }
    >
      <ProcessingContent />
    </Suspense>
  );
}
