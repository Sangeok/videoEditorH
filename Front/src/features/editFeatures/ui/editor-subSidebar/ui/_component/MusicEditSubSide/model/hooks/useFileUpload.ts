import { useState, useRef } from "react";
import { UploadedAudio } from "../types";

export function useFileUpload() {
  const [uploadedAudios, setUploadedAudios] = useState<UploadedAudio[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeAudio = (index: number) => {
    setUploadedAudios((prev) => prev.filter((_, i) => i !== index));
  };

  const addAudio = (audio: UploadedAudio) => {
    setUploadedAudios((prev) => [...prev, audio]);
  };

  const handleFileSelect = (
    files: FileList | null,
    onProcessFile: (file: File) => void
  ) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("audio/")) {
        alert("Please select a valid audio file");
        return;
      }
      onProcessFile(file);
    });
  };

  return {
    uploadedAudios,
    loading,
    setLoading,
    fileInputRef,
    removeAudio,
    addAudio,
    handleFileSelect,
  };
}