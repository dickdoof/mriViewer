"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import PreviewViewer from "@/components/PreviewViewer";
import PaywallOverlay from "@/components/PaywallOverlay";
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
      // Pick the middle slice
      const middleIndex = Math.floor(files.length / 2);
      const middleFile = files[middleIndex];

      // Convert DICOM to PNG using canvas
      // For now, render raw pixel data as grayscale image
      const imageBase64 = await dicomToBase64(middleFile.arrayBuffer);

      if (!imageBase64) {
        console.error("Failed to convert DICOM to image");
        setIsAnalysing(false);
        return;
      }

      setPreviewImage(`data:image/png;base64,${imageBase64}`);

      // Send to annotation API
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
      // Store DICOM files in sessionStorage keys for post-payment upload
      // Note: sessionStorage has ~5MB limit, so we store file metadata
      // and keep ArrayBuffers in memory via the React state
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

  // Regions count from findings
  const regions = new Set(findings.map((f) => f.label.split(" ")[0]));

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
          {/* Animated CSS spine/brain illustration */}
          <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
            <svg
              viewBox="0 0 800 600"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              {/* Stylized brain outline */}
              <ellipse cx="400" cy="220" rx="140" ry="120" className="animate-pulse" style={{ animationDuration: "4s" }} />
              <ellipse cx="360" cy="210" rx="80" ry="90" opacity="0.6" />
              <ellipse cx="440" cy="210" rx="80" ry="90" opacity="0.6" />
              {/* Spine */}
              <path d="M400 340 Q395 380 400 420 Q405 460 400 500 Q395 540 400 580" strokeWidth="2" className="animate-pulse" style={{ animationDuration: "3s" }} />
              {/* Vertebrae */}
              {[360, 400, 440, 480, 520, 560].map((y) => (
                <ellipse key={y} cx="400" cy={y} rx="20" ry="8" opacity="0.4" className="animate-pulse" style={{ animationDuration: `${3 + (y % 3)}s` }} />
              ))}
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-20 md:py-32">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Your MRI.{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Understood.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Upload your MRI scan and get an AI-powered analysis with
                findings highlighted &mdash; in minutes, not weeks.
              </p>

              {!previewImage && (
                <a
                  href="#upload"
                  className="btn btn-primary btn-lg inline-flex"
                >
                  Analyse My MRI Free
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </a>
              )}
            </div>

            {/* Upload Widget / Preview */}
            <div id="upload" className="mt-16 max-w-2xl mx-auto">
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
                    onCheckout={handleCheckout}
                    isCheckoutLoading={isCheckoutLoading}
                  />
                </div>
              ) : (
                <>
                  <UploadZone
                    onFilesLoaded={handleFilesLoaded}
                    isLoading={isAnalysing}
                  />
                  <p className="text-center mt-4">
                    <button
                      className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
                      onClick={() => {
                        // TODO: Load a bundled demo DICOM scan
                        alert("Demo scan coming soon! Upload your own .dcm files for now.");
                      }}
                    >
                      Or try a demo scan
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Decorative background gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
              style={{
                background:
                  "radial-gradient(circle, rgba(87, 13, 248, 0.8) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-5"
              style={{
                background:
                  "radial-gradient(circle, rgba(87, 13, 248, 0.6) 0%, transparent 70%)",
              }}
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-base-200">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-3xl font-extrabold text-center mb-16">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                  ),
                  title: "Upload",
                  desc: "Drag in your DICOM files from your CD or USB drive.",
                },
                {
                  step: "2",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  ),
                  title: "Analyse",
                  desc: "Our AI reviews every slice and flags anomalies with severity ratings.",
                },
                {
                  step: "3",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  ),
                  title: "Share",
                  desc: "Download a professional letter for your doctor with all findings.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="text-center space-y-4 p-6 rounded-xl bg-base-100 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-base-content/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="max-w-lg mx-auto px-8">
            <h2 className="text-3xl font-extrabold text-center mb-4">
              Simple Pricing
            </h2>
            <p className="text-center text-base-content/60 mb-12">
              One-time payment per study. No subscriptions.
            </p>

            <div className="card bg-base-100 shadow-xl border border-primary/20">
              <div className="card-body items-center text-center space-y-4">
                <div className="badge badge-primary badge-lg">Most Popular</div>
                <h3 className="text-2xl font-bold">Full MRI Analysis</h3>
                <p className="text-5xl font-extrabold">
                  $29
                  <span className="text-lg font-normal text-base-content/60">
                    {" "}
                    / study
                  </span>
                </p>
                <ul className="text-left space-y-2 w-full">
                  {[
                    "Full resolution DICOM viewer",
                    "All findings with severity ratings",
                    "Slice-by-slice navigation",
                    "Brightness & contrast controls",
                    "Doctor's letter PDF download",
                    "Permanent secure storage",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-primary shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="#upload" className="btn btn-primary btn-block btn-lg mt-4">
                  Unlock Full Analysis
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-base-200">
          <div className="max-w-3xl mx-auto px-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="badge badge-outline badge-lg">
                Powered by Claude AI
              </div>
            </div>
            <p className="text-base-content/70 max-w-xl mx-auto">
              Free-tier scans are processed in memory only &mdash; nothing is
              stored on our servers. Your privacy is our priority.
            </p>
            <p className="text-sm text-base-content/50 max-w-xl mx-auto">
              For informational purposes only. Not a substitute for professional
              medical advice. Always consult a qualified medical professional for
              diagnosis and treatment.
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
 * Uses a simplified approach: extracts pixel data and renders to canvas.
 */
async function dicomToBase64(buffer: ArrayBuffer): Promise<string | null> {
  try {
    // Dynamic import dcmjs for client-side parsing
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

    // Get pixel data
    const pixelDataElement = dataset.PixelData;
    if (!pixelDataElement) return null;

    // Handle both raw and encapsulated pixel data
    let rawPixels: ArrayBuffer;
    if (Array.isArray(pixelDataElement)) {
      rawPixels = pixelDataElement[0];
    } else if (pixelDataElement instanceof ArrayBuffer) {
      rawPixels = pixelDataElement;
    } else {
      return null;
    }

    // Create typed array based on bits allocated
    let pixelArray: Int16Array | Uint16Array | Uint8Array;
    if (bitsAllocated === 16) {
      pixelArray =
        pixelRepresentation === 1
          ? new Int16Array(rawPixels)
          : new Uint16Array(rawPixels);
    } else {
      pixelArray = new Uint8Array(rawPixels);
    }

    // Apply rescale and window/level
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

    // Convert canvas to base64 PNG
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl.split(",")[1]; // Remove "data:image/png;base64," prefix
  } catch (err) {
    console.error("DICOM parsing error:", err);
    return null;
  }
}
