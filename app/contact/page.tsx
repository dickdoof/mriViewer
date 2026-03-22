import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-8">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">Contact Us</h1>
          <p className="text-base-content/70">
            Have questions about your MRI analysis? Need help with your account?
            We&apos;re here to help.
          </p>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body space-y-4">
              {config.resend.supportEmail && (
                <div>
                  <h2 className="font-bold text-lg mb-2">Email Support</h2>
                  <a
                    href={`mailto:${config.resend.supportEmail}`}
                    className="link link-primary"
                  >
                    {config.resend.supportEmail}
                  </a>
                </div>
              )}

              <div>
                <h2 className="font-bold text-lg mb-2">Response Time</h2>
                <p className="text-base-content/70">
                  We typically respond within 24 hours on business days.
                </p>
              </div>

              <div className="divider"></div>

              <p className="text-sm text-base-content/50">
                For medical questions, please consult a qualified healthcare
                professional. Our AI analysis is for informational purposes only.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
