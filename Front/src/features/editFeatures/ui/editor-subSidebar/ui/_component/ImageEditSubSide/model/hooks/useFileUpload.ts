import { useState, useRef } from "react";

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const processImageFile = (file: File, onImageProcessed: (imageUrl: string) => void) => {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImages((prev) => [...prev, imageUrl]);
      onImageProcessed(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (files: FileList | null, onImageProcessed: (imageUrl: string) => void) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      processImageFile(file, onImageProcessed);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    fileInputRef,
    uploadedImages,
    handleFileSelect,
    removeImage,
  };
}