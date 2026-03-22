import type { Finding } from "@/libs/annotate";

interface FindingsPanelProps {
  findings: Finding[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

const severityBadge: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  severe: { color: "text-red-700", bg: "bg-red-100", label: "Severe" },
  moderate: {
    color: "text-orange-700",
    bg: "bg-orange-100",
    label: "Moderate",
  },
  mild: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Mild" },
  normal: { color: "text-green-700", bg: "bg-green-100", label: "Normal" },
};

export default function FindingsPanel({
  findings,
  selectedIndex,
  onSelect,
}: FindingsPanelProps) {
  if (findings.length === 0) {
    return (
      <div className="p-4 text-center text-base-content/60">
        <p className="text-lg font-semibold">No findings</p>
        <p className="text-sm">No abnormalities were detected in this study.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg px-1">
        Findings ({findings.length})
      </h3>
      {findings.map((finding, i) => {
        const badge = severityBadge[finding.severity] || severityBadge.normal;
        const isSelected = selectedIndex === i;

        return (
          <div
            key={i}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-base-content/10 hover:border-base-content/20"
            }`}
            onClick={() => onSelect?.(i)}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm">{finding.label}</h4>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-base-content/70 mt-1">
              {finding.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
