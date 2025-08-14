import { useState } from "react";

export function useDragAndDrop() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    onFilesDropped: (files: FileList) => void
  ) => {
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