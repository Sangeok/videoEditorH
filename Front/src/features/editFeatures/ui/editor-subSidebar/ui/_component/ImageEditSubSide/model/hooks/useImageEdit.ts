import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop } from "./useDragAndDrop";
import { useImageSelection } from "./useImageSelection";
import { useImageProjectManagement } from "./useImageProjectManagement";

export function useImageEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const imageSelection = useImageSelection();
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
    if (imageSelection.isImageSelected(imageId)) {
      imageSelection.clearSelection();
    }
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedImages: fileUpload.uploadedImages,
      selectedImageId: imageSelection.selectedImageId,
      dragActive: dragAndDrop.dragActive,
      selectedImage: imageSelection.selectedImage,
    },
    actions: {
      handleFileSelect,
      addImageToTimeLine: projectManagement.addImageToTimeLine,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      removeImage: fileUpload.removeImage,
      selectImage: imageSelection.selectImage,
      updateImageSettings: projectManagement.updateImageSettings,
      deleteImage,
    },
  };
}
