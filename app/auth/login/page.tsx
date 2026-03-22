"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";

function LoginContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const callbackUrl = redirectTo
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
    : `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`;

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-base-100">
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
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Sign in to {config.appName}
          </h1>
          <p className="text-base-content/60 mt-2">
            Access your MRI analysis reports
          </p>
        </div>

        <div className="card bg-base-200 shadow-xl p-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#570df8",
                    brandAccent: "#4506cb",
                  },
                },
              },
            }}
            theme="dark"
            providers={["google"]}
            redirectTo={callbackUrl}
            view="sign_in"
          />
        </div>

        <p className="text-center text-sm text-base-content/50">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/signup${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="link link-primary"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
