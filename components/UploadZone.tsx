"use client";

import { useState, useCallback, useRef } from "react";

interface DicomFile {
  file: File;
  arrayBuffer: ArrayBuffer;
}

interface UploadZoneProps {
  onFilesLoaded: (files: DicomFile[]) => void;
  isLoading?: boolean;
}

export default function UploadZone({ onFilesLoaded, isLoading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(
        (f) =>
          f.name.toLowerCase().endsWith(".dcm") ||
          f.name.toLowerCase().endsWith(".dicom") ||
          // DICOM files sometimes have no extension
          (!f.name.includes(".") && f.size > 1000)
      );

      if (files.length === 0) return;

      setFileCount(files.length);

      const dicomFiles: DicomFile[] = await Promise.all(
        files.map(async (file) => ({
          file,
          arrayBuffer: await file.arrayBuffer(),
        }))
      );

      onFilesLoaded(dicomFiles);
    },
    [onFilesLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-base-content/20 hover:border-primary/50 hover:bg-base-200/50"
      } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".dcm,.dicom"
        onChange={handleFileInput}
        className="hidden"
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg font-semibold">
            Analysing {fileCount} slice{fileCount !== 1 ? "s" : ""}...
          </p>
          <p className="text-sm text-base-content/60">
            This may take a moment
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold">
              Drop your DICOM files here
            </p>
            <p className="text-sm text-base-content/60 mt-1">
              or click to browse — .dcm files from your CD or USB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
