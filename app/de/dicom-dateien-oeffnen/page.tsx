import { Metadata } from "next";
import { getSEOTags } from "@/libs/seo";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingSection from "@/components/landing/LandingSection";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import StepCard from "@/components/landing/StepCard";
import FeatureCard from "@/components/landing/FeatureCard";
import CheckList from "@/components/landing/CheckList";
import ModalityGrid from "@/components/landing/ModalityGrid";
import SchemaScript from "@/components/landing/SchemaScript";
import Link from "next/link";

const APP_NAME = "MRI Viewer";

export const metadata: Metadata = getSEOTags({
  title: `DICOM-Dateien öffnen — Kostenloser Online-Viewer für MRT, CT und Röntgen | ${APP_NAME}`,
  description:
    "Öffnen Sie DICOM-Dateien (.dcm) direkt im Browser. Kostenlos MRT-, CT- und Röntgenbilder ansehen. Keine Installation nötig. Mit KI-gestützter Bildanalyse.",
  canonicalUrlRelative: "/de/dicom-dateien-oeffnen",
  keywords: [
    "DICOM Dateien öffnen",
    ".dcm Datei öffnen",
    "DICOM Viewer online",
    "DICOM Viewer kostenlos",
    "medizinische Bilder ansehen",
    "DCM Datei Viewer",
  ],
  openGraph: {
    title: "DICOM-Dateien öffnen — Kostenloser Browser-Viewer",
    description:
      "Laden Sie .dcm-Dateien hoch und betrachten Sie Ihre medizinischen Bilder sofort. Unterstützt MRT, CT, Röntgen. Keine Installation nötig.",
    url: "https://mriviewer.app/de/dicom-dateien-oeffnen",
  },
  hreflangAlternates: {
    de: "https://mriviewer.app/de/dicom-dateien-oeffnen",
    en: "https://mriviewer.app/open-dicom-files",
  },
});

const navLinks = [
  { href: "#was-ist-dicom", label: "Was ist DICOM?" },
  { href: "#anleitung", label: "Anleitung" },
  { href: "#dateitypen", label: "Dateitypen" },
  { href: "#faq", label: "FAQ" },
];

