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
  title: `Free Online X-Ray Viewer — Upload and View X-Ray Images in Your Browser | ${APP_NAME}`,
  description:
    "View X-ray DICOM images online for free. Upload your digital radiography files, adjust brightness and contrast, zoom in, and get AI annotations. No software needed.",
  canonicalUrlRelative: "/x-ray-viewer",
  keywords: [
    "X-ray viewer online",
    "view X-ray images",
    "free X-ray viewer",
    "digital radiography viewer",
    "CR DR viewer",
    "view X-ray DICOM",
  ],
  openGraph: {
    title: "Free Online X-Ray Viewer — View Digital Radiographs Instantly",
    description:
      "Upload X-ray DICOM files and view them in a professional browser-based viewer. Adjust image settings and run AI analysis.",
    url: "https://mriviewer.app/x-ray-viewer",
  },
});

const navLinks = [
  { href: "#dicom-format", label: "X-Ray DICOM" },
  { href: "#features", label: "Features" },
  { href: "#types", label: "X-Ray Types" },
  { href: "#why-view", label: "Why View at Home" },
];

const faqItems = [
  {
    question: "Can I view dental X-rays?",
    answer: `Yes. ${APP_NAME} supports dental panoramic X-rays (OPG) and other dental DICOM files.`,
  },
  {
    question: "What's the difference between CR and DR?",
    answer:
      "CR (Computed Radiography) and DR (Digital Radiography) are two methods of capturing digital X-rays. Both produce DICOM files that the viewer can open.",
  },
  {
    question: "Can I compare X-rays from different dates?",
    answer:
      "Yes. Upload multiple studies and use the split view to compare X-rays side by side — useful for tracking fracture healing or monitoring changes over time.",
  },
  {
    question: "Is my X-ray data private?",
    answer:
      "Yes. All processing happens in your browser. Nothing is uploaded, nothing is stored. Your privacy is protected by design.",
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
      "Free online X-ray viewer for digital radiography DICOM files with AI annotation.",
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

export default function XRayViewerPage() {
  return (
    <>
      <SchemaScript schema={schemas} />
      <LandingHeader
        links={navLinks}
        ctaText="Upload X-Ray"
        ctaHref="/"
      />

      <main className="pt-24">
        <LandingHero
          label="Free Browser-Based X-Ray Viewer"
          title="View X-Ray Images Online —"
          titleHighlight="Free Digital Radiography Viewer."
          description={`X-rays are the most common type of medical imaging — from a routine chest X-ray to a dental panoramic image or a fractured wrist. But when you get your X-ray on a disc or as a DICOM file, you need more than a standard image viewer to see it properly. ${APP_NAME} is a free, browser-based DICOM viewer that handles X-ray images with the same precision tools used by radiologists.`}
          primaryCta={{ text: "Upload X-Ray", href: "/", icon: "upload_file" }}
          secondaryCta={{ text: "View Features", href: "#features" }}
        />

        {/* X-Rays in DICOM Format */}
        <LandingSection bg="surface-container-low" id="dicom-format" border>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              X-Rays in DICOM Format
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed space-y-6">
            <p>
              Digital X-rays — technically called Computed Radiography (CR) or
              Digital Radiography (DR) — are stored as DICOM files just like MRI
              and CT scans. These files contain the high-bit-depth image data
              along with metadata about the study, patient, and acquisition
              parameters.
            </p>
            <p>
              Standard image viewers compress this data and lose critical detail.
              {APP_NAME} renders the full dynamic range of your X-ray, letting
              you adjust window and level to bring out the details that matter —
              whether that&apos;s bone structure, soft tissue, or foreign bodies.
            </p>
          </div>
        </LandingSection>

        {/* Viewer Features for X-Ray */}
        <LandingSection bg="surface" id="features">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Viewer Features for X-Ray
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="contrast"
              title="Brightness & Contrast Control"
              description="X-rays benefit enormously from windowing adjustments. Brighten the image to see soft tissue detail, or increase contrast to sharpen bone edges."
            />
            <FeatureCard
              icon="zoom_in"
              title="Zoom"
              description="Digital X-rays are high-resolution images. Zoom into a specific joint, tooth, or lung field to see fine detail that might not be visible at overview level."
            />
            <FeatureCard
              icon="smart_toy"
              title="AI Annotation"
              description="Run AI analysis on your X-ray to get observations about visible structures and potential findings. Color-coded overlays mark areas of interest directly on the image."
            />
            <FeatureCard
              icon="info"
              title="Metadata Display"
              description="See the study date, body region, institution, and technical parameters from the DICOM header."
            />
          </div>
        </LandingSection>

        {/* Common X-Ray Types */}
        <LandingSection bg="surface-container-lowest" id="types">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Common X-Ray Types You Can View
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <CheckList
            items={[
              "Chest X-ray (PA and lateral)",
              "Extremity X-rays (hand, wrist, elbow, shoulder, knee, ankle, foot)",
              "Spine X-rays (cervical, thoracic, lumbar)",
              "Pelvis and hip X-rays",
              "Dental panoramic X-rays (OPG)",
              "Abdominal X-rays",
              "Any CR/DR DICOM file",
            ]}
          />
        </LandingSection>

        {/* Why View Your X-Ray at Home? */}
        <LandingSection bg="surface" id="why-view">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Why View Your X-Ray at Home?
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed space-y-6">
            <p>
              Perhaps you want to show a family member what the doctor found.
              Perhaps you&apos;re managing a recovery — a healing fracture, for
              instance — and want to compare images over time. Or maybe you
              simply want to see for yourself what your X-ray reveals before your
              follow-up appointment.
            </p>
            <p>
              Whatever the reason, having direct access to your own imaging is
              empowering.
            </p>
          </div>
        </LandingSection>

        {/* Private and Secure */}
        <LandingSection bg="surface-container-lowest">
          <div className="text-center">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] mb-8">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Private and Secure
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              Like all imaging in {APP_NAME}, your X-ray files are processed
              entirely in your browser. Nothing is uploaded, nothing is stored.
              Your privacy is protected by design.
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
              <Link href="/ct-scan-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                CT Scan Viewer
              </Link>
              <Link href="/understand-your-scan" className="text-[var(--color-primary)] hover:underline text-sm">
                Understand Your Scan
              </Link>
            </div>
          </div>
        </LandingSection>

        <LandingCTA
          title="Upload your X-ray now"
          description="View it in full detail, free."
          buttonText="Upload X-Ray"
          buttonHref="/"
        />
      </main>

      <LandingFooter />
    </>
  );
}
