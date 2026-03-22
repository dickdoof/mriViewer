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
      const pendingStudy = sessionStorage.getItem("pendingStudy");
      if (!pendingStudy) {
        setError("No pending study found. Please re-upload your files.");
        setStatus("error");
        return;
      }

      const { tempStudyId } = JSON.parse(pendingStudy);

      setProgress(100);
      setStatus("complete");

      sessionStorage.removeItem("pendingStudy");

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

    const channel = supabase
      .channel(`payment:${sessionId}`)
      .on("broadcast", { event: "payment_confirmed" }, () => {
        setStatus("confirmed");
        handlePaymentConfirmed();
      })
      .subscribe();

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
    <main className="min-h-screen flex items-center justify-center p-8 bg-[var(--color-surface)]">
      <div className="text-center space-y-6 max-w-md">
        {status === "waiting" && (
          <>
            <span className="loading loading-spinner loading-lg text-[var(--color-rm-primary)]"></span>
            <h1 className="headline-lg text-2xl">Processing your payment...</h1>
            <p className="text-[var(--color-rm-on-surface-dim)]">
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {status === "confirmed" && (
          <>
            <div className="w-14 h-14 rounded-sm bg-[var(--color-severity-normal)] bg-opacity-20 flex items-center justify-center mx-auto">
              <span className="text-[var(--color-severity-normal)] text-2xl">&#10003;</span>
            </div>
            <h1 className="headline-lg text-2xl text-[var(--color-severity-normal)]">
              Payment confirmed!
            </h1>
            <p className="text-[var(--color-rm-on-surface-dim)]">Preparing your study...</p>
          </>
        )}

        {status === "uploading" && (
          <>
            <span className="loading loading-spinner loading-lg text-[var(--color-rm-primary)]"></span>
            <h1 className="headline-lg text-2xl">Uploading your study...</h1>
            <div className="w-full bg-[var(--color-surface-highest)] rounded-sm h-2">
              <div
                className="gradient-primary h-2 rounded-sm transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="value-readout text-sm">{progress}% complete</p>
          </>
        )}

        {status === "complete" && (
          <>
            <div className="w-16 h-16 rounded-sm bg-[var(--color-severity-normal)] bg-opacity-20 flex items-center justify-center mx-auto">
              <span className="text-[var(--color-severity-normal)] text-3xl">&#10003;</span>
            </div>
            <h1 className="headline-lg text-2xl text-[var(--color-severity-normal)]">All done!</h1>
            <p className="text-[var(--color-rm-on-surface-dim)]">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-sm bg-[var(--color-severity-severe)] bg-opacity-20 flex items-center justify-center mx-auto">
              <span className="text-[var(--color-severity-severe)] text-3xl">&#10007;</span>
            </div>
            <h1 className="headline-lg text-2xl text-[var(--color-severity-severe)]">
              Something went wrong
            </h1>
            <p className="text-[var(--color-rm-on-surface-dim)]">{error}</p>
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
        <main className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
          <span className="loading loading-spinner loading-lg text-[var(--color-rm-primary)]"></span>
        </main>
      }
    >
      <ProcessingContent />
    </Suspense>
  );
}