const faqItems = [
  {
    question: "Was ist eine DICOM-Datei?",
    answer:
      "DICOM ist das internationale Standardformat für medizinische Bilder. Dateien haben typischerweise die Endung .dcm und enthalten sowohl Bilddaten als auch Metadaten zur Untersuchung.",
  },
  {
    question: "Wie öffne ich eine .dcm-Datei?",
    answer: `Ziehen Sie Ihre .dcm-Datei per Drag-and-Drop in ${APP_NAME} — sie wird direkt im Browser geöffnet. Kein Download oder Installation nötig.`,
  },
  {
    question: "Kann ich eine komplette MRT- oder CT-Serie ansehen?",
    answer:
      "Ja. Laden Sie ein ZIP-Archiv mit allen Schichten einer Serie hoch, und der Viewer ermöglicht Ihnen, durch den gesamten Stapel zu blättern.",
  },
  {
    question: "Ist es wirklich kostenlos?",
    answer:
      "Ja. Der Viewer und die Upload-Funktion sind vollständig kostenlos.",
  },
  {
    question: "Sind meine Daten sicher?",
    answer:
      "Ihre Dateien werden ausschließlich in Ihrem Browser verarbeitet. Es wird nichts auf einen Server hochgeladen.",
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
      "Kostenloser Online-DICOM-Viewer für MRT-, CT- und Röntgenbilder mit KI-gestützter Annotation.",
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

export default function DicomDateienOeffnenPage() {
  return (
    <div lang="de">
      <SchemaScript schema={schemas} />
      <LandingHeader
        links={navLinks}
        ctaText="Datei öffnen"
        ctaHref="/"
      />

      <main className="pt-24">
        <LandingHero
          label="Online DICOM Viewer & Analyse"
          title="DICOM-Dateien öffnen —"
          titleHighlight="Kostenlos und direkt im Browser."
          description={`Sie haben von Ihrem Arzt oder Krankenhaus eine CD oder einen Download mit medizinischen Bildern erhalten — und können die Dateien nicht öffnen? DICOM-Dateien (.dcm) sind das Standardformat für Röntgenbilder, CT-Scans und MRT-Aufnahmen. Mit ${APP_NAME} öffnen und betrachten Sie Ihre DICOM-Dateien direkt im Browser — kostenlos und ohne Installation.`}
          primaryCta={{ text: "Scan jetzt hochladen", href: "/", icon: "upload_file" }}
          secondaryCta={{ text: "Mehr erfahren", href: "#was-ist-dicom" }}
        />

        {/* Was ist eine DICOM-Datei? */}
        <LandingSection bg="surface-container-low" id="was-ist-dicom" border>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Was ist eine DICOM-Datei?
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed space-y-6">
            <p>
              DICOM steht für &bdquo;Digital Imaging and Communications in
              Medicine&ldquo; und ist der weltweit gültige Standard für
              medizinische Bilddaten. Wenn Sie nach einer Untersuchung eine CD
              oder einen digitalen Download erhalten, sind die Dateien fast immer
              im DICOM-Format mit der Endung .dcm.
            </p>
            <p>
              Anders als ein gewöhnliches JPEG oder PNG enthält eine DICOM-Datei
              weit mehr als nur das Bild. Sie speichert die vollständigen
              Pixeldaten Ihres Scans zusammen mit Metadaten: Patientenname,
              Untersuchungsdatum, Art der Untersuchung (Modalität),
              Körperregion, Serienbeschreibungen und technische Parameter. Genau
              deshalb brauchen Sie einen spezialisierten Viewer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <FeatureCard
                icon="info"
                title="Patienteninformationen"
                description="Enthält Name, Geburtsdatum, Geschlecht und Untersuchungszeitpunkt zur eindeutigen Zuordnung."
              />
              <FeatureCard
                icon="settings"
                title="Technische Parameter"
                description="Speichert Schichtdicke, Belichtungswerte, Orientierung im Raum und verwendete Kontrastmittel."
              />
            </div>
          </div>
        </LandingSection>

        {/* So funktioniert der DICOM-Viewer */}
        <LandingSection bg="surface" id="anleitung">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              So funktioniert der DICOM-Viewer
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <StepCard
              number={1}
              icon="cloud_upload"
              title="Hochladen"
              description="Ziehen Sie eine einzelne .dcm-Datei, mehrere Dateien oder ein ZIP-Archiv mit einer kompletten Serie per Drag-and-Drop in den Upload-Bereich."
            />
            <StepCard
              number={2}
              icon="browse_gallery"
              title="Durchsuchen"
              description="Der Viewer liest automatisch die DICOM-Metadaten aus und sortiert Ihre Bilder nach Körperregion: Kopf, Wirbelsäule, Thorax, Abdomen und mehr."
            />
            <StepCard
              number={3}
              icon="biotech"
              title="Untersuchen"
              description="Blättern Sie durch die Schichten, passen Sie Helligkeit und Kontrast an, zoomen Sie in Bereiche hinein und wechseln Sie zwischen Einzel- und geteilter Ansicht."
            />
          </div>
        </LandingSection>

        {/* Unterstützte Dateitypen */}
        <LandingSection bg="surface-container-lowest" id="dateitypen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <div className="bg-[var(--color-surface-container)] p-8 rounded-xl ghost-border">
                <h3 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
                  Abgedeckte Modalitäten
                </h3>
                <ModalityGrid
                  items={[
                    { icon: "radiology", label: "MRT / MRI" },
                    { icon: "view_in_ar", label: "CT / CAT Scan" },
                    { icon: "orthopedics", label: "Röntgen / X-Ray" },
                    { icon: "neurology", label: "Ultraschall" },
                  ]}
                />
                <p className="mt-8 text-sm text-[var(--color-on-surface-variant)] italic">
                  Wir unterstützen alle gängigen Körperregionen: Kopf,
                  Wirbelsäule, Thorax, Abdomen, Becken und Extremitäten —
                  automatisch aus den DICOM-Metadaten erkannt.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-8">
                Unterstützte Dateitypen und Modalitäten
              </h2>
              <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed mb-6">
                Unser Viewer ist auf maximale Kompatibilität ausgelegt und
                verarbeitet alle gängigen Formate des DICOM-Standards.
              </p>
              <CheckList
                items={[
                  "Einzelne .dcm und .dicom Dateien",
                  "Vollständige DICOMDIR Verzeichnisse",
                  "Komprimierte ZIP-Archive von CDs",
                ]}
              />
            </div>
          </div>
        </LandingSection>

        {/* KI-gestützte Bildanalyse */}
        <LandingSection bg="surface">
          <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-12 ghost-border">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              KI-gestützte Bildanalyse
            </h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
              Über das einfache Betrachten hinaus bietet {APP_NAME} eine
              KI-Annotationsfunktion. Klicken Sie auf &bdquo;Mit KI
              annotieren&ldquo; bei jeder Schicht, und das System analysiert das
              Bild, hebt relevante Bereiche hervor und liefert erste
              Beobachtungen. Die Ergebnisse sind farblich nach Schweregrad
              kodiert und werden zusammen mit ihren Beschreibungen angezeigt.
            </p>
            <div className="p-6 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg">
              <h4 className="text-[var(--color-error)] font-bold flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined">warning</span>
                Medizinischer Haftungsausschluss
              </h4>
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                Diese KI-Analyse ist kein diagnostisches Werkzeug und ersetzt
                keine ärztliche Befundung. Sie soll Ihnen helfen zu verstehen,
                was Sie sehen, und bessere Fragen für Ihren Arzt vorzubereiten.
              </p>
            </div>
          </div>
        </LandingSection>

        {/* Datenschutz und Sicherheit */}
        <LandingSection bg="surface-container-lowest">
          <div className="text-center">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] mb-8">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Datenschutz und Sicherheit
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              Ihre medizinischen Bilder bleiben privat. {APP_NAME} verarbeitet
              alle Dateien direkt in Ihrem Browser mittels clientseitiger
              Rendering-Technologie. Ihre DICOM-Dateien werden niemals auf unsere
              Server hochgeladen oder dort gespeichert. Wenn Sie den Tab
              schließen, sind Ihre Daten verschwunden.
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
              <Link href="/de/mrt-bilder-verstehen" className="text-[var(--color-primary)] hover:underline text-sm">
                MRT-Bilder verstehen
              </Link>
              <Link href="/mri-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                MRI Viewer (EN)
              </Link>
            </div>
          </div>
        </LandingSection>

        <LandingCTA
          title="Bereit, Ihre DICOM-Dateien zu öffnen?"
          description="Jetzt hochladen — in Sekunden."
          buttonText="Meinen Scan öffnen"
          buttonHref="/"
        />
      </main>

      <LandingFooter lang="de" />
    </div>
  );
}
