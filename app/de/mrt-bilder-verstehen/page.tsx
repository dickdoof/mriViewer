import { Metadata } from "next";
import { getSEOTags } from "@/libs/seo";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingSection from "@/components/landing/LandingSection";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import FeatureCard from "@/components/landing/FeatureCard";
import SchemaScript from "@/components/landing/SchemaScript";
import Link from "next/link";

const APP_NAME = "MRI Viewer";

export const metadata: Metadata = getSEOTags({
  title: `MRT-Bilder selbst ansehen und verstehen — Mit KI-Unterstützung | ${APP_NAME}`,
  description:
    "Schauen Sie sich Ihre MRT-Bilder selbst an und verstehen Sie Ihren Befund. Laden Sie Ihre DICOM-Dateien hoch, blättern Sie durch jede Schicht und nutzen Sie KI-gestützte Annotationen.",
  canonicalUrlRelative: "/de/mrt-bilder-verstehen",
  keywords: [
    "MRT Bilder ansehen",
    "MRT Befund verstehen",
    "MRT selber anschauen",
    "MRT Aufnahmen ansehen",
    "Diagnose verstehen MRT",
    "MRT Zweitmeinung",
    "Radiologie Befund verstehen",
  ],
  openGraph: {
    title: "MRT-Bilder verstehen — Befund selbst überprüfen mit KI",
    description:
      "Laden Sie Ihre MRT-Aufnahmen hoch und erkunden Sie sie mit professionellen Viewer-Tools und KI-Analyse. Kostenlos und privat im Browser.",
    url: "https://mriviewer.app/de/mrt-bilder-verstehen",
  },
  hreflangAlternates: {
    de: "https://mriviewer.app/de/mrt-bilder-verstehen",
    en: "https://mriviewer.app/understand-your-scan",
  },
});

const navLinks = [
  { href: "#warum", label: "Warum?" },
  { href: "#so-hilft-es", label: "So hilft es" },
  { href: "#ki", label: "KI-Möglichkeiten" },
  { href: "#faq", label: "FAQ" },
];

