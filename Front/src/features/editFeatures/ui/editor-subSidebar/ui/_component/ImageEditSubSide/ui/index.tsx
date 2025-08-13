"use client";

import { useImageEdit } from "../model/hooks/useImageEdit";
import ImageFileUploadArea from "./_component/ImageFileUploadArea";
import ImagePreviewArea from "./_component/ImagePreviewArea";

export default function ImageEditSubSide() {
  const { state, actions, fileInputRef } = useImageEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Image</h3>

      <ImageFileUploadArea
        fileInputRef={fileInputRef}
        actions={actions}
        dragActive={state.dragActive}
      />

      <ImagePreviewArea
        uploadedImages={state.uploadedImages}
        removeImage={actions.removeImage}
      />
    </div>
  );
}
