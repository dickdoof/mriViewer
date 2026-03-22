interface StudyInfo {
  patientName?: string;
  studyDate?: string;
  modality?: string;
  description?: string;
  institution?: string;
  accession?: string;
  seriesCount?: number;
  sliceCount?: number;
}

interface StudyInfoPanelProps {
  study: StudyInfo;
}

export default function StudyInfoPanel({ study }: StudyInfoPanelProps) {
  const fields = [
    { label: "Patient", value: study.patientName },
    { label: "Study Date", value: study.studyDate },
    { label: "Modality", value: study.modality },
    { label: "Description", value: study.description },
    { label: "Institution", value: study.institution },
    { label: "Accession", value: study.accession },
    { label: "Series", value: study.seriesCount?.toString() },
    { label: "Total Slices", value: study.sliceCount?.toString() },
  ].filter((f) => f.value);

  return (
    <div>
      <h3 className="label-md px-1 mb-3">Study Info</h3>
      <div className="space-y-0">
        {fields.map((field, i) => (
          <div
            key={field.label}
            className={`flex justify-between py-2 px-2 rounded-sm ${
              i % 2 === 1 ? "bg-[var(--color-surface-low)]" : ""
            }`}
          >
            <span className="label-sm">{field.label}</span>
            <span className="value-readout text-xs text-right max-w-[60%] truncate">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
