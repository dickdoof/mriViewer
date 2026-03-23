import Link from "next/link";

interface LandingCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function LandingCTA({
  title,
  description,
  buttonText,
  buttonHref,
}: LandingCTAProps) {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      <div className="absolute inset-0 medical-gradient opacity-10" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-[family-name:var(--font-display)] font-bold text-white mb-8">
          {title}
        </h2>
        <p className="text-[var(--color-on-surface-variant)] text-lg mb-12 max-w-2xl mx-auto">
          {description}
        </p>
        <Link
          href={buttonHref}
          className="medical-gradient text-[var(--color-on-primary-container)] px-12 py-5 rounded font-[family-name:var(--font-data)] font-bold text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--color-primary)]/20 inline-block"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
