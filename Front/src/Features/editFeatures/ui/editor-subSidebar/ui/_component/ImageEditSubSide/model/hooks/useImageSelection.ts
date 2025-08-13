import { useState } from "react";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

export function useImageSelection() {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const { media } = useMediaStore();

  const selectedImage = selectedImageId 
    ? media.mediaElement.find(el => el.id === selectedImageId && el.type === "image")
    : null;

  const selectImage = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const clearSelection = () => {
    setSelectedImageId(null);
  };

  const isImageSelected = (imageId: string) => {
    return selectedImageId === imageId;
  };

  return {
    selectedImageId,
    selectedImage,
    selectImage,
    clearSelection,
    isImageSelected,
  };
}