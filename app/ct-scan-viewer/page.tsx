import { Metadata } from "next";
import { getSEOTags } from "@/libs/seo";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingSection from "@/components/landing/LandingSection";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import FeatureCard from "@/components/landing/FeatureCard";
import CheckList from "@/components/landing/CheckList";
import SchemaScript from "@/components/landing/SchemaScript";
import Link from "next/link";

const APP_NAME = "MRI Viewer";

export const metadata: Metadata = getSEOTags({
  title: `Free Online CT Scan Viewer — Upload and View CT Images in Your Browser | ${APP_NAME}`,
  description:
    "View CT scan DICOM files online for free. Scroll through axial slices, adjust windowing for different tissues, and get AI annotations. No installation needed.",
  canonicalUrlRelative: "/ct-scan-viewer",
  keywords: [
    "CT scan viewer",
    "view CT scan online",
    "CT DICOM viewer",
    "free CT viewer",
    "computed tomography viewer",
  ],
  openGraph: {
    title: "Free CT Scan Viewer — Browse CT Images Online",
    description:
      "Upload your CT scan files and explore them in a professional browser-based viewer. Adjust windowing, scroll slices, run AI analysis.",
    url: "https://mriviewer.app/ct-scan-viewer",
  },
  hreflangAlternates: {
    en: "https://mriviewer.app/ct-scan-viewer",
    de: "https://mriviewer.app/de/dicom-dateien-oeffnen",
  },
});

const navLinks = [
  { href: "#ct-files", label: "CT Files" },
  { href: "#windowing", label: "Windowing" },
  { href: "#navigation", label: "Navigation" },
  { href: "#supported", label: "Supported Types" },
];

