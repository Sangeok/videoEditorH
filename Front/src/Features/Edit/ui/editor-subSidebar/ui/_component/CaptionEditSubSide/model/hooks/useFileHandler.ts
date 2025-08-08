import { useRef, useCallback } from "react";

interface UseFileHandlerParams {
  onFileSelect: (file: File) => Promise<void>;
  onReset: () => void;
}

export function useFileHandler({ onFileSelect, onReset }: UseFileHandlerParams) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetUpload = useCallback(() => {
    onReset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onReset]);

  return {
    fileInputRef,
    actions: {
      handleFileChange,
      handleDragOver,
      handleDrop,
      openFileDialog,
      resetUpload,
    },
  };
}