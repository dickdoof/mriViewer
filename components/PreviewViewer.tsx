"use client";

import { useRef } from "react";
import type { Finding } from "@/libs/annotate";

interface PreviewViewerProps {
  imageDataUrl: string;
  findings: Finding[];
  imageWidth: number;
  imageHeight: number;
}

const severityGlowClass: Record<string, string> = {
  severe: "anomaly-glow-severe",
  moderate: "anomaly-glow-moderate",
  mild: "anomaly-glow-mild",
  normal: "anomaly-glow-normal",
};

const severityColor: Record<string, string> = {
  severe: "var(--color-severity-severe)",
  moderate: "var(--color-severity-moderate)",
  mild: "var(--color-severity-mild)",
  normal: "var(--color-severity-normal)",
};

export default function PreviewViewer({
  imageDataUrl,
  findings,
  imageWidth,
  imageHeight,
}: PreviewViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Deep Void viewport wrapper — Ghost Border per spec */}
      <div className="viewport-void relative overflow-hidden">
        <img
          src={imageDataUrl}
          alt="MRI Preview"
          className="w-full h-auto"
          style={{
            filter: "blur(6px) brightness(0.8)",
          }}
        />

        {/* Annotation bounding boxes — blurred, with anomaly glow */}
        <div
          className="absolute inset-0"
          style={{ filter: "blur(4px)" }}
        >
          {findings.map((finding, i) => {
            const [x, y, w, h] = finding.bbox;
            const color = severityColor[finding.severity] || severityColor.normal;
            const glowClass = severityGlowClass[finding.severity] || severityGlowClass.normal;

            return (
              <div
                key={i}
                className={`absolute animate-[glow-pulse_2s_ease-in-out_infinite] ${glowClass}`}
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  width: `${w * 100}%`,
                  height: `${h * 100}%`,
                  border: `2px solid ${color}`,
                  backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                  borderRadius: "0.125rem",
                  ["--glow-color" as string]: `color-mix(in srgb, ${color} 30%, transparent)`,
                }}
                title="&#128274; Unlock to see details"
              />
            );
          })}
        </div>
      </div>

      {/* Finding count badge — Space Grotesk readout */}
      {findings.length > 0 && (
        <div
          className="absolute top-3 right-3 px-3 py-1.5 rounded-sm text-sm font-bold font-[family-name:var(--font-space-grotesk)] glass-panel"
          style={{ color: "var(--color-rm-tertiary)" }}
        >
          <span className="value-readout">{findings.length}</span>
          {" "}finding{findings.length !== 1 ? "s" : ""} detected
        </div>
      )}
    </div>
  );
}