const faqItems = [
  {
    question: "What is CT windowing?",
    answer:
      "CT windowing (also called window/level adjustment) lets you change how the image is displayed to focus on different tissue types. Different window settings highlight bone, soft tissue, lungs, or brain tissue.",
  },
  {
    question: "How many slices can a CT scan have?",
    answer:
      "A typical CT scan can have anywhere from 60 to over 500 slices, depending on the body region and scan protocol. The viewer handles all sizes smoothly.",
  },
  {
    question: "Can I view CT angiography (CTA)?",
    answer: `Yes. ${APP_NAME} supports all CT DICOM data including CT angiography, CT pulmonary angiography (CTPA), and contrast-enhanced studies.`,
  },
  {
    question: "Is my CT scan data private?",
    answer:
      "Yes. All processing happens in your browser. No server uploads, no cloud storage, no accounts. Your images stay on your device.",
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
      "Free online CT scan viewer for computed tomography DICOM files with AI annotation.",
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

export default function CTScanViewerPage() {
  return (
    <>
      <SchemaScript schema={schemas} />
      <LandingHeader
        links={navLinks}
        ctaText="Upload CT Scan"
        ctaHref="/"
      />

      <main className="pt-24">
        <LandingHero
          label="Free Browser-Based CT Viewer"
          title="View Your CT Scan Online —"
          titleHighlight="Free DICOM Viewer for Computed Tomography."
          description={`CT scans generate hundreds of cross-sectional images that build a detailed picture of your body's interior. But when you get those images on a disc or as a download, opening them at home can be a challenge. ${APP_NAME} lets you upload your CT scan DICOM files and explore them in a full-featured viewer — right in your browser, no installation required.`}
          primaryCta={{ text: "Upload CT Scan", href: "/", icon: "upload_file" }}
          secondaryCta={{ text: "Learn About Windowing", href: "#windowing" }}
        />

        {/* Understanding CT Scan Files */}
        <LandingSection bg="surface-container-low" id="ct-files" border>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Understanding CT Scan Files
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed space-y-6">
            <p>
              A single CT scan can consist of hundreds of individual DICOM
              slices. These files contain far more information than standard
              images: they include Hounsfield unit data that represents tissue
              density, along with metadata about the scan parameters, patient
              information, and body region. This is why a standard image viewer
              won&apos;t do them justice — you need a tool built for medical
              imaging.
            </p>
            <p>
              {APP_NAME} handles all of this automatically. Upload your files and
              the viewer parses the metadata, organizes slices into the correct
              series, and renders them with proper windowing so you see
              meaningful detail from the start.
            </p>
          </div>
        </LandingSection>

        {/* Windowing for Different Tissues */}
        <LandingSection bg="surface" id="windowing">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Windowing for Different Tissues
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
            One of the most powerful features for CT viewing is window/level
            adjustment. Different tissues absorb X-rays differently, and by
            changing the window width and level, you can focus on specific
            structures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="skeleton"
              title="Bone Window"
              description="High window width brings out skeletal detail. Ideal for fracture assessment or spine evaluation."
            />
            <FeatureCard
              icon="cardiology"
              title="Soft Tissue Window"
              description="Standard settings for viewing organs, muscles, and other soft structures in the abdomen or chest."
            />
            <FeatureCard
              icon="pulmonology"
              title="Lung Window"
              description="Wide window with low level to visualize lung parenchyma, airways, and pulmonary nodules."
            />
            <FeatureCard
              icon="neurology"
              title="Brain Window"
              description="Narrow window optimized for distinguishing gray matter, white matter, and potential lesions."
            />
          </div>
          <p className="mt-8 text-sm text-[var(--color-on-surface-variant)]">
            {APP_NAME}&apos;s brightness and contrast sliders give you direct
            control over these values, with the current Window (W) and Level (L)
            always visible as an overlay on the image.
          </p>
        </LandingSection>

        {/* Navigate Through Your Scan */}
        <LandingSection bg="surface-container-lowest" id="navigation">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Navigate Through Your Scan
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed space-y-6">
            <p>
              CT scans are three-dimensional datasets viewed one slice at a time.
              {APP_NAME}&apos;s slice navigation slider lets you smoothly scroll
              through an entire series. Whether your chest CT has 200 slices or
              your head CT has 60, the experience is fluid and responsive.
            </p>
            <p>
              The viewer displays your current position (e.g., Slice 87 / 234)
              so you always know exactly where you are in the stack. Combined
              with zoom controls and split view, you have everything you need for
              a thorough review.
            </p>
          </div>
        </LandingSection>

        {/* AI-Assisted CT Analysis */}
        <LandingSection bg="surface">
          <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-12 ghost-border">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              AI-Assisted CT Analysis
            </h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
              Activate AI annotation on any CT slice to receive structured
              observations. The AI identifies regions of interest and marks them
              with color-coded overlays, providing descriptions for each finding.
            </p>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              This feature is especially useful when you want to understand what
              areas of your CT scan might warrant further attention. Remember: AI
              analysis is a supplement to, not a replacement for, professional
              medical review.
            </p>
          </div>
        </LandingSection>

        {/* Common CT Scan Types Supported */}
        <LandingSection bg="surface-container-low" id="supported">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Common CT Scan Types Supported
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <CheckList
            items={[
              "Chest CT and CT Pulmonary Angiography (CTPA)",
              "Abdominal and pelvic CT",
              "Head CT (with and without contrast)",
              "CT of the spine (cervical, thoracic, lumbar)",
              "Musculoskeletal CT",
              "CT Angiography (CTA)",
              "Any CT series stored in DICOM format",
            ]}
          />
        </LandingSection>

        {/* Completely Private */}
        <LandingSection bg="surface-container-lowest">
          <div className="text-center">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] mb-8">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Completely Private
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              CT scans contain detailed anatomical information and personal data.
              {APP_NAME} keeps everything in your browser. No server uploads, no
              cloud storage, no accounts. Your images stay on your device.
            </p>
          </div>
        </LandingSection>

        {/* FAQ */}
        <LandingSection bg="surface-container-low" id="faq">
          <LandingFAQ items={faqItems} />
        </LandingSection>

        {/* Internal Links */}
        <LandingSection bg="surface">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Explore More
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/open-dicom-files" className="text-[var(--color-primary)] hover:underline text-sm">
                Open DICOM Files
              </Link>
              <Link href="/mri-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                MRI Viewer
              </Link>
              <Link href="/understand-your-scan" className="text-[var(--color-primary)] hover:underline text-sm">
                Understand Your Scan
              </Link>
            </div>
          </div>
        </LandingSection>

        <LandingCTA
          title="Upload your CT scan and start exploring"
          description="Free and private."
          buttonText="Upload CT Scan"
          buttonHref="/"
        />
      </main>

      <LandingFooter />
    </>
  );
}
