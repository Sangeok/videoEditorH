import { useMediaStore } from "@/entities/media/useMediaStore";
import { createImageElement } from "../../lib/imageElementFactory";
import { MediaElement } from "@/entities/media/types";

export function useImageProjectManagement() {
  const { media, addMediaElement, updateMediaElement, deleteMediaElement } = useMediaStore();

  const addImageToTimeLine = (imageUrl: string) => {
    const imageElement = createImageElement(imageUrl);

    const existingImage = media.mediaElement.find((el) => el.url === imageUrl);
    if (existingImage) {
      alert("Image already exists in the timeline");
      return;
    }

    addMediaElement(imageElement);
  };

  const updateImageSettings = (imageId: string, updates: Partial<MediaElement>) => {
    updateMediaElement(imageId, updates);
  };

  const deleteImage = (imageId: string) => {
    deleteMediaElement(imageId);
  };

  return {
    addImageToTimeLine,
    updateImageSettings,
    deleteImage,
  };
}
