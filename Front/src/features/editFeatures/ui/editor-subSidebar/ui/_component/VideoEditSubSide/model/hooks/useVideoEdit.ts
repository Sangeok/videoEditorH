import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop, useMediaSelection } from "../../../../../model/hooks";
import { useVideoProjectManagement } from "./useVideoProjectManagement";
import { MediaElement } from "@/entities/media/types";

export function useVideoEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const mediaSelection = useMediaSelection<MediaElement>("video");
  const projectManagement = useVideoProjectManagement();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, projectManagement.addVideoToTimeLine);
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      fileUpload.handleFileSelect(files, projectManagement.addVideoToTimeLine);
    });
  };

  const deleteVideo = (videoId: string) => {
    projectManagement.deleteVideo(videoId);
    if (mediaSelection.isSelected(videoId)) {
      mediaSelection.clearSelection();
    }
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedVideos: fileUpload.uploadedVideos,
      selectedVideoId: mediaSelection.selectedId,
      dragActive: dragAndDrop.dragActive,
      selectedVideo: mediaSelection.selectedItem,
    },
    actions: {
      handleFileSelect,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      removeVideo: fileUpload.removeVideo,
      selectVideo: mediaSelection.select,
      updateVideoSettings: projectManagement.updateVideoSettings,
      deleteVideo,
      addVideoToTimeLine: projectManagement.addVideoToTimeLine,
    },
  };
}
