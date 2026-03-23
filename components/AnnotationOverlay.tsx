import type { Finding } from "@/libs/annotate";

interface AnnotationOverlayProps {
  findings: Finding[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

/* Sharp, non-rounded pointers per design spec.
   Using design system severity tokens instead of generic Tailwind colors. */
const severityColors: Record<string, { border: string; bg: string; bgSelected: string; glow: string }> = {
  severe: {
    border: "var(--color-severity-severe)",
    bg: "rgba(255, 107, 107, 0.08)",
    bgSelected: "rgba(255, 107, 107, 0.2)",
    glow: "0 0 12px rgba(255, 107, 107, 0.3)",
  },
  moderate: {
    border: "var(--color-severity-moderate)",
    bg: "rgba(255, 179, 71, 0.08)",
    bgSelected: "rgba(255, 179, 71, 0.2)",
    glow: "0 0 12px rgba(255, 179, 71, 0.3)",
  },
  mild: {
    border: "var(--color-severity-mild)",
    bg: "rgba(255, 215, 0, 0.08)",
    bgSelected: "rgba(255, 215, 0, 0.2)",
    glow: "0 0 12px rgba(255, 215, 0, 0.3)",
  },
  normal: {
    border: "var(--color-severity-normal)",
    bg: "rgba(105, 219, 124, 0.08)",
    bgSelected: "rgba(105, 219, 124, 0.2)",
    glow: "0 0 12px rgba(105, 219, 124, 0.3)",
  },
};

export default function AnnotationOverlay({
  findings,
  selectedIndex,
  onSelect,
}: AnnotationOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {findings.map((finding, i) => {
        const [x, y, w, h] = finding.bbox;
        const isSelected = selectedIndex === i;
        const colors = severityColors[finding.severity] || severityColors.normal;

        return (
          <div
            key={i}
            className="absolute pointer-events-auto cursor-pointer transition-all"
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              width: `${w * 100}%`,
              height: `${h * 100}%`,
              border: `2px solid ${colors.border}`,
              backgroundColor: isSelected ? colors.bgSelected : colors.bg,
              /* Sharp, non-rounded pointer per spec — sm radius only */
              borderRadius: "0.125rem",
              /* Anomaly Glow — simulates LED on physical console */
              boxShadow: isSelected ? colors.glow : "none",
            }}
            onClick={() => onSelect?.(i)}
          >
            {/* Label tag — high-contrast on-tertiary-container text */}
            <span
              className="absolute -top-5 left-0 severity-badge whitespace-nowrap"
              style={{
                backgroundColor: colors.border,
                color: "var(--color-surface-lowest)",
              }}
            >
              {finding.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
