import type { Finding } from "@/libs/annotate";

interface FindingsPanelProps {
  findings: Finding[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

const severityConfig: Record<
  string,
  { badge: string; glow: string; label: string }
> = {
  severe: {
    badge: "severity-severe",
    glow: "anomaly-glow-severe",
    label: "Severe",
  },
  moderate: {
    badge: "severity-moderate",
    glow: "anomaly-glow-moderate",
    label: "Moderate",
  },
  mild: {
    badge: "severity-mild",
    glow: "anomaly-glow-mild",
    label: "Mild",
  },
  normal: {
    badge: "severity-normal",
    glow: "anomaly-glow-normal",
    label: "Normal",
  },
};

export default function FindingsPanel({
  findings,
  selectedIndex,
  onSelect,
}: FindingsPanelProps) {
  if (findings.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="title-sm text-lg font-bold text-[var(--color-rm-on-surface-dim)]">No findings</p>
        <p className="label-sm mt-1">No abnormalities were detected in this study.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h3 className="label-md px-1 mb-3">
        Findings <span className="value-readout">({findings.length})</span>
      </h3>
      {findings.map((finding, i) => {
        const config = severityConfig[finding.severity] || severityConfig.normal;
        const isSelected = selectedIndex === i;

        return (
          <div
            key={i}
            className={`
              p-3 rounded-sm cursor-pointer transition-all
              ${isSelected
                ? `bg-[var(--color-surface-high)] ${config.glow}`
                : "bg-[var(--color-surface-low)] hover:bg-[var(--color-surface-high)]"
              }
            `}
            onClick={() => onSelect?.(i)}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="title-sm text-sm font-bold">{finding.label}</h4>
              <span className={`severity-badge ${config.badge}`}>
                {config.label}
              </span>
            </div>
            <p className="text-xs text-[var(--color-rm-on-surface-dim)] mt-1.5" style={{ lineHeight: 1.5 }}>
              {finding.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
