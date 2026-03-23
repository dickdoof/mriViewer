"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";

function SignupContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const callbackUrl = redirectTo
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
    : `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`;

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-[var(--color-surface)]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="btn btn-ghost btn-sm mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                clipRule="evenodd"
              />
            </svg>
            Home
          </Link>
          <h1 className="headline-lg text-3xl">
            Create an account
          </h1>
          <p className="text-[var(--color-rm-on-surface-dim)] mt-2">
            Sign up to unlock full MRI analysis reports
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[var(--color-surface-low)] ghost-border">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#4d8eff",
                    brandAccent: "#adc6ff",
                    inputBackground: "#2e3447",
                    inputText: "#e2e4ea",
                    inputBorder: "rgba(66, 71, 84, 0.3)",
                    inputBorderFocus: "rgba(173, 198, 255, 0.4)",
                    inputBorderHover: "rgba(66, 71, 84, 0.5)",
                  },
                  radii: {
                    borderRadiusButton: "0.25rem",
                    inputBorderRadius: "0.25rem",
                  },
                },
              },
            }}
            theme="dark"
            providers={["google"]}
            redirectTo={callbackUrl}
            view="sign_up"
          />
        </div>

        <p className="text-center label-sm">
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="text-[var(--color-rm-primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
          <span className="loading loading-spinner loading-lg text-[var(--color-rm-primary)]"></span>
        </main>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
