"use client";

import { useVideoEdit } from "../model/hooks/useVideoEdit";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import VideoPreviewArea from "./_component/VideoPreviewArea";

export default function VideoEditSubSide() {
  const { state, actions, fileInputRef } = useVideoEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Video</h3>

      <MediaFileUploadArea
        mediaType="video"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <VideoPreviewArea
        uploadedVideos={state.uploadedVideos}
        removeVideo={actions.removeVideo}
        addVideoToTimeLine={actions.addVideoToTimeLine}
      />
    </div>
  );
}
