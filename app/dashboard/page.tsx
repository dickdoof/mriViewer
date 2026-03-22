import { createClient } from "@/libs/supabase/server";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's studies
  const { data: studies } = await supabase
    .from("studies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">My Studies</h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn btn-primary btn-sm">
              New Analysis
            </Link>
            <ButtonAccount />
          </div>
        </div>

        {(!studies || studies.length === 0) ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-5xl opacity-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-16 h-16 mx-auto text-base-content/30"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <p className="text-lg text-base-content/60">
              No studies yet. Upload your first MRI scan to get started.
            </p>
            <Link href="/" className="btn btn-primary">
              Upload MRI Scan
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {studies.map((study) => (
              <div
                key={study.id}
                className="card bg-base-100 shadow-sm border border-base-content/10 hover:shadow-md transition-shadow"
              >
                <div className="card-body flex-row items-center gap-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-primary"
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
                    <h2 className="font-bold text-lg truncate">
                      {study.patient_name || "Unnamed Study"}
                    </h2>
                    <p className="text-sm text-base-content/60">
                      {study.modality || "MRI"} &middot;{" "}
                      {study.study_date || "No date"} &middot;{" "}
                      {study.description || "No description"}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div>
                    {study.paid ? (
                      <span className="badge badge-success badge-sm">Paid</span>
                    ) : (
                      <span className="badge badge-warning badge-sm">
                        Pending
                      </span>
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
                      <span className="btn btn-ghost btn-sm btn-disabled">
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
