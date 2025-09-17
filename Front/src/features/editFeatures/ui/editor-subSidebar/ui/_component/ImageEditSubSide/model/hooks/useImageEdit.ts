"use client";

import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop } from "./useDragAndDrop";
import { useImageSelection } from "./useImageSelection";
import { useImageProjectManagement } from "./useImageProjectManagement";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { useMemo } from "react";

export function useImageEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const imageSelection = useImageSelection();
  const projectManagement = useImageProjectManagement();

  const { deleteMediaElement } = useMediaStore();
  const mediaElements = useMediaStore((s) => s.media.mediaElement);

  const uploadedImages = useMemo(
    () => mediaElements.filter((e) => e.type === "image"),
    [mediaElements]
  );

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, projectManagement.addImageToProject);
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      fileUpload.handleFileSelect(files, projectManagement.addImageToProject);
    });
  };

  const deleteImage = (imageId: string) => {
    if (!imageId) return;
    deleteMediaElement(imageId);
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedImages: uploadedImages,
      selectedImageId: imageSelection.selectedImageId,
      dragActive: dragAndDrop.dragActive,
      selectedImage: imageSelection.selectedImage,
    },
    actions: {
      handleFileSelect,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      selectImage: imageSelection.selectImage,
      updateImageSettings: projectManagement.updateImageSettings,
      deleteImage,
    },
  };
}
