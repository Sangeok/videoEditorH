"use client";

import { useCaptionUpload } from "../model/hooks/useCaptionUpload";
import { useFileHandler } from "../model/hooks/useFileHandler";
import FileUploadArea from "./_components/FileUploadArea";
import InstructionsPanel from "./_components/InstructionsPanel";
import { RefObject } from "react";

export default function CaptionEditSubSide() {
  const { state, actions } = useCaptionUpload();
  const { fileInputRef, actions: fileActions } = useFileHandler({
    onFileSelect: actions.processSRTFile,
    onReset: actions.resetUpload,
  });

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Import Captions</h3>

      <FileUploadArea
        uploadState={state.uploadState}
        errorMessage={state.errorMessage}
        uploadedCount={state.uploadedCount}
        fileInputRef={fileInputRef as RefObject<HTMLInputElement>}
        actions={fileActions}
      />

      <InstructionsPanel />
    </div>
  );
}
