import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-surface-container-lowest)]">
      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex gap-2 items-center"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                priority={true}
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <strong className="font-extrabold tracking-tight text-base text-[var(--color-rm-on-surface)]">
                {config.appName}
              </strong>
            </Link>
            <p className="text-sm text-[var(--color-rm-on-surface-dim)]" style={{ lineHeight: 1.6 }}>
              {config.appDescription}
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <div className="label-md mb-4">Product</div>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/#how-it-works" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                How it Works
              </Link>
              <Link href="/#pricing" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Pricing
              </Link>
              <Link href="/#upload" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Sample Reports
              </Link>
              <Link href="/#upload" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                DICOM Viewer
              </Link>
            </div>
          </div>

          {/* Column 3: Support */}
          <div>
            <div className="label-md mb-4">Support</div>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/contact" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Contact Us
              </Link>
              <Link href="/#faq" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                FAQ
              </Link>
              <Link href="/#privacy" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Security
              </Link>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div>
            <div className="label-md mb-4">Legal</div>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/privacy-policy" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/tos" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                HIPAA Compliance
              </Link>
              <Link href="/tos" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                Medical Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-[var(--color-outline-variant)]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="label-sm">
            Copyright &copy; {new Date().getFullYear()} {config.appName} &mdash; All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${config.resend.supportEmail}`} className="text-[var(--color-rm-on-surface-faint)] hover:text-[var(--color-rm-primary)] transition-colors">
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
          </div>
        </div>

        {/* Medical disclaimer */}
        <p className="mt-6 text-[0.625rem] text-[var(--color-rm-on-surface-faint)] text-center max-w-lg mx-auto">
          For informational purposes only. Not a substitute for professional medical advice.
          Always consult a qualified medical professional for diagnosis and treatment.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
