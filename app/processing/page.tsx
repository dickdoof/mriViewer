"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/libs/supabase/client";
import { loadDicomFiles, clearDicomFiles } from "@/libs/dicomStore";
import { extractDicomMetadata } from "@/libs/dicomUtils";

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

      // Load DICOM files from IndexedDB
      setProgress(5);
      const files = await loadDicomFiles();
      if (files.length === 0) {
        setError("No DICOM files found. Please re-upload your files.");
        setStatus("error");
        return;
      }

      // Extract metadata from first file
      setProgress(10);
      const metadata = await extractDicomMetadata(files[0].arrayBuffer);

      // Build FormData with metadata + all DICOM files
      const formData = new FormData();
      formData.append("stripeSessionId", sessionId || "");
      formData.append(
        "metadata",
        JSON.stringify({
          patientName: metadata.patientName || "Unknown",
          studyDate: metadata.studyDate || new Date().toISOString().split("T")[0],
          modality: metadata.modality || "MR",
          description: metadata.description || "",
          institution: metadata.institution || "",
          bodyRegion: "Unknown",
          seriesName: metadata.description || "Series 1",
        })
      );

      // Append each DICOM file
      for (let i = 0; i < files.length; i++) {
        const blob = new Blob([files[i].arrayBuffer], {
          type: "application/dicom",
        });
        const fileName = files[i].name || `slice_${i.toString().padStart(4, "0")}.dcm`;
        formData.append("files", blob, fileName);
        setProgress(10 + Math.round((i / files.length) * 30));
      }

      // Upload to persist API
      setProgress(40);
      const response = await fetch("/api/studies/persist", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to persist study");
      }

      const { studyId } = await response.json();

      setProgress(100);
      setStatus("complete");

      // Clean up
      sessionStorage.removeItem("pendingStudy");
      await clearDicomFiles();

      // Redirect to the viewer
      setTimeout(() => {
        router.push(`/viewer/${studyId}`);
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setStatus("error");
    }
  }, [router, sessionId]);

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
            <h1 className="headline-lg text-2xl">Processing your study...</h1>
            <p className="text-[var(--color-rm-on-surface-dim)] text-sm">
              Uploading files and running AI analysis on each slice. This may take a moment.
            </p>
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
              Redirecting to your viewer...
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
