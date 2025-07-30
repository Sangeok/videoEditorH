import { useState } from "react";

export function useDragAndDrop() {
  const [dragActive, setDragActive] = useState(false);

  const isDragEnterOrOver = (eventType: string) => {
    return eventType === "dragenter" || eventType === "dragover";
  };

  const isDragLeave = (eventType: string) => {
    return eventType === "dragleave";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDragEnterOrOver(e.type)) {
      setDragActive(true);
    } else if (isDragLeave(e.type)) {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, onFilesDropped: (files: FileList) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    onFilesDropped(e.dataTransfer.files);
  };

  return {
    dragActive,
    handleDrag,
    handleDrop,
  };
}