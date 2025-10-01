"use client";

import MediaFileUploadArea from "../../MediaFileUploadArea";
import { useImageEdit } from "../model/hooks/useImageEdit";
import ImagePreviewArea from "./_component/ImagePreviewArea";

export default function ImageEditSubSide() {
  const { state, actions, fileInputRef } = useImageEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Image</h3>

      <MediaFileUploadArea
        mediaType="image"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <ImagePreviewArea
        uploadedImages={state.uploadedImages}
        addImageToTimeLine={actions.addImageToTimeLine}
        removeImage={actions.removeImage}
      />
    </div>
  );
}
