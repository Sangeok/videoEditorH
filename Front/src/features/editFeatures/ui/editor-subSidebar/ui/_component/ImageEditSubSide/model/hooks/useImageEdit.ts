import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop, useMediaSelection } from "../../../../../model/hooks";
import { useImageProjectManagement } from "./useImageProjectManagement";
import { MediaElement } from "@/entities/media/types";

export function useImageEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const mediaSelection = useMediaSelection<MediaElement>("image");
  const projectManagement = useImageProjectManagement();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, projectManagement.addImageToTimeLine);
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      fileUpload.handleFileSelect(files, projectManagement.addImageToTimeLine);
    });
  };

  const deleteImage = (imageId: string) => {
    projectManagement.deleteImage(imageId);
    if (mediaSelection.isSelected(imageId)) {
      mediaSelection.clearSelection();
    }
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedImages: fileUpload.uploadedImages,
      selectedImageId: mediaSelection.selectedId,
      dragActive: dragAndDrop.dragActive,
      selectedImage: mediaSelection.selectedItem,
    },
    actions: {
      handleFileSelect,
      addImageToTimeLine: projectManagement.addImageToTimeLine,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      removeImage: fileUpload.removeImage,
      selectImage: mediaSelection.select,
      updateImageSettings: projectManagement.updateImageSettings,
      deleteImage,
    },
  };
}
