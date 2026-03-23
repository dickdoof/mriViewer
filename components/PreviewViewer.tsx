"use client";

import { useRef } from "react";
import type { Finding } from "@/libs/annotate";

interface PreviewViewerProps {
  imageDataUrl: string;
  findings: Finding[];
  imageWidth: number;
  imageHeight: number;
}

const severityColor: Record<string, string> = {
  severe: "#ff5451",
  moderate: "#ff9100",
  mild: "#ffd700",
  normal: "#69db7c",
};

export default function PreviewViewer({
  imageDataUrl,
  findings,
  imageWidth,
  imageHeight,
}: PreviewViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Count unique body regions from finding labels
  const regionCount = new Set(
    findings.map((f) => {
      const match = f.label.match(/[A-Z]\d+/i);
      return match ? match[0] : f.label;
    })
  ).size;

  return (
    <div className="flex flex-col h-full bg-[#070d1f]">
      {/* TOOLBAR (disabled/grayed) */}
      <div className="h-12 border-b border-[#424754]/10 bg-[#0c1324] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex bg-[#2e3447] border border-[#424754]/20 p-0.5">
            <button className="p-1 text-slate-400 transition-colors" disabled>
              <span className="material-symbols-outlined text-lg">zoom_in</span>
            </button>
            <button className="p-1 text-slate-400 transition-colors" disabled>
              <span className="material-symbols-outlined text-lg">zoom_out</span>
            </button>
            <button className="p-1 text-slate-400 transition-colors border-l border-[#424754]/10" disabled>
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </button>
          </div>

          <div className="flex bg-[#2e3447] border border-[#424754]/20 p-0.5">
            <button className="px-2 py-1 text-[0.65rem] font-[family-name:var(--font-data)] font-bold bg-[#adc6ff]/20 text-[#adc6ff]">
              SINGLE
            </button>
            <button className="px-2 py-1 text-[0.65rem] font-[family-name:var(--font-data)] font-bold text-slate-400" disabled>
              DUAL
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-data)] text-[0.65rem] uppercase tracking-wider text-slate-400">Show Findings</span>
            <div className="relative w-8 h-4 bg-[#4d8eff]/20 rounded-full border border-[#adc6ff]/20">
              <div className="absolute left-0.5 top-0.5 w-2.5 h-2.5 bg-[#adc6ff] rounded-full translate-x-4" />
            </div>
          </label>
          <button className="px-4 py-1.5 bg-[#2e3447] border border-[#adc6ff]/30 text-[#adc6ff] font-[family-name:var(--font-data)] text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Annotate with AI
          </button>
        </div>
      </div>

      {/* VIEWPORT WITH BLUR */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden bg-black group"
      >
        {/* Blurred MRI image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageDataUrl}
          alt="MRI Preview"
          width={imageWidth}
          height={imageHeight}
          className="max-h-[85%] grayscale opacity-90 transition-transform duration-500 scale-150"
          style={{ filter: "contrast(1.25) blur(6px) brightness(0.8)" }}
        />

        {/* AI Bounding Boxes (blurred, pulsing) */}
        <div className="absolute inset-0 pointer-events-none" style={{ filter: "blur(4px)" }}>
          {findings.map((finding, i) => {
            const [x, y, w, h] = finding.bbox;
            const color = severityColor[finding.severity] || severityColor.normal;

            return (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  width: `${w * 100}%`,
                  height: `${h * 100}%`,
                  border: `1px solid ${color}`,
                  backgroundColor: `${color}15`,
                  animationDuration: "4s",
                }}
              >
                <div
                  className="absolute -top-6 left-0 px-1.5 py-0.5 text-[0.6rem] font-[family-name:var(--font-data)] font-bold uppercase flex items-center gap-1"
                  style={{ backgroundColor: color, color: "#0c1324" }}
                >
                  <span className="material-symbols-outlined text-[0.7rem]">warning</span>
                  {finding.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* HUD Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 font-[family-name:var(--font-data)] text-[0.65rem] text-[#adc6ff]/60 tracking-widest uppercase pointer-events-none">
          <div>Slice: <span className="text-white">1 / 1</span></div>
          <div>Zoom: <span className="text-white">2.0x</span></div>
          <div>Window: <span className="text-white">L: 450 W: 1200</span></div>
        </div>

        <div className="absolute bottom-4 right-4 text-[#adc6ff]/40 font-[family-name:var(--font-data)] text-[0.55rem] uppercase pointer-events-none text-right">
          FOR DIAGNOSTIC USE ONLY<br />NOT FOR PUBLIC RELEASE
        </div>

        {/* Floating Badge */}
        {findings.length > 0 && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-[#2e3447]/90 backdrop-blur-md px-4 py-2 border border-[#adc6ff]/30 shadow-2xl flex items-center gap-3">
              <span className="text-xs">
                <span className="text-[#adc6ff] font-bold">{findings.length} findings detected</span>
                {regionCount > 0 && <span className="text-slate-300"> &middot; Across {regionCount} body region{regionCount !== 1 ? "s" : ""}</span>}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SLICE BAR (disabled) */}
      <div className="h-16 border-t border-[#424754]/10 bg-[#191f31] px-6 flex items-center gap-10 opacity-50 cursor-not-allowed grayscale pointer-events-none">
        <div className="flex-1 flex items-center gap-4">
          <span className="font-[family-name:var(--font-data)] text-[0.65rem] uppercase tracking-wider text-slate-500 w-12 text-right">Slice</span>
          <div className="flex-1 h-0.5 bg-[#424754]/20 relative">
            <div className="absolute h-full bg-[#4d8eff]/40 w-[28%]" />
            <div className="absolute w-3 h-3 bg-[#adc6ff]/40 border-2 border-[#191f31] top-1/2 -translate-y-1/2 left-[28%]" />
          </div>
          <span className="font-[family-name:var(--font-data)] text-[0.7rem] text-white w-10">1/1</span>
        </div>
        <div className="flex items-center gap-8 border-l border-[#424754]/10 pl-10">
          <div className="flex flex-col gap-1 w-24">
            <div className="flex justify-between text-[0.55rem] font-[family-name:var(--font-data)] text-slate-500 uppercase">
              <span>BRT</span><span className="text-[#adc6ff]">100%</span>
            </div>
            <div className="h-0.5 bg-[#424754]/20 relative">
              <div className="absolute h-full bg-[#adc6ff]/60 w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-24">
            <div className="flex justify-between text-[0.55rem] font-[family-name:var(--font-data)] text-slate-500 uppercase">
              <span>CTR</span><span className="text-[#adc6ff]">100%</span>
            </div>
            <div className="h-0.5 bg-[#424754]/20 relative">
              <div className="absolute h-full bg-[#adc6ff]/60 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
