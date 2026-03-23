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
import SchemaScript from "@/components/landing/SchemaScript";
import Link from "next/link";

const APP_NAME = "MRI Viewer";

export const metadata: Metadata = getSEOTags({
  title: `Free Online MRI Viewer — View & Analyze MRI Scans in Your Browser | ${APP_NAME}`,
  description:
    "Upload your MRI scans and view them online with a professional-grade viewer. Scroll through slices, adjust contrast, and get AI-powered annotations. Free, private, no install.",
  canonicalUrlRelative: "/mri-viewer",
  keywords: [
    "MRI viewer online",
    "free MRI viewer",
    "view MRI scans online",
    "MRI image viewer",
    "AI MRI analysis",
    "MRT viewer",
  ],
  openGraph: {
    title: "Free Online MRI Viewer with AI Analysis",
    description:
      "View MRI scans in your browser. Professional tools: slice scrolling, contrast adjustment, AI annotation. Free and private.",
    url: "https://mriviewer.app/mri-viewer",
  },
  hreflangAlternates: {
    en: "https://mriviewer.app/mri-viewer",
    de: "https://mriviewer.app/de/mrt-viewer",
  },
});

const navLinks = [
  { href: "#why-mri-viewer", label: "Why You Need This" },
  { href: "#tools", label: "Viewer Tools" },
  { href: "#ai-analysis", label: "AI Analysis" },
  { href: "#scan-types", label: "Scan Types" },
];

const faqItems = [
  {
    question: "What types of MRI scans can I view?",
    answer: `${APP_NAME} works with all standard MRI DICOM data: Brain MRI (T1, T2, FLAIR, DWI), Spine MRI, Musculoskeletal MRI (knee, shoulder, hip), Abdominal and pelvic MRI, Cardiac MRI, and any other MRI series in DICOM format.`,
  },
  {
    question: "Is the AI analysis a medical diagnosis?",
    answer:
      "No. The AI analysis is designed to help you understand your scan and have more informed conversations with your doctor. It does not replace a professional radiological reading.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. You can view your MRI scans immediately without registration. Your files are processed entirely in your browser.",
  },
  {
    question: "Is my MRI data private?",
    answer: `${APP_NAME} processes all images directly in your browser — your files never leave your device. There's no account required, no cloud upload, no data stored anywhere.`,
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
      "Free online MRI viewer with AI-powered analysis and annotation.",
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to View MRI Scans Online",
    description:
      "View your MRI DICOM files in a free browser-based viewer with AI analysis.",
    step: [
      {
        "@type": "HowToStep",
        name: "Upload your MRI files",
        text: "Drag and drop your .dcm files or a ZIP archive containing your MRI series.",
      },
      {
        "@type": "HowToStep",
        name: "Browse your series",
        text: "The viewer organizes your MRI images by body region. Select a series to load.",
      },
      {
        "@type": "HowToStep",
        name: "Analyze with AI",
        text: "Click 'Annotate with AI' to get AI-powered observations on any slice.",
      },
    ],
  },
];

