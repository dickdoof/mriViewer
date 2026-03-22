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
    <div className="space-y-3">
      <h3 className="font-bold text-lg px-1">Study Info</h3>
      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex justify-between text-sm px-1"
          >
            <span className="text-base-content/60">{field.label}</span>
            <span className="font-medium text-right max-w-[60%] truncate">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
