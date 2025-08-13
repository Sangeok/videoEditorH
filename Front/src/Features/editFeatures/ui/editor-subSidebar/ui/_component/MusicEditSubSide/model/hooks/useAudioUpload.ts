import { useState, useRef } from "react";

export function useAudioUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedAudios, setUploadedAudios] = useState<string[]>([]);

  const processAudioFile = (file: File, onAudioProcessed: (audioUrl: string) => void) => {
    if (!file.type.startsWith("audio/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const audioUrl = e.target?.result as string;
      setUploadedAudios((prev) => [...prev, audioUrl]);
      onAudioProcessed(audioUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (files: FileList | null, onAudioProcessed: (audioUrl: string) => void) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      processAudioFile(file, onAudioProcessed);
    });
  };

  const removeAudio = (index: number) => {
    setUploadedAudios((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    fileInputRef,
    uploadedAudios,
    handleFileSelect,
    removeAudio,
  };
}
