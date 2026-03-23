import type { Finding } from "@/libs/annotate";

interface FindingsPanelProps {
  findings: (Finding & { sliceIndex?: number })[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  locked?: boolean;
}

const severityConfig: Record<
  string,
  { emoji: string; label: string; borderColor: string; badgeBg: string; badgeText: string }
> = {
  severe: {
    emoji: "\uD83D\uDD34",
    label: "SEVERE",
    borderColor: "#ff5451",
    badgeBg: "#93000a",
    badgeText: "#ffffff",
  },
  moderate: {
    emoji: "\uD83D\uDFE0",
    label: "MODERATE",
    borderColor: "#ff9100",
    badgeBg: "rgba(255,145,0,0.2)",
    badgeText: "#ff9100",
  },
  mild: {
    emoji: "\uD83D\uDFE1",
    label: "MILD",
    borderColor: "#ffd700",
    badgeBg: "rgba(255,215,0,0.15)",
    badgeText: "#ffd700",
  },
  normal: {
    emoji: "\uD83D\uDFE2",
    label: "NORMAL",
    borderColor: "#69db7c",
    badgeBg: "rgba(105,219,124,0.15)",
    badgeText: "#69db7c",
  },
};

export default function FindingsPanel({
  findings,
  selectedIndex,
  onSelect,
  locked = false,
}: FindingsPanelProps) {
  if (findings.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-bold text-slate-400">No findings</p>
        <p className="font-[family-name:var(--font-data)] text-[0.65rem] text-slate-500 mt-1">
          No abnormalities were detected in this study.
        </p>
      </div>
    );
  }

  return (
    <section>
      {/* Section Header */}
      <div className="font-['Space_Grotesk'] uppercase tracking-widest text-[0.65rem] text-slate-500 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">medical_services</span>
          Clinical Findings
        </div>
        <span className="text-[0.6rem] bg-[#2e3447] px-1.5 py-0.5 border border-[#424754]/20">
          {findings.length} TOTAL
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {findings.map((finding, i) => {
          const config = severityConfig[finding.severity] || severityConfig.normal;
          const isSelected = selectedIndex === i;

          // Extract location from label (e.g., "L4-L5")
          const locationMatch = finding.label.match(/[A-Z]\d+[\s-]*[A-Z]?\d*/i);
          const location = locationMatch ? locationMatch[0].toUpperCase() : "";

          return (
            <div
              key={i}
              className={`bg-[#0c1324] p-3 border-l-2 transition-all ${
                isSelected ? "shadow-lg shadow-black/20" : ""
              } ${!locked ? "cursor-pointer hover:bg-[#0c1324]/80" : ""}`}
              style={{ borderLeftColor: config.borderColor }}
              onClick={() => !locked && onSelect?.(i)}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className="text-[0.55rem] font-bold px-1.5 py-0.5 tracking-tighter"
                  style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                >
                  {config.emoji} {config.label}
                </span>
                <div className="flex items-center gap-2">
                  {finding.sliceIndex !== undefined && (
                    <span className="font-[family-name:var(--font-data)] text-[0.55rem] text-[#adc6ff]/60 uppercase">
                      S{finding.sliceIndex + 1}
                    </span>
                  )}
                  {location && (
                    <span className="font-[family-name:var(--font-data)] text-[0.6rem] text-slate-500 uppercase">
                      {location}
                    </span>
                  )}
                </div>
              </div>

              {locked ? (
                <>
                  <div className="text-xs font-semibold text-white/50 mb-1 flex items-center gap-1">
                    <span className="tracking-tight">{"\u2588".repeat(15)}</span>
                    <span className="material-symbols-outlined text-[10px]">lock</span>
                  </div>
                  <p className="text-[0.65rem] text-[#adc6ff] leading-relaxed font-medium">
                    Unlock to read full description
                  </p>
                </>
              ) : (
                <>
                  <div className="text-xs font-semibold text-white mb-1">
                    {finding.label}
                  </div>
                  <p className="text-[0.65rem] text-slate-400 leading-relaxed">
                    {finding.description}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
