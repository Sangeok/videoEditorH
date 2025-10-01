import { useState } from "react";

/**
 * 파일 드래그 앤 드롭 기능을 제공하는 공유 훅
 * Video, Image, Audio 업로드 컴포넌트에서 사용
 */
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  };

  return {
    dragActive,
    handleDrag,
    handleDrop,
  };
}
