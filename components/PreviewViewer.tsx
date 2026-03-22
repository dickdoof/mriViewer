"use client";

import { useEffect, useRef } from "react";
import type { Finding } from "@/libs/annotate";

interface PreviewViewerProps {
  imageDataUrl: string;
  findings: Finding[];
  imageWidth: number;
  imageHeight: number;
}

export default function PreviewViewer({
  imageDataUrl,
  findings,
  imageWidth,
  imageHeight,
}: PreviewViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Blurred MRI image */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={imageDataUrl}
          alt="MRI Preview"
          className="w-full h-auto"
          style={{
            filter: "blur(6px) brightness(0.8)",
          }}
        />

        {/* Annotation bounding boxes (also blurred) */}
        <div
          className="absolute inset-0"
          style={{ filter: "blur(4px)" }}
        >
          {findings.map((finding, i) => {
            const [x, y, w, h] = finding.bbox;
            const severityColor =
              finding.severity === "severe"
                ? "rgba(239, 68, 68, 0.5)"
                : finding.severity === "moderate"
                ? "rgba(249, 115, 22, 0.5)"
                : finding.severity === "mild"
                ? "rgba(234, 179, 8, 0.5)"
                : "rgba(34, 197, 94, 0.5)";

            return (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  width: `${w * 100}%`,
                  height: `${h * 100}%`,
                  border: `2px solid ${severityColor}`,
                  backgroundColor: severityColor.replace("0.5", "0.15"),
                  borderRadius: "4px",
                }}
                title="&#128274; Unlock to see details"
              />
            );
          })}
        </div>
      </div>

      {/* Finding count badge */}
      {findings.length > 0 && (
        <div className="absolute top-4 right-4 bg-warning text-warning-content px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          {findings.length} finding{findings.length !== 1 ? "s" : ""} detected
        </div>
      )}
    </div>
  );
}
