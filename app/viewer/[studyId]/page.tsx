import { createClient } from "@/libs/supabase/server";
import { getPresignedUrl } from "@/libs/minio";
import { redirect } from "next/navigation";
import ViewerClient from "@/components/ViewerClient";
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
    redirect(`/auth/login?redirect=/viewer/${studyId}`);
  }

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

  const fileIds = dicomFiles?.map((f: { id: string }) => f.id) || [];
  const { data: annotations } = fileIds.length > 0
    ? await supabase
        .from("annotations")
        .select("*")
        .in("dicom_file_id", fileIds)
    : { data: [] as { findings: unknown }[] };

  // Build a map from dicom_file_id → findings for per-slice association
  const findingsByFileId = new Map<string, Finding[]>();
  for (const a of (annotations || []) as { dicom_file_id: string; findings: unknown }[]) {
    findingsByFileId.set(a.dicom_file_id, (a.findings as Finding[]) || []);
  }

  const slices = await Promise.all(
    (dicomFiles || []).map(async (file: { id: string; minio_key: string; file_name: string }) => {
      let url = "";
      try {
        url = await getPresignedUrl(file.minio_key, 3600);
      } catch {
        url = "";
      }
      return {
        url,
        fileName: file.file_name,
        findings: findingsByFileId.get(file.id) || [],
      };
    })
  );

  // Flat list of all findings with sliceIndex for the sidebar panel
  const allFindings: (Finding & { sliceIndex: number })[] = slices.flatMap(
    (slice, i) => (slice.findings || []).map((f) => ({ ...f, sliceIndex: i }))
  );

  const totalSlices = dicomFiles?.length || 0;

  return (
    <main className="h-screen flex flex-col bg-[#0c1324] text-[#dce1fb] overflow-hidden">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-6 h-14 bg-[#0c1324] border-b border-[#424754]/15 z-50 shrink-0">
        <div className="flex items-center gap-8">
          <a href="/dashboard" className="text-xl font-black tracking-tighter text-[#adc6ff]">
            RADIOMETRIC
          </a>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-['Space_Grotesk'] uppercase tracking-widest text-[0.7rem]">MRI Viewer</span>
            <div className="h-4 w-px bg-[#424754]/30" />
            <div className="flex items-center gap-2">
              <span className="text-[#dce1fb] font-semibold text-sm">
                {study.patient_name || "MRI Study"}
              </span>
              {study.accession && (
                <span className="font-[family-name:var(--font-data)] text-xs tracking-tighter opacity-60">
                  ACC: {study.accession}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {study.study_date && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-[family-name:var(--font-data)] text-xs text-slate-300">{study.study_date}</span>
            </div>
          )}
          <DoctorLetterButton studyId={studyId} />
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white">dashboard</a>
            <span className="material-symbols-outlined text-[#adc6ff] cursor-pointer">account_circle</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR — Body Regions */}
        <aside className="w-60 flex flex-col bg-[#151b2d] border-r border-[#424754]/15 shrink-0">
          <div className="p-4 border-b border-[#424754]/10 flex-1 overflow-y-auto">
            <div className="font-['Space_Grotesk'] uppercase tracking-widest text-[0.7rem] text-slate-500 mb-4">
              Body Regions
            </div>

            {/* Series list grouped by region */}
            {(seriesList && seriesList.length > 0) ? (
              <div className="space-y-2">
                {seriesList.map((series, i) => (
                  <div key={series.id || i}>
                    <div className={`flex items-center justify-between p-2 cursor-pointer transition-all ${
                      i === 0
                        ? "bg-[#2e3447]/40 border-l-2 border-[#4d8eff] text-[#adc6ff]"
                        : "text-slate-500 hover:text-slate-300"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">accessibility_new</span>
                        <span className="font-semibold text-xs tracking-wide">{series.name || `Series ${i + 1}`}</span>
                      </div>
                      <span className="material-symbols-outlined text-xs">
                        {i === 0 ? "expand_more" : "chevron_right"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">No series data</div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="p-4 flex flex-col gap-2 border-t border-[#424754]/10">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#4d8eff] text-[#00285d] font-[family-name:var(--font-data)] font-bold text-[0.75rem] uppercase tracking-widest active:opacity-80 transition-all">
              <span className="material-symbols-outlined text-sm">analytics</span>
              Analyze Series
            </button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col items-center py-2 text-slate-500 hover:bg-[#2e3447]/30 cursor-pointer">
                <span className="material-symbols-outlined text-lg">ios_share</span>
                <span className="font-[family-name:var(--font-data)] text-[0.6rem] mt-1">EXPORT</span>
              </div>
              <div className="flex flex-col items-center py-2 text-slate-500 hover:bg-[#2e3447]/30 cursor-pointer">
                <span className="material-symbols-outlined text-lg">contact_support</span>
                <span className="font-[family-name:var(--font-data)] text-[0.6rem] mt-1">SUPPORT</span>
              </div>
            </div>
          </div>
        </aside>

        <ViewerClient
          slices={slices}
          allFindings={allFindings}
          studyInfo={{
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
      </div>
    </main>
  );
}
