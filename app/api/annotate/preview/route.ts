import { NextRequest, NextResponse } from "next/server";
import { analyzeSlice } from "@/libs/annotate";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    // Do NOT log imageBase64, do NOT store anything
    const result = await analyzeSlice(imageBase64, "image/png");

    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Analysis failed";
    console.error("Annotation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
