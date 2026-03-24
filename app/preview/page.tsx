"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import PreviewViewer from "@/components/PreviewViewer";
import PaywallOverlay from "@/components/PaywallOverlay";
import FindingsPanel from "@/components/FindingsPanel";
import StudyInfoPanel from "@/components/StudyInfoPanel";
import DevPremiumButton from "@/components/DevPremiumButton";
import config from "@/config";
import { loadDicomFiles } from "@/libs/dicomStore";
import { dicomToBase64, extractDicomMetadata } from "@/libs/dicomUtils";
import type { Finding } from "@/libs/annotate";

export default function PreviewPage() {
  const router = useRouter();

  const [isAnalysing, setIsAnalysing] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [imageDimensions] = useState({ width: 512, height: 512 });
  const [fileCount, setFileCount] = useState(0);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [devPremium, setDevPremium] = useState(false);
  const [metadata, setMetadata] = useState<{
    modality?: string;
    institution?: string;
    description?: string;
    studyDate?: string;
  }>({});

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const files = await loadDicomFiles();
      if (files.length === 0) {
        router.replace("/");
        return;
      }
      if (cancelled) return;

      setFileCount(files.length);

      // Extract metadata from first file
      const meta = await extractDicomMetadata(files[0].arrayBuffer);
      if (!cancelled) setMetadata(meta);

      // Convert middle slice to base64
      const middleIndex = Math.floor(files.length / 2);
      const imageBase64 = await dicomToBase64(files[middleIndex].arrayBuffer);

      if (!imageBase64 || cancelled) {
        setIsAnalysing(false);
        return;
      }

      setPreviewImage(`data:image/png;base64,${imageBase64}`);

      // Call preview API for AI findings
      try {
        const response = await fetch("/api/annotate/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64 }),
        });

        if (response.ok && !cancelled) {
          const data = await response.json();
          setFindings(data.findings || []);
        }
      } catch (err) {
        console.error("Error during analysis:", err);
      } finally {
        if (!cancelled) setIsAnalysing(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [router]);

  const handleCheckout = useCallback(async () => {
    setIsCheckoutLoading(true);
    try {
      const tempStudyId = crypto.randomUUID();
      sessionStorage.setItem(
        "pendingStudy",
        JSON.stringify({
          tempStudyId,
          fileCount,
          timestamp: Date.now(),
        })
      );

      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempStudyId }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [fileCount]);

  const regions = new Set(findings.map((f) => f.label.split(" ")[0]));
  const highestSeverity =
    findings.length > 0
      ? (["severe", "moderate", "mild", "normal"].find((s) =>
          findings.some((f) => f.severity === s)
        ) || "normal")
      : "normal";

  return (
    <main className="h-screen flex flex-col bg-[#0c1324] text-[#dce1fb] overflow-hidden">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center w-full px-6 h-14 bg-[#0c1324] border-b border-[#424754]/15 z-50 shrink-0">
        <div className="flex items-center gap-8">
          <a href="/" className="text-xl font-black tracking-tighter text-[#adc6ff]">
            RADIOMETRIC
          </a>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-['Space_Grotesk'] uppercase tracking-widest text-[0.7rem]">
              MRI Preview
            </span>
            <div className="h-4 w-px bg-[#424754]/30" />
            <div className="flex items-center gap-2">
              <span className="text-[#dce1fb] font-semibold text-sm">
                {metadata.description || "DICOM Study"}
              </span>
              <span className="font-[family-name:var(--font-data)] text-xs tracking-tighter opacity-60">
                {fileCount} slice{fileCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {metadata.studyDate && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-[family-name:var(--font-data)] text-xs text-slate-300">
                {metadata.studyDate}
              </span>
            </div>
          )}
          <DevPremiumButton
            onActivate={() => setDevPremium(true)}
            isActive={devPremium}
          />
          <button
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
            className="px-3 py-1.5 border border-[#adc6ff]/40 text-[#adc6ff] font-[family-name:var(--font-data)] text-[0.7rem] uppercase tracking-wider hover:bg-[#adc6ff]/10 transition-colors disabled:opacity-50"
          >
            {isCheckoutLoading ? "Loading..." : "Unlock Full Report"}
          </button>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white">settings</span>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white">help</span>
            <span className="material-symbols-outlined text-[#adc6ff] cursor-pointer">account_circle</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-60 flex flex-col bg-[#151b2d] border-r border-[#424754]/15 shrink-0">
          <div className="p-4 border-b border-[#424754]/10 flex-1 overflow-y-auto">
            <div className="font-['Space_Grotesk'] uppercase tracking-widest text-[0.7rem] text-slate-500 mb-4">
              Body Regions
            </div>

            {/* Placeholder series */}
            <div className="mb-2">
              <div className="flex items-center justify-between p-2 bg-[#2e3447]/40 border-l-2 border-[#4d8eff] text-[#adc6ff] cursor-default">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">accessibility_new</span>
                  <span className="font-semibold text-xs tracking-wide">
                    {metadata.description || "Series 1"}
                  </span>
                </div>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </div>
              <div className="mt-1 ml-4 border-l border-[#424754]/20">
                <div className="flex items-center justify-between py-2 px-3 text-xs text-[#adc6ff] bg-[#adc6ff]/5 cursor-default font-medium">
                  <span>{metadata.modality || "DICOM"} Series</span>
                  <span className="font-[family-name:var(--font-data)] text-[0.65rem] opacity-70">
                    {fileCount} IMG
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="p-4 flex flex-col gap-2 border-t border-[#424754]/10">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#4d8eff]/40 text-[#4d8eff]/60 font-[family-name:var(--font-data)] font-bold text-[0.75rem] uppercase tracking-widest cursor-not-allowed">
              <span className="material-symbols-outlined text-sm">analytics</span>
              Analyze Series
            </button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col items-center py-2 text-slate-500 hover:bg-[#2e3447]/30 cursor-pointer">
                <span className="material-symbols-outlined text-lg">ios_share</span>
                <span className="font-[family-name:var(--font-data)] text-[0.6rem] mt-1">EXPORT</span>
              </div>
              <div className="flex flex-col items-center py-2 text-slate-500 hover:bg-[#2e3447]/30 cursor-pointer">
                <span className="material-symbols-outlined text-lg">contact_support</span>
                <span className="font-[family-name:var(--font-data)] text-[0.6rem] mt-1">SUPPORT</span>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER VIEWPORT */}
        <div className="flex-1 min-w-0 relative">
          {isAnalysing ? (
            <div className="h-full flex flex-col items-center justify-center bg-black gap-4">
              <span className="loading loading-spinner loading-lg text-[#adc6ff]"></span>
              <p className="text-sm font-bold text-white">
                Analysing {fileCount} slice{fileCount !== 1 ? "s" : ""}...
              </p>
              <p className="font-[family-name:var(--font-data)] text-[0.65rem] text-slate-500 uppercase tracking-wider">
                This may take a moment
              </p>
            </div>
          ) : previewImage ? (
            <>
              <PreviewViewer
                imageDataUrl={previewImage}
                findings={findings}
                imageWidth={imageDimensions.width}
                imageHeight={imageDimensions.height}
              />
              {!devPremium && (
                <PaywallOverlay
                  findingCount={findings.length}
                  regionCount={regions.size}
                  highestSeverity={highestSeverity}
                  onCheckout={handleCheckout}
                  isCheckoutLoading={isCheckoutLoading}
                />
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-black gap-4">
              <span className="material-symbols-outlined text-4xl text-slate-500">error_outline</span>
              <p className="text-sm text-slate-400">Could not render DICOM preview</p>
              <a href="/" className="text-[#adc6ff] text-sm hover:underline">
                Upload again
              </a>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-80 flex flex-col bg-[#151b2d] border-l border-[#424754]/15 shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-[#424754]/15">
            <button className="flex-1 py-3 text-[0.7rem] font-[family-name:var(--font-data)] font-bold tracking-widest bg-[#2e3447] text-[#adc6ff] border-b-2 border-[#adc6ff]">
              REPORT
            </button>
            <button className="flex-1 py-3 text-[0.7rem] font-[family-name:var(--font-data)] font-bold tracking-widest text-slate-500 hover:text-slate-300">
              INFO
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <StudyInfoPanel
              study={{
                modality: metadata.modality,
                institution: metadata.institution,
                description: metadata.description,
                sliceCount: fileCount,
              }}
            />

            <div className="h-px bg-[#424754]/10" />

            <FindingsPanel findings={findings} locked={!devPremium} />

            {/* AI Comparison (locked) */}
            <div className="p-4 bg-[#adc6ff]/5 border border-[#adc6ff]/10 opacity-60">
              <div className="flex items-center gap-2 mb-2 text-[#adc6ff]">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest">AI Comparison</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs text-slate-500">lock</span>
                <p className="text-[0.65rem] text-slate-500">Historical comparison results locked.</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-4 border-t border-[#424754]/15 bg-[#151b2d]">
            <button
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full py-3 bg-[#adc6ff] text-[#002e6a] font-[family-name:var(--font-data)] font-bold text-[0.7rem] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">shopping_cart</span>
              {isCheckoutLoading ? "Loading..." : `Unlock Full Report — $${config.stripe.plans[0]?.price ?? 29}`}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
