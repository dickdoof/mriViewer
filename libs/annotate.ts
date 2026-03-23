import Anthropic from "@anthropic-ai/sdk";

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
    model: "claude-sonnet-4-20250514",
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
    const parsed = JSON.parse(cleaned) as AnnotationResult;
    return parsed;
  } catch {
    return { findings: [] };
  }
}
