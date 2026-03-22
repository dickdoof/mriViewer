import type { Finding } from "@/libs/annotate";

interface AnnotationOverlayProps {
  findings: Finding[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

const severityColors: Record<string, string> = {
  severe: "rgba(239, 68, 68, 0.6)",
  moderate: "rgba(249, 115, 22, 0.6)",
  mild: "rgba(234, 179, 8, 0.6)",
  normal: "rgba(34, 197, 94, 0.6)",
};

const severityBorderColors: Record<string, string> = {
  severe: "rgb(239, 68, 68)",
  moderate: "rgb(249, 115, 22)",
  mild: "rgb(234, 179, 8)",
  normal: "rgb(34, 197, 94)",
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
        const borderColor = severityBorderColors[finding.severity] || severityBorderColors.normal;
        const bgColor = severityColors[finding.severity] || severityColors.normal;

        return (
          <div
            key={i}
            className={`absolute pointer-events-auto cursor-pointer transition-all ${
              isSelected ? "ring-2 ring-white" : ""
            }`}
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              width: `${w * 100}%`,
              height: `${h * 100}%`,
              border: `2px solid ${borderColor}`,
              backgroundColor: isSelected
                ? bgColor.replace("0.6", "0.3")
                : bgColor.replace("0.6", "0.1"),
              borderRadius: "4px",
            }}
            onClick={() => onSelect?.(i)}
          >
            {/* Label */}
            <span
              className="absolute -top-6 left-0 text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap"
              style={{
                backgroundColor: borderColor,
                color: "white",
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
