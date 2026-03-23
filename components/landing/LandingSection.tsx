import { ReactNode } from "react";

type BgVariant = "surface" | "surface-container-low" | "surface-container-lowest";

const bgMap: Record<BgVariant, string> = {
  surface: "bg-[var(--color-surface)]",
  "surface-container-low": "bg-[var(--color-surface-container-low)]",
  "surface-container-lowest": "bg-[var(--color-surface-container-lowest)]",
};

interface LandingSectionProps {
  bg?: BgVariant;
  id?: string;
  children: ReactNode;
  className?: string;
  border?: boolean;
}

export default function LandingSection({
  bg = "surface",
  id,
  children,
  className = "",
  border = false,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={`py-24 ${bgMap[bg]} ${
        border ? "border-y border-[var(--color-outline-variant)]/10" : ""
      } ${className}`}
    >
      <div className="max-w-4xl mx-auto px-8">{children}</div>
    </section>
  );
}