const faqItems = [
  {
    question: "Kann ich meine MRT-Bilder zu Hause selbst ansehen?",
    answer: `Ja. Wenn Sie Ihre DICOM-Dateien haben, können Sie diese in ${APP_NAME} hochladen und jede Schicht mit professionellen Viewer-Tools ansehen — direkt im Browser, kostenlos.`,
  },
  {
    question: "Kann KI mir helfen, mein MRT zu verstehen?",
    answer: `${APP_NAME} enthält eine KI-Annotationsfunktion, die auffällige Bereiche identifiziert und Beobachtungen zu einzelnen Schichten liefert. Das kann helfen, gezieltere Fragen an Ihren Arzt zu stellen — ersetzt aber keine ärztliche Befundung.`,
  },
  {
    question: "Ist das eine medizinische Zweitmeinung?",
    answer: `Nein. ${APP_NAME} ist ein Betrachtungs- und Explorationswerkzeug, kein diagnostischer Dienst. KI-Annotationen sind Beobachtungen, die Ihnen beim Verständnis der Bilder helfen — keine medizinischen Diagnosen. Konsultieren Sie immer einen qualifizierten Arzt für medizinische Entscheidungen.`,
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Kostenloser Online-MRT-Viewer mit KI-gestützten Annotationen zum Verstehen Ihrer Bildgebungsergebnisse.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export default function MRTBilderVerstehenPage() {
  return (
    <div lang="de">
      <SchemaScript schema={schemas} />
      <LandingHeader
        links={navLinks}
        ctaText="MRT hochladen"
        ctaHref="/"
      />

      <main className="pt-24">
        <LandingHero
          label="Ihre Diagnose verstehen"
          title="Ihre MRT-Bilder selbst ansehen"
          titleHighlight="und verstehen."
          description={`Sie haben gerade MRT-Ergebnisse erhalten. Vielleicht hat Ihr Arzt die Befunde nur kurz erklärt, oder der Radiologie-Bericht steckt voller Fachbegriffe. Damit sind Sie nicht allein — Millionen von Patienten möchten jedes Jahr ihre eigenen Aufnahmen betrachten und wirklich verstehen, was sie zeigen. Mit ${APP_NAME} nehmen Sie das Steuer selbst in die Hand.`}
          primaryCta={{ text: "MRT-Bilder hochladen", href: "/", icon: "upload_file" }}
          secondaryCta={{ text: "Mehr erfahren", href: "#warum" }}
        />

        {/* Warum Patienten ihre eigenen MRT-Bilder sehen wollen */}
        <LandingSection bg="surface-container-low" id="warum" border>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Warum Patienten ihre eigenen MRT-Bilder sehen wollen
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
            Medizinische Bildgebung sind Ihre Daten. Immer mehr Patienten
            erkennen den Wert, sich aktiv an ihrer Gesundheitsversorgung zu
            beteiligen. Der Blick auf die eigenen Aufnahmen kann Ihnen helfen:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="visibility"
              title="Den Befund greifbar machen"
              description='Wenn Ihr Arzt von einem „Bandscheibenvorfall bei L4-L5" spricht, bleibt das oft abstrakt. Das tatsächliche Bild zu sehen — und per KI auf den relevanten Bereich hingewiesen zu werden — macht es konkret.'
            />
            <FeatureCard
              icon="help"
              title="Bessere Fragen stellen"
              description="Wer mit einem Grundverständnis des eigenen Scans in den Nachsorgetermin geht, kann gezielte, informierte Fragen stellen."
            />
            <FeatureCard
              icon="compare"
              title="Eine Zweitmeinung einordnen"
              description="Wenn Sie über eine zweite professionelle Befundung nachdenken, hilft es enorm, die Bilder vorher selbst gesehen zu haben."
            />
            <FeatureCard
              icon="timeline"
              title="Veränderungen über die Zeit verfolgen"
              description="Bei mehreren Untersuchungen können Sie Bilder im Split-View nebeneinander vergleichen und Fortschritte oder Veränderungen selbst erkennen."
            />
          </div>
        </LandingSection>

        {/* So hilft die App */}
        <LandingSection bg="surface" id="so-hilft-es">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              So hilft {APP_NAME} beim Verständnis Ihrer Bilder
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="desktop_windows"
              title="Professioneller Viewer"
              description="Dieselbe Rendering-Technologie, die in radiologischen Arbeitsstationen zum Einsatz kommt — direkt in Ihrem Browser."
            />
            <FeatureCard
              icon="folder_special"
              title="Automatisch nach Körperregion sortiert"
              description="Ihre Bilder werden automatisch nach Körperregion geordnet — Kopf, Wirbelsäule, Thorax, Abdomen und mehr."
            />
            <FeatureCard
              icon="smart_toy"
              title="KI-gestützte Annotationen"
              description='Klicken Sie bei jeder Schicht auf „Mit KI annotieren". Die KI analysiert das Bild und hebt Befunde mit farbcodierten Markierungen hervor.'
            />
            <FeatureCard
              icon="info"
              title="Studieninformationen auf einen Blick"
              description="Untersuchungsdatum, Modalität, Institution und überweisender Arzt — alles automatisch aus den DICOM-Metadaten ausgelesen."
            />
          </div>
        </LandingSection>

        {/* Was die KI kann und was nicht */}
        <LandingSection bg="surface-container-lowest" id="ki">
          <div className="bg-[var(--color-surface-container)] rounded-2xl p-12 ghost-border">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Was die KI kann und was nicht
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-severity-normal)]">
                    check_circle
                  </span>
                  Sie kann:
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-on-surface-variant)]">
                  <li>Strukturelle Merkmale erkennen</li>
                  <li>Auffällige Bereiche hervorheben</li>
                  <li>Schweregrade einordnen (normal, leicht, moderat, schwer)</li>
                  <li>Beobachtungen in verständlicher Sprache beschreiben</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-error)]">
                    cancel
                  </span>
                  Sie kann nicht:
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-on-surface-variant)]">
                  <li>Eine medizinische Diagnose stellen</li>
                  <li>Das geschulte Auge eines Radiologen ersetzen</li>
                  <li>Ihre vollständige Krankengeschichte berücksichtigen</li>
                  <li>Behandlungen empfehlen</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] italic">
              Besprechen Sie alle Befunde oder Bedenken immer mit Ihrem
              behandelnden Arzt.
            </p>
          </div>
        </LandingSection>

        {/* Funktioniert mit allen gängigen MRT-Untersuchungen */}
        <LandingSection bg="surface">
          <div className="text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Funktioniert mit allen gängigen MRT-Untersuchungen
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              Egal ob Kopf-MRT, Knie-MRT, Wirbelsäulen-MRT oder Abdomen-MRT —
              wenn Sie die DICOM-Dateien haben, kann {APP_NAME} sie anzeigen.
              Laden Sie einzelne Dateien oder komplette Serien hoch und beginnen
              Sie sofort mit der Erkundung.
            </p>
          </div>
        </LandingSection>

        {/* Datenschutz */}
        <LandingSection bg="surface-container-lowest">
          <div className="text-center">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] mb-8">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Datenschutz hat Priorität
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              Medizinische Bilder gehören zu den sensibelsten persönlichen Daten.
              {APP_NAME} verarbeitet alles lokal in Ihrem Browser. Keine
              Serverübertragung, keine Cloud-Speicherung, keine Registrierung.
              Ihre Bilder bleiben auf Ihrem Gerät.
            </p>
          </div>
        </LandingSection>

        {/* FAQ */}
        <LandingSection bg="surface-container-low" id="faq">
          <LandingFAQ
            items={faqItems}
            title="Häufig gestellte Fragen"
          />
        </LandingSection>

        {/* Internal Links */}
        <LandingSection bg="surface">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Mehr entdecken
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/de/dicom-dateien-oeffnen" className="text-[var(--color-primary)] hover:underline text-sm">
                DICOM-Dateien öffnen
              </Link>
              <Link href="/understand-your-scan" className="text-[var(--color-primary)] hover:underline text-sm">
                Understand Your Scan (EN)
              </Link>
              <Link href="/mri-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                MRI Viewer (EN)
              </Link>
            </div>
          </div>
        </LandingSection>

        <LandingCTA
          title="Laden Sie jetzt Ihre MRT-Bilder hoch"
          description="und verstehen Sie Ihren Befund."
          buttonText="MRT-Bilder hochladen"
          buttonHref="/"
        />
      </main>

      <LandingFooter lang="de" />
    </div>
  );
}
