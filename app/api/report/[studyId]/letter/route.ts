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
import Anthropic from "@anthropic-ai/sdk";
import type { Finding } from "@/libs/annotate";

// Language code → full name mapping
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  pl: "Polish",
  tr: "Turkish",
  ar: "Arabic",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
};

const RTL_LANGUAGES = new Set(["ar", "he"]);

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
  minio_prefix: string;
}

/**
 * Translate bbox coords to human-readable position
 */
function bboxToPosition(bbox: [number, number, number, number]): string {
  const [x, y] = bbox;
  const horizontal = x < 0.33 ? "left" : x > 0.66 ? "right" : "center";
  const vertical = y < 0.33 ? "upper" : y > 0.66 ? "lower" : "mid";
  return `${vertical} ${horizontal} region`;
}

/**
 * Call Claude to write the doctor's letter body text
 */
async function generateLetterBody(
  study: StudyData,
  findings: Finding[],
  languageCode: string
): Promise<{ text: string; rtl: boolean }> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const languageName = LANGUAGE_MAP[languageCode] || "English";
  const isRtl = RTL_LANGUAGES.has(languageCode);

  // Build findings list for the prompt
  const findingsList = findings
    .map(
      (f, i) =>
        `- Label: ${f.label}\n  - Body region: ${f.label.split(" ")[0] || "Unknown"}\n  - Severity: ${f.severity}\n  - Description: ${f.description}\n  - Location: ${bboxToPosition(f.bbox)}`
    )
    .join("\n");

  const bodyRegions = [
    ...new Set(findings.map((f) => f.label.split(" ")[0] || "Unknown")),
  ].join(", ");

  const systemPrompt = `You are a medical documentation assistant helping patients communicate MRI findings to their treating physician. Write in clear, professional clinical language. Be precise but accessible. Never speculate beyond what the imaging data supports. Always include the standard disclaimer that this is AI-assisted and not a substitute for radiologist review.

You must write exclusively in the language specified by the user. Do not mix languages under any circumstances.`;

  const userPrompt = `Write a formal letter from a patient to their treating physician summarising the following MRI findings.

Study details:
- Patient: ${study.patient_name || "Unknown"}
- Study date: ${study.study_date || "N/A"}
- Modality: ${study.modality || "MRI"}
- Body regions scanned: ${bodyRegions || "Not specified"}
- Accession number: ${study.accession || "N/A"}

AI-detected findings:
${findingsList || "No significant findings detected."}

Write the letter in this structure:
1. Opening: brief context of why the patient is writing (they had an MRI and obtained an AI-assisted analysis)
2. Findings summary: one paragraph per finding in clinical but patient-friendly language, noting severity and location clearly
3. Recommended follow-up: suggest appropriate specialist review or further imaging based on the findings
4. Closing: polite handover to the physician's clinical judgement

Tone: professional, factual, not alarmist.
Length: 300–500 words.
Do not include a salutation line — it will be added by the template.
Do not include the disclaimer — it will be added by the template.

IMPORTANT — LANGUAGE INSTRUCTION:
Write the entire letter in ${languageName} (language code: ${languageCode}).
Every word of the letter must be in ${languageName} — including medical terms, headings, and follow-up recommendations.
Do not use English unless ${languageName} is English.
${
  isRtl
    ? `If the language is right-to-left (e.g. Arabic, Hebrew), return your response as JSON in this exact format:
{ "rtl": true, "text": "<full letter text here>" }
For all left-to-right languages, return plain text only — no JSON, no markdown.`
    : "Return plain text only — no JSON, no markdown."
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Check if RTL JSON response
  if (isRtl) {
    try {
      const cleaned = rawText.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.rtl && parsed.text) {
        return { text: parsed.text, rtl: true };
      }
    } catch {
      // If JSON parse fails, use raw text
    }
  }

  return { text: rawText.trim(), rtl: false };
}

function createStyles(rtl: boolean) {
  return StyleSheet.create({
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
      textAlign: rtl ? "right" : "left",
    },
    infoRow: {
      flexDirection: rtl ? "row-reverse" : "row",
      marginBottom: 4,
    },
    infoLabel: {
      width: 120,
      color: "#666",
      textAlign: rtl ? "right" : "left",
    },
    infoValue: {
      flex: 1,
      fontFamily: "Helvetica-Bold",
      textAlign: rtl ? "right" : "left",
    },
    findingBlock: {
      marginBottom: 12,
      padding: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
    },
    findingHeader: {
      flexDirection: rtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    findingLabel: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      textAlign: rtl ? "right" : "left",
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
      textAlign: rtl ? "right" : "left",
    },
    bodyText: {
      lineHeight: 1.6,
      marginBottom: 10,
      textAlign: rtl ? "right" : "left",
    },
    letterBody: {
      lineHeight: 1.7,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 11,
      textAlign: rtl ? "right" : "left",
    },
    disclaimer: {
      marginTop: 30,
      padding: 15,
      backgroundColor: "#fff3cd",
      borderRadius: 4,
      fontSize: 9,
      lineHeight: 1.5,
      color: "#856404",
      textAlign: rtl ? "right" : "left",
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
}

function DoctorLetter({
  study,
  findings,
  letterBody,
  rtl,
}: {
  study: StudyData;
  findings: Finding[];
  letterBody: string;
  rtl: boolean;
}) {
  const styles = createStyles(rtl);
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
      // Salutation
      React.createElement(
        Text,
        { style: { ...styles.bodyText, marginTop: 20 } },
        "To the treating physician,"
      ),
      // Claude-generated letter body
      React.createElement(
        Text,
        { style: styles.letterBody },
        letterBody
      ),
      // Findings reference
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
    const languageCode = req.nextUrl.searchParams.get("language") || "en";
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

    // Generate letter body with Claude
    const { text: letterBody, rtl } = await generateLetterBody(
      study as StudyData,
      allFindings,
      languageCode
    );

    // Generate PDF
    const pdfStream = await ReactPDF.renderToStream(
      React.createElement(DoctorLetter, {
        study: study as StudyData,
        findings: allFindings,
        letterBody,
        rtl,
      }) as any
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Upload to MinIO
    const pdfKey = `${study.minio_prefix}/doctor-letter-${languageCode}.pdf`;
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
