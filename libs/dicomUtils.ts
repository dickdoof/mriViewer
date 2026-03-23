/**
 * Convert a DICOM ArrayBuffer to a base64-encoded PNG string.
 * Client-only — uses canvas for rendering.
 */
export async function dicomToBase64(buffer: ArrayBuffer): Promise<string | null> {
  try {
    const dcmjs = await import("dcmjs");
    const dicomData = dcmjs.data.DicomMessage.readFile(buffer);
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
      dicomData.dict
    );

    const rows = dataset.Rows || 512;
    const cols = dataset.Columns || 512;
    const bitsAllocated = dataset.BitsAllocated || 16;
    const pixelRepresentation = dataset.PixelRepresentation || 0;
    const rescaleSlope = dataset.RescaleSlope || 1;
    const rescaleIntercept = dataset.RescaleIntercept || 0;
    const windowCenter = Array.isArray(dataset.WindowCenter)
      ? dataset.WindowCenter[0]
      : dataset.WindowCenter || 127;
    const windowWidth = Array.isArray(dataset.WindowWidth)
      ? dataset.WindowWidth[0]
      : dataset.WindowWidth || 256;

    const pixelDataElement = dataset.PixelData;
    if (!pixelDataElement) return null;

    let rawPixels: ArrayBuffer;
    if (Array.isArray(pixelDataElement)) {
      rawPixels = pixelDataElement[0];
    } else if (pixelDataElement instanceof ArrayBuffer) {
      rawPixels = pixelDataElement;
    } else {
      return null;
    }

    let pixelArray: Int16Array | Uint16Array | Uint8Array;
    if (bitsAllocated === 16) {
      pixelArray =
        pixelRepresentation === 1
          ? new Int16Array(rawPixels)
          : new Uint16Array(rawPixels);
    } else {
      pixelArray = new Uint8Array(rawPixels);
    }

    const canvas = document.createElement("canvas");
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(cols, rows);

    const wc = Number(windowCenter);
    const ww = Number(windowWidth);
    const lower = wc - ww / 2;
    const upper = wc + ww / 2;

    for (let i = 0; i < pixelArray.length && i < rows * cols; i++) {
      const hu = pixelArray[i] * rescaleSlope + rescaleIntercept;
      let val: number;
      if (hu <= lower) {
        val = 0;
      } else if (hu >= upper) {
        val = 255;
      } else {
        val = ((hu - lower) / (upper - lower)) * 255;
      }

      const idx = i * 4;
      imageData.data[idx] = val;
      imageData.data[idx + 1] = val;
      imageData.data[idx + 2] = val;
      imageData.data[idx + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl.split(",")[1];
  } catch (err) {
    console.error("DICOM parsing error:", err);
    return null;
  }
}

/**
 * Extract basic metadata from a DICOM ArrayBuffer without rendering pixels.
 */
export async function extractDicomMetadata(buffer: ArrayBuffer): Promise<{
  modality?: string;
  institution?: string;
  description?: string;
  patientName?: string;
  studyDate?: string;
}> {
  try {
    const dcmjs = await import("dcmjs");
    const dicomData = dcmjs.data.DicomMessage.readFile(buffer);
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
      dicomData.dict
    );

    return {
      modality: dataset.Modality,
      institution: dataset.InstitutionName,
      description: dataset.StudyDescription || dataset.SeriesDescription,
      patientName: dataset.PatientName?.Alphabetic || dataset.PatientName,
      studyDate: dataset.StudyDate,
    };
  } catch {
    return {};
  }
}
