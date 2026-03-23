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
  title: `Understand Your MRI, CT, or X-Ray — Review Your Scan with AI Assistance | ${APP_NAME}`,
  description:
    "Received a diagnosis and want to understand your scan yourself? Upload your MRI, CT, or X-ray and explore it with AI-powered annotations that explain what you're seeing.",
  canonicalUrlRelative: "/understand-your-scan",
  keywords: [
    "understand MRI results",
    "read my CT scan",
    "medical imaging second opinion",
    "what does my MRI show",
    "understand radiology report",
    "review my scan",
  ],
  openGraph: {
    title: "Understand Your Medical Scan — AI-Assisted Image Review",
    description:
      "Take control of your health data. Upload your scan, view it in detail, and get AI observations to better understand your diagnosis.",
    url: "https://mriviewer.app/understand-your-scan",
  },
  hreflangAlternates: {
    en: "https://mriviewer.app/understand-your-scan",
    de: "https://mriviewer.app/de/mrt-bilder-verstehen",
  },
});

const navLinks = [
  { href: "#why-patients", label: "Why Review" },
  { href: "#how-it-helps", label: "How It Helps" },
  { href: "#ai-capabilities", label: "AI Capabilities" },
  { href: "#faq", label: "FAQ" },
];

const faqItems = [
  {
    question: "Can I review my own MRI or CT scan at home?",
    answer: `Yes. If you have your DICOM files, you can upload them to ${APP_NAME} and view every slice in detail with professional viewer tools — directly in your browser, for free.`,
  },
  {
    question: "Can AI help me understand what my scan shows?",
    answer: `${APP_NAME} includes an AI annotation feature that identifies regions of interest and provides observations on individual slices. This can help you prepare questions for your doctor, but it does not replace professional medical advice.`,
  },
  {
    question: "Is this a medical second opinion?",
    answer: `No. ${APP_NAME} is a viewing and exploration tool, not a diagnostic service. AI annotations are observations to help you understand the images — they are not medical diagnoses. Always consult a qualified healthcare provider for medical decisions.`,
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
      "Free online medical scan viewer with AI-powered annotations to help patients understand their imaging results.",
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

export default function UnderstandYourScanPage() {
  return (
    <>
      <SchemaScript schema={schemas} />
      <LandingHeader
        links={navLinks}
        ctaText="Upload Scan"
        ctaHref="/"
      />

      <main className="pt-24">
        <LandingHero
          label="Take Control of Your Diagnosis"
          title="Understand Your Scan —"
          titleHighlight="Review Your Diagnosis with Confidence."
          description={`You've just received results from an MRI, CT scan, or X-ray. Maybe your doctor explained the findings quickly, or the radiology report is full of terms you don't recognize. You're not alone — millions of patients every year want to look at their own scans and truly understand what they show. ${APP_NAME} puts the power in your hands.`}
          primaryCta={{ text: "Upload Your Scan", href: "/", icon: "upload_file" }}
          secondaryCta={{ text: "Learn How It Helps", href: "#why-patients" }}
        />

        {/* Why Patients Want to See Their Own Scans */}
        <LandingSection bg="surface-container-low" id="why-patients" border>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              Why Patients Want to See Their Own Scans
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
            Medical imaging is your data. Increasingly, patients recognize the
            value of being actively involved in their healthcare rather than
            passively accepting a diagnosis. Looking at your own scan can help
            you:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="visibility"
              title="Understand the Findings"
              description='When your doctor says "disc herniation at L4-L5" or "small hypodensity in the right lobe," it can feel abstract. Seeing the actual image — and having AI point out the relevant area — makes it concrete.'
            />
            <FeatureCard
              icon="help"
              title="Prepare Better Questions"
              description="Walking into a follow-up appointment with an understanding of your scan means you can ask specific, informed questions instead of relying solely on the doctor's summary."
            />
            <FeatureCard
              icon="compare"
              title="Seek a Second Opinion"
              description="If you're considering getting a second professional reading, reviewing the images yourself first helps you understand what questions to ask."
            />
            <FeatureCard
              icon="timeline"
              title="Track Changes Over Time"
              description="If you've had multiple scans, comparing them side by side can help you see progression or improvement — an empowering part of managing a chronic condition."
            />
          </div>
        </LandingSection>

        {/* How the App Helps You */}
        <LandingSection bg="surface" id="how-it-helps">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-4">
              How {APP_NAME} Helps You Understand Your Images
            </h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="desktop_windows"
              title="Professional-Grade Viewer"
              description="The same rendering technology used in radiology workstations, running in your browser. Scroll through every slice, adjust brightness and contrast, and zoom into areas of interest."
            />
            <FeatureCard
              icon="folder_special"
              title="Organized by Body Region"
              description="Your images are automatically sorted by body region — Brain, Spine, Chest, Abdomen, and more. No need to make sense of cryptic filenames."
            />
            <FeatureCard
              icon="smart_toy"
              title="AI-Powered Annotations"
              description='Click "Annotate with AI" on any slice. The AI scans the image and highlights findings with color-coded overlays and plain-language descriptions.'
            />
            <FeatureCard
              icon="info"
              title="Study Information at a Glance"
              description="See the study date, modality, institution, and referring physician — all extracted automatically from the DICOM metadata."
            />
          </div>
        </LandingSection>

        {/* What the AI Can and Cannot Do */}
        <LandingSection bg="surface-container-lowest" id="ai-capabilities">
          <div className="bg-[var(--color-surface-container)] rounded-2xl p-12 ghost-border">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              What the AI Can and Cannot Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-severity-normal)]">
                    check_circle
                  </span>
                  It can:
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-on-surface-variant)]">
                  <li>Identify structural features</li>
                  <li>Highlight areas that appear abnormal</li>
                  <li>Provide severity levels (normal, mild, moderate, severe)</li>
                  <li>Describe observations in accessible language</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-error)]">
                    cancel
                  </span>
                  It cannot:
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-on-surface-variant)]">
                  <li>Make a medical diagnosis</li>
                  <li>Replace a radiologist&apos;s trained eye</li>
                  <li>Account for your full medical history</li>
                  <li>Recommend treatment</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] italic">
              Always discuss any findings or concerns with your healthcare
              provider.
            </p>
          </div>
        </LandingSection>

        {/* Works with All Common Scan Types */}
        <LandingSection bg="surface">
          <div className="text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Works with All Common Scan Types
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              Whether you had a brain MRI, a chest CT, a lumbar spine X-ray, or
              a knee MRI — if you have the DICOM files, {APP_NAME} can display
              them. Upload single files or full series, and start exploring
              immediately.
            </p>
          </div>
        </LandingSection>

        {/* Privacy */}
        <LandingSection bg="surface-container-lowest">
          <div className="text-center">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] mb-8">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold text-white mb-6">
              Your Privacy Comes First
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg leading-relaxed max-w-2xl mx-auto">
              We understand that medical images are among the most sensitive
              personal data. {APP_NAME} processes everything locally in your
              browser. Your files are never transmitted to a server, never
              stored, and never accessible to anyone but you. No account, no
              registration, no data collection.
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
              <Link href="/ct-scan-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                CT Scan Viewer
              </Link>
              <Link href="/x-ray-viewer" className="text-[var(--color-primary)] hover:underline text-sm">
                X-Ray Viewer
              </Link>
            </div>
          </div>
        </LandingSection>

        <LandingCTA
          title="Upload your scan now"
          description="Start understanding your diagnosis."
          buttonText="Upload My Scan"
          buttonHref="/"
        />
      </main>

      <LandingFooter />
    </>
  );
}
