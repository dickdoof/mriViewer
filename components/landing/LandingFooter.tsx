import Link from "next/link";

interface LandingFooterProps {
  lang?: "en" | "de";
}

export default function LandingFooter({ lang = "en" }: LandingFooterProps) {
  const isDE = lang === "de";

  return (
    <footer className="bg-[var(--color-surface-container-lowest)] w-full py-12 px-8 border-t border-[var(--color-outline-variant)]/15">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
        <div>
          <Link
            href="/"
            className="text-lg font-bold text-[var(--color-primary)] mb-4 font-[family-name:var(--font-display)] uppercase tracking-tighter block"
          >
            Lumen Radiology
          </Link>
          <p className="text-slate-500 font-[family-name:var(--font-data)] text-[0.6875rem] max-w-sm mb-6 uppercase tracking-wider leading-relaxed">
            {isDE
              ? `© ${new Date().getFullYear()} Lumen Radiology Interface. Nur für professionelle Informationszwecke. Alle Rechte vorbehalten.`
              : `© ${new Date().getFullYear()} Lumen Radiology Interface. For professional informational purposes only. All rights reserved.`}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Link
              href="/privacy-policy"
              className="block font-[family-name:var(--font-data)] text-[0.6875rem] uppercase tracking-wider text-slate-500 hover:text-[var(--color-primary)] transition-colors"
            >
              {isDE ? "Datenschutz" : "Privacy Policy"}
            </Link>
            <Link
              href="/tos"
              className="block font-[family-name:var(--font-data)] text-[0.6875rem] uppercase tracking-wider text-slate-500 hover:text-[var(--color-primary)] transition-colors"
            >
              {isDE ? "Impressum" : "Terms of Service"}
            </Link>
          </div>
          <div className="space-y-3">
            <Link
              href="/contact"
              className="block font-[family-name:var(--font-data)] text-[0.6875rem] uppercase tracking-wider text-slate-500 hover:text-[var(--color-primary)] transition-colors"
            >
              {isDE ? "Support kontaktieren" : "Contact Support"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
