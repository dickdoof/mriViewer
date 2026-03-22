import { createClient } from "@/libs/supabase/server";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: studies } = await supabase
    .from("studies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-8 pb-24 bg-[var(--color-surface)]">
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="headline-lg text-3xl">My Studies</h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn btn-primary btn-sm">
              New Analysis
            </Link>
            <ButtonAccount />
          </div>
        </div>

        {(!studies || studies.length === 0) ? (
          <div className="text-center py-20 space-y-5">
            <div className="w-16 h-16 rounded-sm bg-[var(--color-surface-high)] flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8 text-[var(--color-rm-on-surface-faint)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <p className="text-[var(--color-rm-on-surface-dim)]">
              No studies yet. Upload your first MRI scan to get started.
            </p>
            <Link href="/" className="btn btn-primary">
              Upload MRI Scan
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {studies.map((study, i) => (
              <div
                key={study.id}
                className={`
                  flex items-center gap-6 p-4 rounded-sm transition-all cursor-default
                  ${i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-surface-low)]"}
                  hover:bg-[var(--color-surface-high)]
                `}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-sm bg-[var(--color-surface-high)] flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[var(--color-rm-primary)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="title-sm font-bold truncate">
                    {study.patient_name || "Unnamed Study"}
                  </h2>
                  <p className="label-sm mt-0.5">
                    {study.modality || "MRI"} &middot;{" "}
                    {study.study_date || "No date"} &middot;{" "}
                    {study.description || "No description"}
                  </p>
                </div>

                {/* Status — severity badge style */}
                <div>
                  {study.paid ? (
                    <span className="severity-badge severity-normal">Paid</span>
                  ) : (
                    <span className="severity-badge severity-moderate">Pending</span>
                  )}
                </div>

                {/* Action */}
                <div>
                  {study.paid ? (
                    <Link
                      href={`/viewer/${study.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </Link>
                  ) : (
                    <span className="btn btn-ghost btn-sm btn-disabled text-[var(--color-rm-on-surface-faint)]">
                      Processing
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
