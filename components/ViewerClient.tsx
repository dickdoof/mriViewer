"use client";

import { useState, useCallback } from "react";
import DicomViewer from "./DicomViewer";
import FindingsPanel from "./FindingsPanel";
import StudyInfoPanel from "./StudyInfoPanel";
import type { Finding } from "@/libs/annotate";

interface DicomSlice {
  url: string;
  fileName: string;
  findings?: Finding[];
}

interface StudyInfo {
  patientName?: string;
  studyDate?: string;
  modality?: string;
  description?: string;
  institution?: string;
  accession?: string;
  seriesCount?: number;
  sliceCount?: number;
}

interface ViewerClientProps {
  slices: DicomSlice[];
  allFindings: (Finding & { sliceIndex: number })[];
  studyInfo: StudyInfo;
}

export default function ViewerClient({
  slices,
  allFindings,
  studyInfo,
}: ViewerClientProps) {
  const [navigateToSlice, setNavigateToSlice] = useState<number | undefined>();

  const handleFindingClick = useCallback(
    (index: number) => {
      const finding = allFindings[index];
      if (finding && finding.sliceIndex !== undefined) {
        setNavigateToSlice(finding.sliceIndex);
        // Reset after DicomViewer picks it up
        requestAnimationFrame(() => setNavigateToSlice(undefined));
      }
    },
    [allFindings]
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* MAIN VIEWPORT */}
      <div className="flex-1 min-w-0">
        <DicomViewer
          slices={slices}
          allFindings={allFindings}
          navigateToSlice={navigateToSlice}
        />
      </div>

      {/* RIGHT PANEL — Report & Info */}
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
          <StudyInfoPanel study={studyInfo} />

          <div className="h-px bg-[#424754]/10" />

          <FindingsPanel
            findings={allFindings}
            onSelect={handleFindingClick}
          />

          {/* AI Comparison section */}
          {allFindings.length > 0 && (
            <div className="p-4 bg-[#adc6ff]/5 border border-[#adc6ff]/10">
              <div className="flex items-center gap-2 mb-2 text-[#adc6ff]">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest">AI Comparison</span>
              </div>
              <p className="text-[0.65rem] text-slate-300">
                Analysis complete. {allFindings.length} finding{allFindings.length !== 1 ? "s" : ""} identified across study.
              </p>
            </div>
          )}
        </div>

        {/* Bottom action */}
        <div className="p-4 border-t border-[#424754]/15 bg-[#151b2d]">
          <button className="w-full py-3 bg-transparent border border-[#8c909f] text-white font-[family-name:var(--font-data)] font-bold text-[0.7rem] uppercase tracking-widest hover:bg-white/5 transition-colors">
            Approve &amp; Sign Report
          </button>
        </div>
      </aside>
    </div>
  );
}
