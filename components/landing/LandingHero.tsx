import Link from "next/link";

interface CTAButton {
  text: string;
  href: string;
  icon?: string;
  variant?: "primary" | "outline";
}

interface LandingHeroProps {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCta: CTAButton;
  secondaryCta?: CTAButton;
}

export default function LandingHero({
  label,
  title,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
}: LandingHeroProps) {
  return (
    <section className="relative px-8 py-20 lg:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(77, 142, 255, 0.08) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(173, 198, 255, 0.04) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto z-10 relative">
        <span className="font-[family-name:var(--font-data)] text-[var(--color-primary)] tracking-[0.2em] text-[0.6875rem] uppercase mb-4 block">
          {label}
        </span>
        <h1 className="text-4xl lg:text-6xl font-[family-name:var(--font-display)] font-bold tracking-tight text-white mb-6 leading-[1.1]">
          {title}{" "}
          <span className="gradient-text-primary">{titleHighlight}</span>
        </h1>
        <p className="text-[var(--color-on-surface-variant)] text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={primaryCta.href}
            className="medical-gradient text-[var(--color-on-primary-container)] px-8 py-4 rounded font-[family-name:var(--font-data)] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 group transition-all hover:brightness-110"
          >
            {primaryCta.text}
            {primaryCta.icon && (
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                {primaryCta.icon}
              </span>
            )}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="border border-[var(--color-outline-variant)]/30 text-white px-8 py-4 rounded font-[family-name:var(--font-data)] font-bold text-sm tracking-wider uppercase hover:bg-[var(--color-surface-container-high)] transition-colors text-center"
            >
              {secondaryCta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
