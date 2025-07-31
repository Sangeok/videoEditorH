import { RefObject } from "react";
import UploadStateRenderer from "./UploadStateRenderer";
import { UploadState, FileHandlerActions } from "../../model/types";

interface FileUploadAreaProps {
  uploadState: UploadState;
  errorMessage: string;
  uploadedCount: number;
  fileInputRef: RefObject<HTMLInputElement>;
  actions: FileHandlerActions;
}

export default function FileUploadArea({
  uploadState,
  errorMessage,
  uploadedCount,
  fileInputRef,
  actions,
}: FileUploadAreaProps) {
  const isUploading = uploadState === "uploading";

  const containerClassName = `
    border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full"
    ${
      isUploading
        ? "border-blue-500 bg-blue-500/10"
        : "border-gray-600 hover:border-gray-500"
    }
  `;

  return (
    <div
      className={containerClassName}
      onDragOver={actions.handleDragOver}
      onDrop={actions.handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".srt"
        onChange={actions.handleFileChange}
        className="hidden"
      />

      <UploadStateRenderer
        uploadState={uploadState}
        errorMessage={errorMessage}
        uploadedCount={uploadedCount}
        onChooseFile={actions.openFileDialog}
        onReset={actions.resetUpload}
      />
    </div>
  );
}
