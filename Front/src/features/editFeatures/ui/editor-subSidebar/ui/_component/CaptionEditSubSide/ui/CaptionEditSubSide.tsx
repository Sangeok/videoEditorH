"use client";

import { useCaptionUpload } from "../model/hooks/useCaptionUpload";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import CaptionEdit from "./_components/captionEdit/ui";

export default function CaptionEditSubSide() {
  const { state, actions, fileInputRef } = useCaptionUpload();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Captions</h3>

      <MediaFileUploadArea
        mediaType="caption"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <CaptionEdit />
    </div>
  );
}
