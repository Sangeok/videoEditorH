import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { createImageElement } from "../../lib/imageElementFactory";

export function useImageProjectManagement() {
  const { media, addMediaElement, updateMediaElement, deleteMediaElement } =
    useMediaStore();

  const addImageToProject = (imageUrl: string) => {
    const imageElement = createImageElement(imageUrl);
    addMediaElement(imageElement);
  };

  const updateImageSettings = (imageId: string, updates: any) => {
    updateMediaElement(imageId, updates);
  };

  const deleteImage = (imageId: string) => {
    deleteMediaElement(imageId);
  };

  return {
    addImageToProject,
    updateImageSettings,
    deleteImage,
  };
}
