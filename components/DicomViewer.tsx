"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AnnotationOverlay from "./AnnotationOverlay";
import type { Finding } from "@/libs/annotate";

interface DicomSlice {
  url: string;
  fileName: string;
  findings?: Finding[];
}

interface DicomViewerProps {
  slices: DicomSlice[];
  allFindings: Finding[];
}

export default function DicomViewer({ slices, allFindings }: DicomViewerProps) {
  const [currentSlice, setCurrentSlice] = useState(
    Math.floor(slices.length / 2)
  );
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<"SINGLE" | "DUAL">("SINGLE");
  const [showFindings, setShowFindings] = useState(true);
  const [selectedFinding, setSelectedFinding] = useState<number | undefined>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cachedImageRef = useRef<HTMLImageElement | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const currentUrl = slices[currentSlice]?.url;

  // Load image only when URL changes
  useEffect(() => {
    if (!currentUrl) return;
    setImageLoaded(false);
    cachedImageRef.current = null;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      cachedImageRef.current = img;
      setImageLoaded(true);
    };
    img.src = currentUrl;
  }, [currentUrl]);

  // Redraw canvas whenever cached image or filters change
  useEffect(() => {
    const img = cachedImageRef.current;
    if (!img) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(img, 0, 0);
  }, [imageLoaded, brightness, contrast]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setCurrentSlice((s) => Math.max(0, s - 1));
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setCurrentSlice((s) => Math.min(slices.length - 1, s + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slices.length]);

  // Wheel event: plain scroll = slices, Ctrl/Meta+scroll = zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        setZoom((z) => Math.max(0.5, Math.min(4, z + (e.deltaY > 0 ? -0.1 : 0.1))));
      } else {
        setCurrentSlice((s) => {
          const next = s + (e.deltaY > 0 ? 1 : -1);
          return Math.max(0, Math.min(slices.length - 1, next));
        });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [slices.length]);

  // Reset pan when zoom <= 1
  useEffect(() => {
    if (zoom <= 1) setPanOffset({ x: 0, y: 0 });
  }, [zoom]);

  const handleZoomIn = () => setZoom((z) => Math.min(4, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));
  const handleZoomReset = () => { setZoom(1); setPanOffset({ x: 0, y: 0 }); };

  // Draggable slider helper
  const startDrag = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      setter: (value: number) => void,
      maxValue: number
    ) => {
      e.preventDefault();
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();

      const update = (clientX: number) => {
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        setter(Math.round(pct * maxValue));
      };

      update(e.clientX);

      const onMove = (ev: MouseEvent) => update(ev.clientX);
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    []
  );

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    isPanningRef.current = true;
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    (e.currentTarget as HTMLElement).style.cursor = "grabbing";
  }, [zoom, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanningRef.current) return;
    setPanOffset({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isPanningRef.current) return;
    isPanningRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = zoom > 1 ? "grab" : "crosshair";
    }
  }, [zoom]);

  const slicePercent = slices.length > 1 ? ((currentSlice) / (slices.length - 1)) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-[#070d1f]">
      {/* TOOLBAR */}
      <div className="h-12 border-b border-[#424754]/10 bg-[#0c1324] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Zoom controls */}
          <div className="flex bg-[#2e3447] border border-[#424754]/20 p-0.5">
            <button onClick={handleZoomIn} className="p-1 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">zoom_in</span>
            </button>
            <button onClick={handleZoomOut} className="p-1 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">zoom_out</span>
            </button>
            <button onClick={handleZoomReset} className="p-1 text-slate-400 hover:text-white transition-colors border-l border-[#424754]/10">
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex bg-[#2e3447] border border-[#424754]/20 p-0.5">
            <button
              onClick={() => setViewMode("SINGLE")}
              className={`px-2 py-1 text-[0.65rem] font-[family-name:var(--font-data)] font-bold ${
                viewMode === "SINGLE" ? "bg-[#adc6ff]/20 text-[#adc6ff]" : "text-slate-400 hover:text-white"
              } transition-colors`}
            >
              SINGLE
            </button>
            <button
              onClick={() => setViewMode("DUAL")}
              className={`px-2 py-1 text-[0.65rem] font-[family-name:var(--font-data)] font-bold ${
                viewMode === "DUAL" ? "bg-[#adc6ff]/20 text-[#adc6ff]" : "text-slate-400 hover:text-white"
              } transition-colors`}
            >
              DUAL
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Show Findings toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="font-[family-name:var(--font-data)] text-[0.65rem] uppercase tracking-wider text-slate-400">Show Findings</span>
            <button
              onClick={() => setShowFindings(!showFindings)}
              className={`relative w-8 h-4 rounded-full border transition-colors ${
                showFindings
                  ? "bg-[#4d8eff]/20 border-[#adc6ff]/20"
                  : "bg-[#2e3447] border-[#424754]/30"
              }`}
            >
              <div className={`absolute left-0.5 top-0.5 w-2.5 h-2.5 bg-[#adc6ff] rounded-full transition-transform ${
                showFindings ? "translate-x-4" : "translate-x-0"
              }`} />
            </button>
          </label>

          {/* Annotate with AI button */}
          <button className="px-4 py-1.5 bg-[#2e3447] border border-[#adc6ff]/30 text-[#adc6ff] font-[family-name:var(--font-data)] text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#adc6ff]/5 transition-all">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Annotate with AI
          </button>
        </div>
      </div>

      {/* VIEWPORT */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden bg-black group select-none"
        style={{ cursor: zoom > 1 ? "grab" : "crosshair" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transition: isPanningRef.current ? "none" : "transform 0.1s ease",
          }}
          className="relative"
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[85vh]"
          />

          {imageLoaded && showFindings && (
            <AnnotationOverlay
              findings={allFindings}
              selectedIndex={selectedFinding}
              onSelect={setSelectedFinding}
            />
          )}
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[#adc6ff]"></span>
          </div>
        )}

        {/* HUD Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 font-[family-name:var(--font-data)] text-[0.65rem] text-[#adc6ff]/60 tracking-widest uppercase pointer-events-none">
          <div>Slice: <span className="text-white">{currentSlice + 1} / {slices.length}</span></div>
          <div>Zoom: <span className="text-white">{zoom.toFixed(1)}x</span></div>
          <div>Window: <span className="text-white">L: {Math.round(brightness * 4.5)} W: {Math.round(contrast * 12)}</span></div>
        </div>

        <div className="absolute bottom-4 right-4 text-[#adc6ff]/40 font-[family-name:var(--font-data)] text-[0.55rem] uppercase pointer-events-none text-right">
          FOR DIAGNOSTIC USE ONLY<br />NOT FOR PUBLIC RELEASE
        </div>
      </div>

      {/* SLICE & CONTROLS BAR — always visible */}
      <div className="h-16 border-t border-[#424754]/10 bg-[#191f31] px-6 flex items-center gap-10">
        {slices.length > 1 && (
          <div className="flex-1 flex items-center gap-4">
            <span className="font-[family-name:var(--font-data)] text-[0.65rem] uppercase tracking-wider text-slate-500 w-12 text-right">Slice</span>
            <div className="flex-1 h-1.5 bg-[#424754]/20 relative group cursor-pointer"
              onMouseDown={(e) => startDrag(e, (v) => setCurrentSlice(v), slices.length - 1)}
            >
              <div className="absolute h-full bg-[#4d8eff]" style={{ width: `${slicePercent}%` }} />
              <div
                className="absolute w-3 h-3 bg-[#adc6ff] border-2 border-[#191f31] top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                style={{ left: `${slicePercent}%` }}
              />
            </div>
            <span className="font-[family-name:var(--font-data)] text-[0.7rem] text-white w-12">{currentSlice + 1}/{slices.length}</span>
          </div>
        )}

        <div className={`flex items-center gap-8 ${slices.length > 1 ? "border-l border-[#424754]/10 pl-10" : "flex-1 justify-center"}`}>
          {/* Brightness */}
          <div className="flex flex-col gap-1 w-24">
            <div className="flex justify-between text-[0.55rem] font-[family-name:var(--font-data)] text-slate-500 uppercase">
              <span>BRT</span>
              <span className="text-[#adc6ff]">{brightness}%</span>
            </div>
            <div className="h-1.5 bg-[#424754]/20 relative cursor-pointer"
              onMouseDown={(e) => startDrag(e, setBrightness, 200)}
            >
              <div className="absolute h-full bg-[#adc6ff]/60" style={{ width: `${brightness / 2}%` }} />
            </div>
          </div>

          {/* Contrast */}
          <div className="flex flex-col gap-1 w-24">
            <div className="flex justify-between text-[0.55rem] font-[family-name:var(--font-data)] text-slate-500 uppercase">
              <span>CTR</span>
              <span className="text-[#adc6ff]">{contrast}%</span>
            </div>
            <div className="h-1.5 bg-[#424754]/20 relative cursor-pointer"
              onMouseDown={(e) => startDrag(e, setContrast, 200)}
            >
              <div className="absolute h-full bg-[#adc6ff]/60" style={{ width: `${contrast / 2}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
