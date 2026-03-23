import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-8 bg-[var(--color-surface)]">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h1 className="headline-lg text-3xl">Contact Us</h1>
          <p className="text-[var(--color-rm-on-surface-dim)]">
            Have questions about your MRI analysis? Need help with your account?
            We&apos;re here to help.
          </p>

          <div className="p-8 rounded-sm bg-[var(--color-surface-low)] ghost-border text-left space-y-6">
            {config.resend.supportEmail && (
              <div>
                <h2 className="label-md mb-2">Email Support</h2>
                <a
                  href={`mailto:${config.resend.supportEmail}`}
                  className="text-[var(--color-rm-primary)] hover:underline value-readout text-sm"
                >
                  {config.resend.supportEmail}
                </a>
              </div>
            )}

            <div>
              <h2 className="label-md mb-2">Response Time</h2>
              <p className="text-sm text-[var(--color-rm-on-surface-dim)]">
                We typically respond within 24 hours on business days.
              </p>
            </div>

            <div className="h-px bg-[var(--color-surface-highest)] opacity-50"></div>

            <p className="text-xs text-[var(--color-rm-on-surface-faint)]">
              For medical questions, please consult a qualified healthcare
              professional. Our AI analysis is for informational purposes only.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
