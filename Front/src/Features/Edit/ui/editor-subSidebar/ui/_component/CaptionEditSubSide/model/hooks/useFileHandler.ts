import { useRef, useCallback } from "react";
import { FileHandlerActions } from "../types";

interface UseFileHandlerParams {
  onFileSelect: (file: File) => Promise<void>;
  onReset: () => void;
}

export function useFileHandler({ onFileSelect, onReset }: UseFileHandlerParams) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    await onFileSelect(file);
  }, [onFileSelect]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetUpload = useCallback(() => {
    onReset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onReset]);

  const actions: FileHandlerActions = {
    handleFileSelect,
    handleFileChange,
    handleDragOver,
    handleDrop,
    openFileDialog,
    resetUpload,
  };

  return {
    fileInputRef,
    actions,
  };
}