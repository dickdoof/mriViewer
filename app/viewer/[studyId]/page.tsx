import { createClient } from "@/libs/supabase/server";
import { getPresignedUrl } from "@/libs/minio";
import { redirect } from "next/navigation";
import DicomViewer from "@/components/DicomViewer";
import FindingsPanel from "@/components/FindingsPanel";
import StudyInfoPanel from "@/components/StudyInfoPanel";
import DoctorLetterButton from "@/components/DoctorLetterButton";
import type { Finding } from "@/libs/annotate";

export const dynamic = "force-dynamic";

interface ViewerPageProps {
  params: Promise<{ studyId: string }>;
}

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { studyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?redirect=/viewer/${studyId}`);
  }

  // Fetch study (RLS enforces ownership)
  const { data: study } = await supabase
    .from("studies")
    .select("*")
    .eq("id", studyId)
    .single();

  if (!study) {
    redirect("/dashboard");
  }

  if (!study.paid) {
    redirect("/dashboard");
  }

  // Fetch series and files
  const { data: seriesList } = await supabase
    .from("series")
    .select("*")
    .eq("study_id", studyId)
    .order("name");

  const { data: dicomFiles } = await supabase
    .from("dicom_files")
    .select("*, series!inner(study_id)")
    .eq("series.study_id", studyId)
    .order("slice_index");

  // Fetch annotations
  const fileIds = dicomFiles?.map((f: { id: string }) => f.id) || [];
  const { data: annotations } = fileIds.length > 0
    ? await supabase
        .from("annotations")
        .select("*")
        .in("dicom_file_id", fileIds)
    : { data: [] as { findings: unknown }[] };

  // Generate presigned URLs for all DICOM files
  const slices = await Promise.all(
    (dicomFiles || []).map(async (file) => {
      let url = "";
      try {
        url = await getPresignedUrl(file.minio_key, 3600);
      } catch {
        url = "";
      }
      return {
        url,
        fileName: file.file_name,
      };
    })
  );

  // Collect all findings
  const allFindings: Finding[] = ((annotations || []) as { findings: unknown }[]).flatMap(
    (a) => (a.findings as Finding[]) || []
  );

  const totalSlices = dicomFiles?.length || 0;

  return (
    <main className="min-h-screen bg-base-100">
      {/* Header bar */}
      <div className="bg-base-200 border-b border-base-content/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="btn btn-ghost btn-sm">
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
            Dashboard
          </a>
          <h1 className="font-bold text-lg">
            {study.patient_name || "MRI Study"} &mdash;{" "}
            {study.study_date || ""}
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Viewer area */}
        <div className="flex-1 p-4">
          <DicomViewer slices={slices} allFindings={allFindings} />
        </div>

        {/* Right sidebar */}
        <div className="w-80 border-l border-base-content/10 overflow-y-auto p-4 space-y-6">
          <StudyInfoPanel
            study={{
              patientName: study.patient_name,
              studyDate: study.study_date,
              modality: study.modality,
              description: study.description,
              institution: study.institution,
              accession: study.accession,
              seriesCount: seriesList?.length || 0,
              sliceCount: totalSlices,
            }}
          />

          <div className="divider"></div>

          <FindingsPanel findings={allFindings} />

          <div className="divider"></div>

          <DoctorLetterButton studyId={studyId} />
        </div>
      </div>
    </main>
  );
}
