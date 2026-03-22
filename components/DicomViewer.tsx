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
  const [selectedFinding, setSelectedFinding] = useState<number | undefined>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentUrl = slices[currentSlice]?.url;

  // Load and render the current DICOM slice image
  useEffect(() => {
    if (!currentUrl) return;
    setImageLoaded(false);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0);
      setImageLoaded(true);
    };
    img.src = currentUrl;
  }, [currentUrl, brightness, contrast]);

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

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.5, Math.min(4, z + (e.deltaY > 0 ? -0.1 : 0.1))));
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-3 bg-base-200 rounded-t-xl border-b border-base-content/10">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-base-content/60">Brightness</label>
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="range range-xs range-primary w-24"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-base-content/60">Contrast</label>
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="range range-xs range-primary w-24"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-base-content/60">Zoom</label>
          <span className="font-mono">{(zoom * 100).toFixed(0)}%</span>
        </div>
        <div className="ml-auto text-sm text-base-content/60">
          Slice {currentSlice + 1} / {slices.length}
        </div>
      </div>

      {/* Viewer */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-black flex items-center justify-center"
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.1s ease",
          }}
          className="relative"
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[70vh]"
          />

          {imageLoaded && (
            <AnnotationOverlay
              findings={allFindings}
              selectedIndex={selectedFinding}
              onSelect={setSelectedFinding}
            />
          )}
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
      </div>

      {/* Slice slider */}
      {slices.length > 1 && (
        <div className="p-3 bg-base-200 rounded-b-xl border-t border-base-content/10">
          <input
            type="range"
            min="0"
            max={slices.length - 1}
            value={currentSlice}
            onChange={(e) => setCurrentSlice(Number(e.target.value))}
            className="range range-primary w-full"
          />
        </div>
      )}
    </div>
  );
}
