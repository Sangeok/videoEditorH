import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop } from "../../../../../model/hooks";
import { useVideoSelection } from "./useVideoSelection";
import { useVideoProjectManagement } from "./useVideoProjectManagement";

export function useVideoEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const videoSelection = useVideoSelection();
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
    if (videoSelection.isVideoSelected(videoId)) {
      videoSelection.clearSelection();
    }
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedVideos: fileUpload.uploadedVideos,
      selectedVideoId: videoSelection.selectedVideoId,
      dragActive: dragAndDrop.dragActive,
      selectedVideo: videoSelection.selectedVideo,
    },
    actions: {
      handleFileSelect,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      removeVideo: fileUpload.removeVideo,
      selectVideo: videoSelection.selectVideo,
      updateVideoSettings: projectManagement.updateVideoSettings,
      deleteVideo,
      addVideoToTimeLine: projectManagement.addVideoToTimeLine,
    },
  };
}
