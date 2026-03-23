interface StudyInfo {
  patientName?: string;
  studyDate?: string;
  modality?: string;
  description?: string;
  institution?: string;
  accession?: string;
  radiologist?: string;
  seriesCount?: number;
  sliceCount?: number;
}

interface StudyInfoPanelProps {
  study: StudyInfo;
}

export default function StudyInfoPanel({ study }: StudyInfoPanelProps) {
  const fields = [
    { label: "Modality", value: study.modality },
    { label: "Institution", value: study.institution },
    { label: "Radiologist", value: study.radiologist },
    { label: "Description", value: study.description },
    { label: "Series", value: study.seriesCount?.toString() },
    { label: "Total Slices", value: study.sliceCount?.toString() },
  ].filter((f) => f.value);

  return (
    <section>
      <div className="font-['Space_Grotesk'] uppercase tracking-widest text-[0.65rem] text-slate-500 mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">description</span>
        Study Information
      </div>
      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex justify-between text-[0.7rem] py-1 border-b border-[#424754]/5"
          >
            <span className="text-slate-500">{field.label}</span>
            <span className="text-[#dce1fb] font-medium">{field.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
