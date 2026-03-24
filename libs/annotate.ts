import Anthropic from "@anthropic-ai/sdk";
import config from "@/config";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Finding {
  label: string;
  bbox: [number, number, number, number]; // [x, y, width, height] normalized 0.0–1.0
  severity: "normal" | "mild" | "moderate" | "severe";
  description: string;
}

export interface AnnotationResult {
  findings: Finding[];
}

const SYSTEM_PROMPT = `You are an expert radiologist assistant. Analyze this MRI slice image.
Return ONLY valid JSON, no prose, no markdown fences:
{
  "findings": [{
    "label": "string",
    "bbox": [x, y, width, height],
    "severity": "normal" | "mild" | "moderate" | "severe",
    "description": "string (1-2 sentence clinical description)"
  }]
}
Where bbox values are normalized between 0.0 and 1.0 relative to image dimensions.
If no abnormalities found, return { "findings": [] }`;

export async function analyzeSlice(
  imageBase64: string,
  mediaType: "image/png" | "image/jpeg" = "image/png"
): Promise<AnnotationResult> {
  const response = await anthropic.messages.create({
    model: config.ai?.model || "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: "Analyze this MRI slice and return findings as JSON.",
          },
        ],
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON — handle possible markdown fences despite instructions
  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);

    // Runtime validation: ensure findings is an array of valid objects
    if (!parsed || !Array.isArray(parsed.findings)) {
      return { findings: [] };
    }

    const validFindings: Finding[] = parsed.findings.filter(
      (f: Record<string, unknown>) =>
        typeof f.label === "string" &&
        Array.isArray(f.bbox) &&
        f.bbox.length === 4 &&
        f.bbox.every((v: unknown) => typeof v === "number") &&
        typeof f.severity === "string" &&
        ["normal", "mild", "moderate", "severe"].includes(f.severity as string) &&
        typeof f.description === "string"
    );

    return { findings: validFindings };
  } catch {
    return { findings: [] };
  }
}
