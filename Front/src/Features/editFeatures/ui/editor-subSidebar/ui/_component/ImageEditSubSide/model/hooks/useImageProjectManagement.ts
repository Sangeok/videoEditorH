import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { createImageElement } from "../../lib/imageElementFactory";
import { MediaElement } from "@/src/entities/media/types";

export function useImageProjectManagement() {
  const { addMediaElement, updateMediaElement, deleteMediaElement } =
    useMediaStore();

  const addImageToProject = (imageUrl: string) => {
    const imageElement = createImageElement(imageUrl);
    addMediaElement(imageElement);
  };

  const updateImageSettings = (imageId: string, updates: Partial<MediaElement>) => {
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