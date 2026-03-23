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
  title: `Open DICOM Files Online — Free .dcm Viewer in Your Browser | ${APP_NAME}`,
  description:
    "Open and view DICOM (.dcm) files directly in your browser. No software to install. Upload X-ray, CT, or MRI scans and explore them with full viewer controls.",
  canonicalUrlRelative: "/open-dicom-files",
  keywords: [
    "open DICOM files",
    ".dcm file viewer",
    "view DICOM online",
    "DICOM file opener",
    "open .dcm files in browser",
  ],
  openGraph: {
    title: "Open DICOM Files Online — Free Browser-Based Viewer",
    description:
      "Upload .dcm files and view medical images instantly. Supports X-ray, CT, MRI. No installation needed.",
    url: "https://mriviewer.app/open-dicom-files",
  },
  hreflangAlternates: {
    en: "https://mriviewer.app/open-dicom-files",
    de: "https://mriviewer.app/de/dicom-dateien-oeffnen",
  },
});

const navLinks = [
  { href: "#what-is-dicom", label: "What is DICOM?" },
  { href: "#how-to-view", label: "How to View" },
  { href: "#supported", label: "Supported Types" },
  { href: "#faq", label: "FAQ" },
];

const faqItems = [
  {
    question: "What is a DICOM file?",
    answer:
      "DICOM (Digital Imaging and Communications in Medicine) is the international standard format for medical images. Files typically have a .dcm extension and contain both image data and patient/study metadata.",
  },
  {
    question: "How do I open a .dcm file?",
    answer: `Drag and drop your .dcm file into ${APP_NAME} — it opens directly in your browser. No software download or installation is needed.`,
  },
  {
    question: "Can I view a full MRI or CT series?",
    answer:
      "Yes. Upload a ZIP archive containing all slices of a series, and the viewer will let you scroll through the entire stack.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. The core viewer and file upload functionality are completely free.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your files are processed entirely in your browser. Nothing is uploaded to any server.",
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
      "Free online DICOM file viewer for X-ray, CT, and MRI scans with AI-powered annotation.",
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

export default function OpenDicomFilesPage() {
  return (
    <>
      <SchemaScript schema={schemas} />
      <LandingHeader
        links={navLinks}
        ctaText="Open File"
        ctaHref="/"
      />

      <main className="pt-24">
        <LandingHero
          label="Online DICOM Viewer & Analysis"
          title="Open DICOM Files Online —"
          titleHighlight="No Installation Required."
          description={`Received medical imaging files from your doctor or hospital and not sure how to open them? DICOM files (.dcm) are the standard format for medical images like X-rays, CT scans, and MRIs — but they don't open with regular image viewers. ${APP_NAME} lets you upload and view DICOM files directly in your browser, instantly and for free.`}
          primaryCta={{ text: "Upload Your Scan", href: "/", icon: "upload_file" }}
          secondaryCta={{ text: "Learn More", href: "#what-is-dicom" }}
        />

        {/* What is a DICOM File? */}
        <LandingSection bg="surface-container-low" id="what-is-dicom" border>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              What Is a DICOM File?
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed space-y-6">
            <p>
              DICOM stands for Digital Imaging and Communications in Medicine.
              It&apos;s the universal file format used by hospitals, radiology
              departments, and imaging centers worldwide. When you receive a CD
              or download from a patient portal after a scan, the files are
              almost always in DICOM format with a .dcm extension.
            </p>
            <p>
              Unlike a regular JPEG or PNG, a DICOM file contains far more than
              just the image. It stores the full pixel data of your scan along
              with metadata: your name, the study date, the type of scan
              (modality), the body region, series descriptions, and technical
              parameters used during the acquisition. This is what makes DICOM
              the standard in healthcare — and also why you need a dedicated
              viewer to open these files properly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <FeatureCard
                icon="info"
                title="Patient Information"
                description="Contains name, date of birth, gender, and study date for clear identification."
              />
              <FeatureCard
                icon="settings"
                title="Technical Parameters"
                description="Stores slice thickness, exposure values, spatial orientation, and contrast agent information."
              />
            </div>
          </div>
        </LandingSection>

        {/* How to View DICOM Files */}
        <LandingSection bg="surface" id="how-to-view">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              How to View DICOM Files in Your Browser
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <StepCard
              number={1}
              icon="cloud_upload"
              title="Upload"
              description="Drag and drop a single .dcm file, multiple files, or an entire ZIP archive onto the upload area. The viewer accepts individual slices as well as complete series."
            />
            <StepCard
              number={2}
              icon="browse_gallery"
              title="Browse"
              description="Once uploaded, the viewer automatically parses the DICOM metadata and organizes your images by body region: Brain, Spine, Chest, Abdomen, and more."
            />
            <StepCard
              number={3}
              icon="biotech"
              title="Explore"
              description="Scroll through slices, adjust brightness and contrast, zoom in on areas of interest, and switch between single and split view."
            />
          </div>
        </LandingSection>

        {/* Supported File Types */}
        <LandingSection bg="surface-container-lowest" id="supported">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <div className="bg-[var(--color-surface-container)] p-8 rounded-xl ghost-border">
                <h3 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
                  Supported Modalities
                </h3>
                <ModalityGrid
                  items={[
                    { icon: "radiology", label: "MRI / MRT" },
                    { icon: "view_in_ar", label: "CT / CAT Scan" },
                    { icon: "orthopedics", label: "X-Ray (CR/DR)" },
                    { icon: "neurology", label: "Ultrasound" },
                  ]}
                />
                <p className="mt-8 text-sm text-[var(--color-on-surface-variant)] italic">
                  We support all common body regions: Brain, Spine, Chest,
                  Abdomen, Pelvis, and Extremities — automatically detected from
                  DICOM metadata.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-8">
                Supported File Types and Modalities
              </h2>
              <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed mb-6">
                Our viewer is built for maximum compatibility and processes all
                common formats of the DICOM standard.
              </p>
              <CheckList
                items={[
                  "Single .dcm and .dicom files",
                  "Complete DICOMDIR directories",
                  "Compressed ZIP archives from CDs",
                ]}
              />
            </div>
          </div>
        </LandingSection>

        {/* AI-Powered Annotation */}
        <LandingSection bg="surface">
          <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-12 ghost-border relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
                AI-Powered Annotation
              </h2>
              <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
                Beyond simple viewing, {APP_NAME} includes an AI annotation
                feature. Click &ldquo;Annotate with AI&rdquo; on any slice and
                our system will analyze the image, highlight regions of interest,
                and provide preliminary observations. Findings are color-coded by
                severity and displayed alongside their descriptions.
              </p>
              <div className="p-6 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg">
                <h4 className="text-[var(--color-error)] font-bold flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined">warning</span>
                  Medical Disclaimer
                </h4>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  This is not a diagnostic tool and does not replace professional
                  medical advice. It&apos;s designed to help you understand what
                  you&apos;re looking at and prepare better questions for your
                  healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </LandingSection>

        {/* Privacy and Security */}
        <LandingSection bg="surface-container-lowest">
          <div className="text-center">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] mb-8">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Privacy and Security
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed mb-10">
              Your medical images stay private. {APP_NAME} processes all files
              directly in your browser using{" "}
              <strong>client-side rendering</strong> technology. Your DICOM files
              are never uploaded to or stored on our servers. When you close the
              tab, your data is gone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <FeatureCard
                icon="cloud_off"
                title="No Data Storage"
                description="Your files are only loaded into your browser's memory and are never transmitted to or stored on our servers."
              />
              <FeatureCard
                icon="computer"
                title="Local in Your Browser"
                description="Image rendering happens directly on your computer. This guarantees maximum speed and full control over your sensitive health data."
              />
            </div>
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
              <Link href="/mri-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                MRI Viewer
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
          title="Ready to open your DICOM files?"
          description="Upload now — it takes seconds."
          buttonText="Upload My Scan"
          buttonHref="/"
        />
      </main>

      <LandingFooter />
    </>
  );
}
