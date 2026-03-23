import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { uploadFile } from "@/libs/minio";
import { analyzeSlice } from "@/libs/annotate";
import { dicomBufferToPng } from "@/libs/dicomUtils";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const metadataJson = formData.get("metadata") as string;
    const stripeSessionId = formData.get("stripeSessionId") as string;

    if (!metadataJson || !stripeSessionId) {
      return NextResponse.json(
        { error: "metadata and stripeSessionId are required" },
        { status: 400 }
      );
    }

    // Verify payment using service role (bypasses RLS)
    const adminSupabase = new SupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: payment } = await adminSupabase
      .from("payments")
      .select("*")
      .eq("stripe_session_id", stripeSessionId)
      .eq("user_id", user.id)
      .eq("status", "paid")
      .single();

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found or not confirmed" },
        { status: 403 }
      );
    }

    const metadata = JSON.parse(metadataJson);

    // Create study
    const { data: study, error: studyError } = await supabase
      .from("studies")
      .insert({
        user_id: user.id,
        patient_name: metadata.patientName || "Unknown",
        study_date: metadata.studyDate || new Date().toISOString(),
        modality: metadata.modality || "MRI",
        description: metadata.description || "",
        institution: metadata.institution || "",
        accession: metadata.accession || "",
        minio_prefix: `${user.id}/${crypto.randomUUID()}`,
        paid: true,
        stripe_session_id: stripeSessionId,
      })
      .select()
      .single();

    if (studyError || !study) {
      return NextResponse.json(
        { error: "Failed to create study" },
        { status: 500 }
      );
    }

    // Update payment with study_id
    await supabase
      .from("payments")
      .update({ study_id: study.id })
      .eq("id", payment.id);

    // Process series and files
    const files = formData.getAll("files") as File[];

    // Create a default series
    const { data: series } = await supabase
      .from("series")
      .insert({
        study_id: study.id,
        body_region: metadata.bodyRegion || "Unknown",
        name: metadata.seriesName || "Series 1",
        image_count: files.length,
        minio_prefix: `${study.minio_prefix}/series-1`,
      })
      .select()
      .single();

    if (!series) {
      return NextResponse.json(
        { error: "Failed to create series" },
        { status: 500 }
      );
    }

    // Upload each DICOM file: convert to PNG, store in MinIO, run AI analysis
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());

      // Convert DICOM to rendered PNG server-side
      const rendered = await dicomBufferToPng(buffer);
      if (!rendered) {
        console.error(`Failed to render DICOM slice ${i}: ${file.name}`);
        continue;
      }

      // Upload rendered PNG (not raw DICOM) so the viewer can display it
      const pngKey = `${series.minio_prefix}/${file.name.replace(/\.dcm$/i, "")}.png`;
      await uploadFile(pngKey, rendered.pngBuffer, "image/png");

      const { data: dicomFile } = await supabase
        .from("dicom_files")
        .insert({
          series_id: series.id,
          slice_index: i,
          minio_key: pngKey,
          file_name: file.name,
        })
        .select()
        .single();

      // Run AI annotation on EVERY slice
      if (dicomFile) {
        try {
          const result = await analyzeSlice(rendered.base64, "image/png");

          if (result.findings.length > 0) {
            await supabase.from("annotations").insert({
              dicom_file_id: dicomFile.id,
              findings: result.findings,
            });
          }
        } catch (annotationError) {
          console.error("Annotation failed for slice:", i, annotationError);
        }
      }
    }

    return NextResponse.json({ studyId: study.id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Persist failed";
    console.error("Study persist error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
