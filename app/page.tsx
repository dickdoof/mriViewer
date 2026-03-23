"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DiscountBanner from "@/components/DiscountBanner";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import config from "@/config";
import { storeDicomFiles } from "@/libs/dicomStore";

interface DicomFile {
  file: File;
  arrayBuffer: ArrayBuffer;
}

export default function LandingPage() {
  const router = useRouter();
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleFilesLoaded = useCallback(async (files: DicomFile[]) => {
    setIsAnalysing(true);
    try {
      await storeDicomFiles(
        files.map((f) => ({ name: f.file.name, arrayBuffer: f.arrayBuffer }))
      );
      router.push("/preview");
    } catch (err) {
      console.error("Error storing files:", err);
      setIsAnalysing(false);
    }
  }, [router]);

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
                Upload your MRI, CT, X-ray, or Ultrasound. Get a clear AI analysis.
                Walk into your next appointment prepared with radiologist-grade insights.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#upload" className="btn btn-primary btn-lg inline-flex gap-2">
                  Start Your Scan Analysis
                </a>
                <a href="#how-it-works" className="btn btn-ghost btn-lg">
                  View Sample Report
                </a>
              </div>
            </div>

            {/* Diagnostic viewport with Upload / Preview */}
            <div id="upload" className="mt-20 max-w-2xl mx-auto">
              <div className="relative rounded-sm overflow-hidden mri-gradient">
                {/* HUD overlay text */}
                <div className="absolute inset-0 pointer-events-none z-10 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <span className="label-sm text-[var(--color-rm-on-surface-faint)]">MODALITY: MULTI_SUPPORT</span>
                      <span className="label-sm text-[var(--color-rm-on-surface-faint)]">SCAN_TYPE: DICOM_STANDARD</span>
                    </div>
                    <span className="label-sm text-[var(--color-rm-on-surface-faint)] px-2 py-0.5 border border-[var(--color-outline-variant)]/20">READY FOR ANALYSIS</span>
                  </div>
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-[var(--color-outline-variant)]/30" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-[var(--color-outline-variant)]/30" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-[var(--color-outline-variant)]/30" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-[var(--color-outline-variant)]/30" />
                </div>

                <div className="relative z-20">
                  <UploadZone
                    onFilesLoaded={handleFilesLoaded}
                    isLoading={isAnalysing}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ 2. SOCIAL PROOF BAR ══ */}
        <section className="py-12 bg-[var(--color-surface-container-lowest)] border-y border-[var(--color-outline-variant)]/10">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { value: "12,400+", label: "Scans Analysed" },
                { value: "Under 3 min", label: "Findings Delivered" },
                { value: "48 Countries", label: "Used by Patients" },
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
            <span className="label-md text-[var(--color-rm-primary)]">Why This Exists</span>
            <h2 className="headline-lg text-3xl md:text-4xl">
              You got your MRI. Now what?
            </h2>
            <p className="text-[var(--color-rm-on-surface-dim)] text-lg max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
              Most patients leave the imaging center with a CD-ROM they can&apos;t open
              and a 2-week wait for a follow-up appointment. The anxiety of not knowing
              what&apos;s on that disc is overwhelming.
            </p>
            <p className="text-[var(--color-rm-on-surface-dim)] max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
              Medical reports are written for doctors, not for you. Radiometric AI bridges
              that gap, giving you immediate clarity so you can walk into your next
              appointment as a partner in your care, not just a passenger.
            </p>
          </div>
        </section>

        {/* ══ 4. HOW IT WORKS ══ */}
        <section id="how-it-works" className="py-24 bg-[var(--color-surface-low)]">
          <div className="max-w-5xl mx-auto px-8">
            <span className="label-md text-[var(--color-rm-primary)] block text-center mb-4">The Process</span>
            <h2 className="headline-lg text-3xl text-center mb-16">From Scan to Insight</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: "upload_file",
                  title: "Upload",
                  desc: "Drag in your DICOM files directly from your patient CD, USB drive, or cloud portal. Our system supports all major imaging modalities including MRI, CT, X-ray, and Ultrasound.",
                },
                {
                  step: "02",
                  icon: "biotech",
                  title: "Analyze",
                  desc: "Our Claude-powered AI processes thousands of high-resolution slices, cross-referencing findings with clinical databases to flag anomalies with specific location and severity metrics.",
                },
                {
                  step: "03",
                  icon: "description",
                  title: "Understand",
                  desc: "Receive a plain-English summary of your results alongside a professional-grade technical report you can share with your doctor for a more informed consultation.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-sm bg-[var(--color-surface)] ghost-border tonal-shift group overflow-hidden"
                >
                  <span className="absolute bottom-2 left-5 font-[family-name:var(--font-space-grotesk)] text-[5rem] leading-none font-bold text-[var(--color-rm-on-surface-faint)] opacity-15 select-none pointer-events-none">
                    {item.step}
                  </span>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-sm bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-rm-primary)] mb-5">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <h3 className="title-sm text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. FREE vs PAID ══ */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="headline-lg text-3xl text-center mb-12">Choose Your Level of Clarity</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free tier */}
              <div className="p-8 rounded-sm bg-[var(--color-surface-low)] ghost-border">
                <div className="space-y-6">
                  <div>
                    <p className="label-md mb-2">Free Preview</p>
                    <p className="text-4xl font-extrabold font-[family-name:var(--font-space-grotesk)] text-[var(--color-rm-on-surface)]">$0</p>
                  </div>
                  <p className="text-sm text-[var(--color-rm-on-surface-dim)]">Instant basic scan validation.</p>
                  <ul className="space-y-3 text-sm">
                    {[
                      "DICOM File Validation",
                      "Scan Quality Audit",
                      "Metadata Identification",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-[var(--color-rm-on-surface-dim)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[var(--color-severity-normal)] shrink-0">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a href="#upload" className="btn btn-ghost btn-block">Start Free</a>
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
                      ${price}<span className="text-sm font-normal text-[var(--color-rm-on-surface-faint)] ml-1">/study</span>
                    </p>
                  </div>
                  <p className="text-sm text-[var(--color-rm-on-surface-dim)]">Complete diagnostic-grade insight.</p>
                  <ul className="space-y-3 text-sm">
                    {[
                      "Multi-Slice AI Interpretation",
                      "Color-Coded Severity Scoring",
                      "Plain-English Explanations",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-[var(--color-rm-on-surface-dim)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[var(--color-rm-primary)] shrink-0">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a href="#upload" className="btn btn-primary btn-block">Get Full Access</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 6. FEATURE DEEP-DIVE ══ */}
        <section className="py-24 bg-[var(--color-surface-low)]">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="headline-lg text-3xl mb-4">What You Get</h2>
            <p className="text-[var(--color-rm-on-surface-dim)] mb-16 max-w-2xl" style={{ lineHeight: 1.7 }}>
              A comprehensive toolkit designed to turn complex clinical data into actionable patient knowledge.
            </p>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              <div>
                <span className="label-md text-[var(--color-rm-primary)] mb-2 block">DICOM Clarity</span>
                <h3 className="title-sm text-xl font-bold mb-3">Full-Resolution Cloud Viewer</h3>
                <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  Access your scans anywhere without specialized software. Our viewer includes color-coded severity markers:{" "}
                  <span className="text-[var(--color-severity-severe)]">Red (Urgent)</span>,{" "}
                  <span className="text-[var(--color-severity-moderate)]">Orange (Abnormal)</span>,{" "}
                  <span className="text-[var(--color-severity-mild)]">Yellow (Observation)</span>, and{" "}
                  <span className="text-[var(--color-severity-normal)]">Green (Normal)</span>.
                </p>
              </div>
              <div>
                <span className="label-md text-[var(--color-rm-primary)] mb-2 block">Data Portability</span>
                <h3 className="title-sm text-xl font-bold mb-3">Secure Personal Archive</h3>
                <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  Never lose a scan again. We store your full DICOM volumes in an encrypted personal vault.
                  Access them on your phone, tablet, or PC whenever you switch doctors or seek a new opinion.
                </p>
              </div>
              <div>
                <span className="label-md text-[var(--color-rm-primary)] mb-2 block">Clinical Accuracy</span>
                <h3 className="title-sm text-xl font-bold mb-3">Professional Doctor&apos;s Letter</h3>
                <h3 className="title-sm text-lg font-bold mb-3 text-[var(--color-rm-on-surface-dim)]">Detailed Findings Report</h3>
                <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  A dual-report system. One side is written for you in plain language, explaining what every
                  term means. The other is a structured clinical summary ready to hand to any specialist.
                </p>
              </div>
              <div className="p-6 rounded-sm bg-[var(--color-surface-container-highest)] ghost-border flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-[var(--color-rm-primary)]">shield</span>
                  <h3 className="title-sm text-lg font-bold">HIPAA Compliant Infrastructure</h3>
                </div>
                <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  Our platform uses the same security standards as top-tier hospitals. Your data is encrypted
                  at rest and in transit, and you maintain 100% ownership at all times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 7. WHO THIS IS FOR ══ */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="headline-lg text-3xl text-center mb-16">Who Radiometric Is For</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Waiting for Results", desc: "Don't wait 14 days for a follow-up. Get an instant preview of your scan findings the moment you get home." },
                { title: "Second Perspectives", desc: "Cross-check your current diagnosis with an unbiased AI analysis to ensure no finding was overlooked." },
                { title: "Changing Doctors", desc: "Easily transfer and share your full DICOM data with new specialists without carrying physical CDs." },
                { title: "Taking Ownership", desc: "For the proactive patient who wants to understand their health data as deeply as their physician does." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-sm bg-[var(--color-surface-low)] ghost-border">
                  <h3 className="title-sm font-bold mb-3 text-[var(--color-rm-primary)]">{item.title}</h3>
                  <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 8. PRICING CTA ══ */}
        <section id="pricing" className="py-24 bg-[var(--color-surface-low)]">
          <div className="max-w-lg mx-auto px-8 text-center space-y-8">
            <h2 className="headline-lg text-3xl">One Price. Total Clarity.</h2>
            <p>
              <span className="text-6xl font-extrabold text-[var(--color-rm-primary)] font-[family-name:var(--font-space-grotesk)]">${price}</span>
            </p>
            <p className="text-[var(--color-rm-on-surface-dim)]">
              Per study analysis. Includes full DICOM viewing, AI findings, and downloadable
              PDF summaries. No subscription required.
            </p>
            <div className="flex items-center justify-center gap-6">
              <span className="label-sm flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[var(--color-rm-on-surface-dim)]">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Secured by Stripe
              </span>
              <span className="label-sm flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[var(--color-rm-on-surface-dim)]">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Instant Access
              </span>
            </div>
            <a href="#upload" className="btn btn-primary btn-lg">
              Analyze My Scan Now
            </a>
          </div>
        </section>

        {/* ══ 9. SECURITY & PRIVACY ══ */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="headline-lg text-3xl">Privacy by Design</h2>
                <p className="text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  We take your data sovereignty seriously. On our Free tier, we never store
                  your scan data permanently&mdash;it is purged as soon as you close your session.
                </p>
                <p className="text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.7 }}>
                  For Paid users, data is end-to-end encrypted and stored in SOC2 compliant
                  servers. We do not sell your data to pharmaceutical companies or insurance
                  providers. You are in control.
                </p>
              </div>
              <div className="p-6 rounded-sm bg-[var(--color-surface-low)] ghost-border space-y-6">
                {[
                  { label: "E2E Encryption", detail: "Military-grade AES-256" },
                  { label: "Zero-Data Retention", detail: "Available for Free tier" },
                  { label: "HIPAA Ready", detail: "Patient-centered compliance" },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-4">
                    <span className="label-md text-[var(--color-rm-primary)] whitespace-nowrap">{item.label}</span>
                    <span className="text-sm text-[var(--color-rm-on-surface-dim)]">{item.detail}</span>
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
                  q: "What types of scans can I upload?",
                  a: "We support all standard DICOM files (.dcm) including MRI, CT, X-ray, and Ultrasound. These are the files you'll find on the CD or USB drive given to you after your scan at any imaging center.",
                },
                {
                  q: "Is this a replacement for a radiologist?",
                  a: "No. Radiometric AI provides a preliminary AI-assisted analysis for informational purposes only. It is designed to help you understand your scan before your appointment — not to replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.",
                },
                {
                  q: "How long does the analysis take?",
                  a: "Most scans are analyzed in under 3 minutes. The time depends on the number of slices and the complexity of the study. You'll receive your findings as soon as the analysis is complete — no waiting for callbacks or appointments.",
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
            <h2 className="headline-lg text-3xl md:text-5xl">
              You already have the scan.
              <br />
              <span className="gradient-text-primary">Now understand it.</span>
            </h2>
            <p className="text-[var(--color-rm-on-surface-dim)] text-lg max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
              Stop guessing. Get professional-grade insights from your radiology data in minutes.
            </p>
            <a href="#upload" className="btn btn-primary btn-lg px-12 py-4 text-base">
              Upload My MRI &mdash; Free Preview
            </a>
          </div>
        </section>

        {/* ══ 12. MEDICAL DISCLAIMER ══ */}
        <section className="py-8 bg-[var(--color-surface-container-lowest)]">
          <div className="max-w-3xl mx-auto px-8">
            <p className="text-[0.625rem] text-[var(--color-rm-on-surface-faint)] text-center uppercase tracking-wide" style={{ lineHeight: 1.6 }}>
              Disclaimer: Radiometric AI is for informational purposes only. The radiology analysis provided is not a substitute for
              professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health
              provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