export default function MRIViewerPage() {
  return (
    <>
      <SchemaScript schema={schemas} />
      <LandingHeader
        links={navLinks}
        ctaText="Upload MRI"
        ctaHref="/"
      />

      <main className="pt-24">
        <LandingHero
          label="Free Browser-Based MRI Viewer"
          title="Free Online MRI Viewer —"
          titleHighlight="Explore Your Scans with AI."
          description={`You had an MRI and now you're holding a CD or a folder of files you can't open. Sound familiar? ${APP_NAME} is a free, browser-based MRI viewer that lets you load your DICOM files, scroll through every slice of your scan, and even run AI-powered analysis — all without installing any software.`}
          primaryCta={{ text: "Upload MRI Scan", href: "/", icon: "upload_file" }}
          secondaryCta={{ text: "See How It Works", href: "#tools" }}
        />

        {/* Why You Might Need an MRI Viewer */}
        <LandingSection bg="surface-container-low" id="why-mri-viewer" border>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Why You Might Need an MRI Viewer
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed space-y-6">
            <p>
              MRI scans produce detailed cross-sectional images of your body —
              but the files your hospital gives you aren&apos;t regular photos.
              They&apos;re DICOM files, and they require specialized software to
              open. Most people don&apos;t have radiology-grade software on their
              computer, and desktop DICOM viewers can be complicated to set up.
            </p>
            <p>
              With {APP_NAME}, you skip all of that. Open your browser, upload
              your files, and you&apos;re viewing your MRI within seconds.
              Whether you want to look at your Brain MRI, Spine MRI, Knee MRI,
              or any other scan — the experience is the same: fast, intuitive,
              and free.
            </p>
          </div>
        </LandingSection>

        {/* Professional Viewer Tools */}
        <LandingSection bg="surface" id="tools">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Professional Viewer Tools
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="swap_vert"
              title="Slice Navigation"
              description="Scroll through your MRI series slice by slice using the built-in slider. See exactly which slice you're on out of the total (e.g., Slice 24 / 180)."
            />
            <FeatureCard
              icon="contrast"
              title="Brightness & Contrast"
              description="Adjust Window and Level values to bring out different tissue types. Make soft tissue more visible, or focus on bone structures."
            />
            <FeatureCard
              icon="zoom_in"
              title="Zoom"
              description="Get closer to areas of interest with zoom in/out controls. The current zoom level is always visible as an overlay."
            />
            <FeatureCard
              icon="view_column"
              title="Split View"
              description="Compare two series or two slices side by side with the single/split view toggle."
            />
            <FeatureCard
              icon="info"
              title="Study Information"
              description="The right panel shows all metadata: study date, modality, description, institution, accession number, and a complete list of all series with image counts."
            />
          </div>
        </LandingSection>

        {/* AI-Powered MRI Analysis */}
        <LandingSection bg="surface-container-lowest" id="ai-analysis">
          <div className="bg-[var(--color-surface-container)] rounded-2xl p-12 ghost-border">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              AI-Powered MRI Analysis
            </h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
              What sets {APP_NAME} apart is the built-in AI annotation feature.
              On any slice, click &ldquo;Annotate with AI&rdquo; and the system
              analyzes the image in real time. It identifies regions of interest
              and returns structured findings, each with a description and
              severity level.
            </p>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
              Findings are overlaid directly on the image as color-coded bounding
              boxes: green for normal observations, yellow for mild findings,
              orange for moderate, and red for severe. A findings panel below the
              viewer lists every observation with its description.
            </p>
            <div className="p-6 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg">
              <h4 className="text-[var(--color-error)] font-bold flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined">warning</span>
                Important
              </h4>
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                This AI analysis is designed to help you understand your scan and
                have more informed conversations with your doctor. It does not
                replace a professional radiological reading.
              </p>
            </div>
          </div>
        </LandingSection>

        {/* What Types of MRI Scans */}
        <LandingSection bg="surface" id="scan-types">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              What Types of MRI Scans Can I View?
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
            <p className="mb-6">
              {APP_NAME} works with all standard MRI DICOM data, regardless of
              body region or sequence type. The viewer automatically detects the
              body region and sequence information from the DICOM metadata.
            </p>
            <CheckList
              items={[
                "Brain and head MRI (T1, T2, FLAIR, DWI, etc.)",
                "Spine MRI (cervical, thoracic, lumbar)",
                "Musculoskeletal MRI (knee, shoulder, hip, ankle)",
                "Abdominal and pelvic MRI",
                "Cardiac MRI",
                "Any other MRI series in DICOM format",
              ]}
            />
          </div>
        </LandingSection>

        {/* How It Works — Three Steps */}
        <LandingSection bg="surface-container-low">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              How It Works — Three Steps
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <StepCard
              number={1}
              icon="cloud_upload"
              title="Upload"
              description="Drag and drop your .dcm files or a ZIP archive. The viewer parses everything client-side."
            />
            <StepCard
              number={2}
              icon="browse_gallery"
              title="Explore"
              description="Select a series, scroll through slices, adjust the image to your needs."
            />
            <StepCard
              number={3}
              icon="biotech"
              title="Annotate"
              description="Let AI highlight findings and give you a starting point for understanding your scan."
            />
          </div>
        </LandingSection>

        {/* Your Data Stays Private */}
        <LandingSection bg="surface-container-lowest">
          <div className="text-center">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] mb-8">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Your Data Stays Private
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              MRI scans contain sensitive health information. {APP_NAME}{" "}
              processes all images directly in your browser — your files never
              leave your device. There&apos;s no account required, no cloud
              upload, no data stored anywhere. Close the tab and your session is
              gone.
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
              <Link href="/understand-your-scan" className="text-[var(--color-primary)] hover:underline text-sm">
                Understand Your Scan
              </Link>
              <Link href="/x-ray-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                X-Ray Viewer
              </Link>
            </div>
          </div>
        </LandingSection>

        <LandingCTA
          title="Upload your MRI scans now"
          description="See what's inside — free and private."
          buttonText="Upload MRI Scan"
          buttonHref="/"
        />
      </main>

      <LandingFooter />
    </>
  );
}
