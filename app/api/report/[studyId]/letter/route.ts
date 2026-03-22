import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { uploadFile, getPresignedUrl } from "@/libs/minio";
import ReactPDF from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import React from "react";
import type { Finding } from "@/libs/annotate";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 120,
    color: "#666",
  },
  infoValue: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },
  findingBlock: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  findingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  findingLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  severityBadge: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    color: "white",
  },
  findingDescription: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333",
    marginTop: 4,
  },
  bodyText: {
    lineHeight: 1.6,
    marginBottom: 10,
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fff3cd",
    borderRadius: 4,
    fontSize: 9,
    lineHeight: 1.5,
    color: "#856404",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 10,
  },
});

const severityColors: Record<string, string> = {
  severe: "#dc2626",
  moderate: "#ea580c",
  mild: "#ca8a04",
  normal: "#16a34a",
};

interface StudyData {
  id: string;
  patient_name: string;
  study_date: string;
  modality: string;
  accession: string;
  description: string;
}

function DoctorLetter({
  study,
  findings,
}: {
  study: StudyData;
  findings: Finding[];
}) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.title }, "MRI ANALYSIS REPORT"),
          React.createElement(
            Text,
            { style: styles.subtitle },
            "Confidential Medical Document"
          )
        ),
        React.createElement(
          View,
          { style: { alignItems: "flex-end" } },
          React.createElement(
            Text,
            { style: { fontSize: 14, fontFamily: "Helvetica-Bold" } },
            "MRI Viewer"
          )
        )
      ),
      // Patient Info
      React.createElement(
        Text,
        { style: styles.sectionTitle },
        "Patient Information"
      ),
      ...[
        ["Name", study.patient_name || "Unknown"],
        ["Study Date", study.study_date || "N/A"],
        ["Modality", study.modality || "MRI"],
        ["Accession", study.accession || "N/A"],
        ["Report Generated", today],
      ].map(([label, value]) =>
        React.createElement(
          View,
          { style: styles.infoRow, key: label },
          React.createElement(Text, { style: styles.infoLabel }, label + ":"),
          React.createElement(Text, { style: styles.infoValue }, value)
        )
      ),
      // Intro
      React.createElement(
        Text,
        { style: { ...styles.bodyText, marginTop: 20 } },
        "To the treating physician,"
      ),
      React.createElement(
        Text,
        { style: styles.bodyText },
        "The following is an AI-assisted analysis of the attached MRI study. This report is intended to supplement \u2014 not replace \u2014 professional medical evaluation."
      ),
      // Findings
      React.createElement(
        Text,
        { style: styles.sectionTitle },
        "FINDINGS SUMMARY"
      ),
      ...(findings.length === 0
        ? [
            React.createElement(
              Text,
              { style: styles.bodyText, key: "no-findings" },
              "No significant abnormalities were detected in this study."
            ),
          ]
        : findings.map((finding, i) =>
            React.createElement(
              View,
              { style: styles.findingBlock, key: i },
              React.createElement(
                View,
                { style: styles.findingHeader },
                React.createElement(
                  Text,
                  { style: styles.findingLabel },
                  `\u25CF ${finding.label}`
                ),
                React.createElement(
                  Text,
                  {
                    style: {
                      ...styles.severityBadge,
                      backgroundColor:
                        severityColors[finding.severity] || severityColors.normal,
                    },
                  },
                  finding.severity.toUpperCase()
                )
              ),
              React.createElement(
                Text,
                { style: styles.findingDescription },
                finding.description
              )
            )
          )),
      // Disclaimer
      React.createElement(
        View,
        { style: styles.disclaimer },
        React.createElement(
          Text,
          null,
          "DISCLAIMER: This report was generated by an AI system and has not been reviewed by a licensed radiologist. It is intended for informational purposes only and should not be used as the sole basis for medical decisions. Please consult a qualified medical professional."
        )
      ),
      // Footer
      React.createElement(
        Text,
        { style: styles.footer },
        `MRI Viewer \u00B7 ${today} \u00B7 Study ID: ${study.id}`
      )
    )
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  try {
    const { studyId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch study (RLS enforces ownership)
    const { data: study } = await supabase
      .from("studies")
      .select("*")
      .eq("id", studyId)
      .single();

    if (!study || !study.paid) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }

    // Fetch all annotations for this study
    const { data: dicomFiles } = await supabase
      .from("dicom_files")
      .select("id, series!inner(study_id)")
      .eq("series.study_id", studyId);

    const fileIds = dicomFiles?.map((f: { id: string }) => f.id) || [];
    const { data: annotations } = fileIds.length > 0
      ? await supabase
          .from("annotations")
          .select("*")
          .in("dicom_file_id", fileIds)
      : { data: [] as { findings: unknown }[] };

    const allFindings: Finding[] = ((annotations || []) as { findings: unknown }[]).flatMap(
      (a) => (a.findings as Finding[]) || []
    );

    // Generate PDF
    const pdfStream = await ReactPDF.renderToStream(
      React.createElement(DoctorLetter, {
        study: study as StudyData,
        findings: allFindings,
      }) as any
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Upload to MinIO
    const pdfKey = `${study.minio_prefix}/doctor-letter.pdf`;
    await uploadFile(pdfKey, pdfBuffer, "application/pdf");

    // Return presigned URL
    const url = await getPresignedUrl(pdfKey, 3600);

    return NextResponse.json({ url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "PDF generation failed";
    console.error("Report generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
