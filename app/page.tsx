"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import DiscountBanner from "@/components/DiscountBanner";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import PreviewViewer from "@/components/PreviewViewer";
import PaywallOverlay from "@/components/PaywallOverlay";
import config from "@/config";
import type { Finding } from "@/libs/annotate";

interface DicomFile {
  file: File;
  arrayBuffer: ArrayBuffer;
}

export default function LandingPage() {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 512,
    height: 512,
  });
  const [dicomFiles, setDicomFiles] = useState<DicomFile[]>([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleFilesLoaded = useCallback(async (files: DicomFile[]) => {
    setIsAnalysing(true);
    setDicomFiles(files);

    try {
      const middleIndex = Math.floor(files.length / 2);
      const middleFile = files[middleIndex];
      const imageBase64 = await dicomToBase64(middleFile.arrayBuffer);

      if (!imageBase64) {
        console.error("Failed to convert DICOM to image");
        setIsAnalysing(false);
        return;
      }

      setPreviewImage(`data:image/png;base64,${imageBase64}`);

      const response = await fetch("/api/annotate/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });

      if (response.ok) {
        const data = await response.json();
        setFindings(data.findings || []);
      }
    } catch (err) {
      console.error("Error during analysis:", err);
    } finally {
      setIsAnalysing(false);
    }
  }, []);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const tempStudyId = crypto.randomUUID();
      sessionStorage.setItem(
        "pendingStudy",
        JSON.stringify({
          tempStudyId,
          fileCount: dicomFiles.length,
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
  };

  const regions = new Set(findings.map((f) => f.label.split(" ")[0]));
  const price = config.stripe.plans[0]?.price ?? 29;

  return (
    <>
      <DiscountBanner />
      <Header />

      <main>
        {/* ══ 1. HERO ══ */}
        <section className="relative overflow-hidden bg-[var(--color-surface)]">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
              viewBox="0 0 800 600"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
              fill="none"
              stroke="var(--color-rm-primary)"
              strokeWidth="0.5"
              style={{ opacity: 0.06 }}
            >
              <ellipse cx="400" cy="220" rx="140" ry="120" className="animate-[surface-breathe_4s_ease-in-out_infinite]" />
              <ellipse cx="360" cy="210" rx="80" ry="90" opacity="0.6" />
              <ellipse cx="440" cy="210" rx="80" ry="90" opacity="0.6" />
              <path d="M400 340 Q395 380 400 420 Q405 460 400 500 Q395 540 400 580" strokeWidth="2" className="animate-[surface-breathe_3s_ease-in-out_infinite]" />
              {[360, 400, 440, 480, 520, 560].map((y) => (
                <ellipse key={y} cx="400" cy={y} rx="20" ry="8" opacity="0.4" className="animate-[surface-breathe_3s_ease-in-out_infinite]" />
              ))}
            </svg>
            <div
              className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(77, 142, 255, 0.08) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(173, 198, 255, 0.04) 0%, transparent 70%)" }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-8 py-20 md:py-32">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <span className="label-md px-4 py-1.5 rounded-sm bg-[var(--color-surface-high)] text-[var(--color-rm-primary)] ghost-border inline-block">
                Powered by Claude AI
              </span>
              <h1 className="headline-lg text-4xl md:text-6xl">
                Medical Scans.{" "}
                <span className="gradient-text-primary">Understood.</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-rm-on-surface-dim)] max-w-2xl mx-auto" style={{ lineHeight: 1.6 }}>
                Upload your MRI scan and get an AI-powered analysis with
                findings highlighted &mdash; in minutes, not weeks.
              </p>

              {!previewImage && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="#upload" className="btn btn-primary btn-lg inline-flex gap-2">
                    Analyse My Scan
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </a>
                  <a href="#how-it-works" className="btn btn-ghost btn-lg">
                    See How It Works
                  </a>
                </div>
              )}
            </div>

            {/* Diagnostic viewport with Upload / Preview */}
            <div id="upload" className="mt-20 max-w-2xl mx-auto">
              <div className="relative rounded-sm overflow-hidden mri-gradient">
                {/* HUD overlay text */}
                <div className="absolute inset-0 pointer-events-none z-10 p-4">
                  <div className="flex justify-between items-start">
                    <span className="label-sm text-[var(--color-rm-on-surface-faint)]">MODALITY: MRI</span>
                    <span className="label-sm text-[var(--color-rm-on-surface-faint)]">RADIOMETRIC v1.0</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="label-sm text-[var(--color-rm-on-surface-faint)]">AWAITING INPUT</span>
                  </div>
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-[var(--color-outline-variant)]/30" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-[var(--color-outline-variant)]/30" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-[var(--color-outline-variant)]/30" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-[var(--color-outline-variant)]/30" />
                </div>

                {previewImage ? (
                  <div className="relative">
                    <PreviewViewer
                      imageDataUrl={previewImage}
                      findings={findings}
                      imageWidth={imageDimensions.width}
                      imageHeight={imageDimensions.height}
                    />
                    <PaywallOverlay
                      findingCount={findings.length}
                      regionCount={regions.size}
                      highestSeverity={
                        findings.length > 0
                          ? (["severe", "moderate", "mild", "normal"].find((s) =>
                              findings.some((f) => f.severity === s)
                            ) || "normal")
                          : "normal"
                      }
                      onCheckout={handleCheckout}
                      isCheckoutLoading={isCheckoutLoading}
                    />
                  </div>
                ) : (
                  <div className="relative z-20">
                    <UploadZone
                      onFilesLoaded={handleFilesLoaded}
                      isLoading={isAnalysing}
                    />
                  </div>
                )}
              </div>

              {!previewImage && (
                <p className="text-center mt-4">
                  <button
                    className="label-sm hover:text-[var(--color-rm-primary)] transition-colors"
                    onClick={() => {
                      alert("Demo scan coming soon! Upload your own .dcm files for now.");
                    }}
                  >
                    Or try a demo scan
                  </button>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ══ 2. SOCIAL PROOF BAR ══ */}
        <section className="py-12 bg-[var(--color-surface-container-lowest)] border-y border-[var(--color-outline-variant)]/10">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { value: "< 2 min", label: "Average analysis time" },
                { value: "50+", label: "Anomaly types detected" },
                { value: "DICOM", label: "Industry-standard format" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--color-rm-primary)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--color-rm-on-surface-dim)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. THE PROBLEM ══ */}
        <section id="problem" className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-3xl mx-auto px-8 text-center space-y-6">
            <h2 className="headline-lg text-3xl md:text-4xl">
              Waiting weeks for results is{" "}
              <span className="gradient-text-primary">stressful</span>
            </h2>
            <p className="text-[var(--color-rm-on-surface-dim)] text-lg max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
              You&apos;ve had your scan. The CD sits on your desk. Your doctor appointment
              is days away. The anxiety of not knowing is worse than the scan itself.
            </p>
            <p className="text-[var(--color-rm-on-surface-dim)] max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
              Radiometric AI gives you an instant preliminary analysis so you can walk
              into your appointment informed &mdash; not anxious.
            </p>
          </div>
        </section>

        {/* ══ 4. HOW IT WORKS ══ */}
        <section id="how-it-works" className="py-24 bg-[var(--color-surface-low)]">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="headline-lg text-3xl text-center mb-4">How It Works</h2>
            <p className="text-center text-[var(--color-rm-on-surface-dim)] mb-16 max-w-lg mx-auto">
              Three steps from upload to a complete diagnostic report.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: "upload_file",
                  title: "Upload",
                  desc: "Drag in your DICOM files from your CD or USB drive.",
                },
                {
                  step: "02",
                  icon: "biotech",
                  title: "Analyse",
                  desc: "Our AI reviews every slice and flags anomalies with severity ratings.",
                },
                {
                  step: "03",
                  icon: "description",
                  title: "Share",
                  desc: "Download a professional letter for your doctor with all findings.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-sm bg-[var(--color-surface)] ghost-border tonal-shift group"
                >
                  <span className="absolute top-4 right-4 font-[family-name:var(--font-space-grotesk)] text-[var(--color-rm-on-surface-faint)] text-xs font-bold tracking-widest">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-sm bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-rm-primary)] mb-5">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h3 className="title-sm text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. FREE vs PAID ══ */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="headline-lg text-3xl text-center mb-4">Free Preview vs Full Analysis</h2>
            <p className="text-center text-[var(--color-rm-on-surface-dim)] mb-12 max-w-lg mx-auto">
              Get started free. Upgrade when you need the complete picture.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free tier */}
              <div className="p-8 rounded-sm bg-[var(--color-surface-low)] ghost-border">
                <div className="space-y-6">
                  <div>
                    <p className="label-md mb-2">Free Preview</p>
                    <p className="text-4xl font-extrabold font-[family-name:var(--font-space-grotesk)] text-[var(--color-rm-on-surface)]">$0</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {[
                      { text: "Upload any DICOM file", included: true },
                      { text: "AI-powered anomaly detection", included: true },
                      { text: "Blurred preview of findings", included: true },
                      { text: "Full resolution viewer", included: false },
                      { text: "Doctor's letter PDF", included: false },
                    ].map((feat) => (
                      <li key={feat.text} className={`flex items-center gap-3 ${feat.included ? "text-[var(--color-rm-on-surface-dim)]" : "text-[var(--color-rm-on-surface-faint)] line-through"}`}>
                        {feat.included ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[var(--color-severity-normal)] shrink-0">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 opacity-40">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        )}
                        {feat.text}
                      </li>
                    ))}
                  </ul>
                  <a href="#upload" className="btn btn-ghost btn-block">Upload Free</a>
                </div>
              </div>

              {/* Paid tier */}
              <div className="relative p-8 rounded-sm bg-[var(--color-surface-low)] ghost-border">
                <div className="absolute -inset-[1px] rounded-sm -z-10" style={{ background: "radial-gradient(ellipse at center, rgba(77, 142, 255, 0.12) 0%, transparent 70%)" }} />
                <span className="severity-badge bg-[var(--color-rm-primary-container)] text-white absolute top-4 right-4">
                  Recommended
                </span>
                <div className="space-y-6">
                  <div>
                    <p className="label-md mb-2">Full Analysis</p>
                    <p className="text-4xl font-extrabold font-[family-name:var(--font-space-grotesk)] text-[var(--color-rm-on-surface)]">
                      ${price}<span className="text-sm font-normal text-[var(--color-rm-on-surface-faint)] ml-1">/ study</span>
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {(config.stripe.plans[0]?.features ?? []).map(({ name: feature }) => (
                      <li key={feature} className="flex items-center gap-3 text-[var(--color-rm-on-surface-dim)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[var(--color-rm-primary)] shrink-0">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href="#upload" className="btn btn-primary btn-block">Get Full Analysis</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 6. FEATURE DEEP-DIVE ══ */}
        <section className="py-24 bg-[var(--color-surface-low)]">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="headline-lg text-3xl text-center mb-4">What You Get</h2>
            <p className="text-center text-[var(--color-rm-on-surface-dim)] mb-16 max-w-lg mx-auto">
              A comprehensive analysis powered by state-of-the-art medical imaging AI.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "visibility",
                  title: "Full Resolution DICOM Viewer",
                  desc: "Navigate every slice of your scan with clinical-grade rendering. Zoom, pan, and window/level controls included.",
                },
                {
                  icon: "target",
                  title: "Anomaly Detection & Severity",
                  desc: "Each finding is marked with a bounding box and classified as severe, moderate, mild, or normal.",
                },
                {
                  icon: "clinical_notes",
                  title: "Doctor's Letter PDF",
                  desc: "A professionally formatted report you can print and bring to your appointment. Includes all findings and measurements.",
                },
                {
                  icon: "lock",
                  title: "Secure Cloud Storage",
                  desc: "Your study is encrypted and stored permanently in your personal dashboard. Access it anytime from any device.",
                },
              ].map((feat) => (
                <div key={feat.title} className="p-6 rounded-sm bg-[var(--color-surface)] ghost-border">
                  <div className="w-10 h-10 rounded-sm bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-rm-primary)] mb-4">
                    <span className="material-symbols-outlined text-xl">{feat.icon}</span>
                  </div>
                  <h3 className="title-sm text-lg font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 7. WHO THIS IS FOR ══ */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="headline-lg text-3xl text-center mb-4">Who This Is For</h2>
            <p className="text-center text-[var(--color-rm-on-surface-dim)] mb-16 max-w-lg mx-auto">
              Anyone with a medical scan and a desire to understand it.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "person", title: "Patients", desc: "Understand your own scan before your appointment." },
                { icon: "family_restroom", title: "Caregivers", desc: "Help a loved one make sense of their results." },
                { icon: "stethoscope", title: "Physicians", desc: "Quick second-look triage for busy practices." },
                { icon: "school", title: "Students", desc: "Study real DICOM scans with AI-assisted annotations." },
              ].map((persona) => (
                <div key={persona.title} className="p-6 rounded-sm bg-[var(--color-surface-low)] ghost-border text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-rm-primary)] mx-auto mb-4">
                    <span className="material-symbols-outlined">{persona.icon}</span>
                  </div>
                  <h3 className="title-sm font-bold mb-2">{persona.title}</h3>
                  <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.5 }}>{persona.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 8. PRICING CTA ══ */}
        <section id="pricing" className="py-24 bg-[var(--color-surface-low)]">
          <div className="max-w-lg mx-auto px-8 text-center space-y-8">
            <h2 className="headline-lg text-3xl">Simple, One-Time Pricing</h2>
            <p>
              <span className="text-6xl font-extrabold text-[var(--color-rm-on-surface)] font-[family-name:var(--font-space-grotesk)]">${price}</span>
              <span className="text-sm text-[var(--color-rm-on-surface-faint)] ml-2">per study</span>
            </p>
            <p className="text-[var(--color-rm-on-surface-dim)]">
              No subscription. No hidden fees. Pay only when you need a full analysis.
            </p>
            <a href="#upload" className="btn btn-primary btn-lg">
              Upload &amp; Analyse Now
            </a>
            <div className="flex items-center justify-center gap-6 mt-6">
              <span className="label-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[var(--color-rm-primary)]">credit_card</span>
                Stripe Secure
              </span>
              <span className="label-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[var(--color-rm-primary)]">bolt</span>
                Instant Access
              </span>
            </div>
          </div>
        </section>

        {/* ══ 9. SECURITY & PRIVACY ══ */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="headline-lg text-3xl">Your Data. Your Control.</h2>
                <p className="text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  Free-tier scans are processed in-memory only &mdash; nothing is stored on our servers.
                  Paid analyses are encrypted at rest and in transit, stored in your private dashboard.
                </p>
                <p className="text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  You can delete your data at any time. We never share your medical information with third parties.
                </p>
              </div>
              <div className="p-6 rounded-sm bg-[var(--color-surface-low)] ghost-border space-y-4">
                {[
                  { icon: "encrypted", label: "AES-256 encryption at rest" },
                  { icon: "https", label: "TLS 1.3 in transit" },
                  { icon: "delete_forever", label: "Delete anytime from dashboard" },
                  { icon: "visibility_off", label: "No third-party data sharing" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-rm-primary)]">{item.icon}</span>
                    <span className="text-sm text-[var(--color-rm-on-surface-dim)]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 10. FAQ ══ */}
        <section id="faq" className="py-24 bg-[var(--color-surface-low)]">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="headline-lg text-3xl text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "What file formats do you accept?",
                  a: "We accept standard DICOM (.dcm) files — the format used by virtually all MRI, CT, and X-ray machines. You'll typically find these on the CD or USB drive given to you after your scan.",
                },
                {
                  q: "Is this a medical diagnosis?",
                  a: "No. Radiometric AI provides a preliminary AI-assisted analysis for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.",
                },
                {
                  q: "How is my data protected?",
                  a: "Free scans are processed in-memory and never stored. Paid analyses are encrypted with AES-256 at rest and TLS 1.3 in transit. You can delete your data at any time from your dashboard.",
                },
              ].map((faq) => (
                <details key={faq.q} className="group rounded-sm bg-[var(--color-surface)] ghost-border">
                  <summary className="flex items-center justify-between p-5 cursor-pointer">
                    <span className="title-sm font-bold text-[var(--color-rm-on-surface)]">{faq.q}</span>
                    <span className="material-symbols-outlined text-[var(--color-rm-on-surface-faint)] transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 11. FINAL CTA ══ */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-3xl mx-auto px-8 text-center space-y-8">
            <h2 className="headline-lg text-3xl md:text-4xl">
              You already have the scan.
              <br />
              <span className="gradient-text-primary">Now understand it.</span>
            </h2>
            <a href="#upload" className="btn btn-primary btn-lg">
              Upload Your Scan Free
            </a>
          </div>
        </section>

        {/* ══ 12. MEDICAL DISCLAIMER ══ */}
        <section className="py-8 bg-[var(--color-surface-container-lowest)]">
          <div className="max-w-3xl mx-auto px-8">
            <p className="text-[0.625rem] text-[var(--color-rm-on-surface-faint)] text-center" style={{ lineHeight: 1.6 }}>
              <strong>Medical Disclaimer:</strong> Radiometric AI is for informational purposes only and does not provide medical advice,
              diagnosis, or treatment. The AI analysis is a preliminary screening tool and should not replace consultation with a qualified
              healthcare professional. Always seek the advice of your physician or other qualified health provider with any questions
              regarding a medical condition.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/**
 * Convert DICOM ArrayBuffer to base64 PNG.
 */
async function dicomToBase64(buffer: ArrayBuffer): Promise<string | null> {
  try {
    const dcmjs = await import("dcmjs");
    const dicomData = dcmjs.data.DicomMessage.readFile(buffer);
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
      dicomData.dict
    );

    const rows = dataset.Rows || 512;
    const cols = dataset.Columns || 512;
    const bitsAllocated = dataset.BitsAllocated || 16;
    const pixelRepresentation = dataset.PixelRepresentation || 0;
    const rescaleSlope = dataset.RescaleSlope || 1;
    const rescaleIntercept = dataset.RescaleIntercept || 0;
    const windowCenter = Array.isArray(dataset.WindowCenter)
      ? dataset.WindowCenter[0]
      : dataset.WindowCenter || 127;
    const windowWidth = Array.isArray(dataset.WindowWidth)
      ? dataset.WindowWidth[0]
      : dataset.WindowWidth || 256;

    const pixelDataElement = dataset.PixelData;
    if (!pixelDataElement) return null;

    let rawPixels: ArrayBuffer;
    if (Array.isArray(pixelDataElement)) {
      rawPixels = pixelDataElement[0];
    } else if (pixelDataElement instanceof ArrayBuffer) {
      rawPixels = pixelDataElement;
    } else {
      return null;
    }

    let pixelArray: Int16Array | Uint16Array | Uint8Array;
    if (bitsAllocated === 16) {
      pixelArray =
        pixelRepresentation === 1
          ? new Int16Array(rawPixels)
          : new Uint16Array(rawPixels);
    } else {
      pixelArray = new Uint8Array(rawPixels);
    }

    const canvas = document.createElement("canvas");
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(cols, rows);

    const wc = Number(windowCenter);
    const ww = Number(windowWidth);
    const lower = wc - ww / 2;
    const upper = wc + ww / 2;

    for (let i = 0; i < pixelArray.length && i < rows * cols; i++) {
      const hu = pixelArray[i] * rescaleSlope + rescaleIntercept;
      let val: number;
      if (hu <= lower) {
        val = 0;
      } else if (hu >= upper) {
        val = 255;
      } else {
        val = ((hu - lower) / (upper - lower)) * 255;
      }

      const idx = i * 4;
      imageData.data[idx] = val;
      imageData.data[idx + 1] = val;
      imageData.data[idx + 2] = val;
      imageData.data[idx + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl.split(",")[1];
  } catch (err) {
    console.error("DICOM parsing error:", err);
    return null;
  }
}
