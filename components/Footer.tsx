import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-surface-low)]">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <Link
              href="/#"
              aria-current="page"
              className="flex gap-2 justify-center md:justify-start items-center"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                priority={true}
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <strong className="font-extrabold tracking-tight text-base md:text-lg text-[var(--color-rm-on-surface)]">
                {config.appName}
              </strong>
            </Link>

            <p className="mt-3 text-sm text-[var(--color-rm-on-surface-dim)]">
              {config.appDescription}
            </p>
            <p className="mt-3 label-sm">
              Copyright &copy; {new Date().getFullYear()} &mdash; All rights reserved
            </p>

            <p className="mt-4 text-[0.625rem] text-[var(--color-rm-on-surface-faint)]">
              For informational purposes only. Not a substitute for
              professional medical advice.
            </p>
          </div>
          <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="label-md mb-3 md:text-left">
                LINKS
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                {config.resend.supportEmail && (
                  <a
                    href={`mailto:${config.resend.supportEmail}`}
                    target="_blank"
                    className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors"
                    aria-label="Contact Support"
                  >
                    Support
                  </a>
                )}
                <Link href="/#pricing" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                  Pricing
                </Link>
                <Link href="/blog" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                  Blog
                </Link>
                <Link href="/contact" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="label-md mb-3 md:text-left">
                LEGAL
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                <Link href="/tos" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                  Terms of services
                </Link>
                <Link href="/privacy-policy" className="text-[var(--color-rm-on-surface-dim)] hover:text-[var(--color-rm-primary)] transition-colors">
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
