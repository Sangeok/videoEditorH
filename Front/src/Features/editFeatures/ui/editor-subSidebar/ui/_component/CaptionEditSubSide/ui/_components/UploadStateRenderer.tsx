import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { UploadState } from "../../model/types";

interface UploadStateRendererProps {
  uploadState: UploadState;
  errorMessage: string;
  uploadedCount: number;
  onChooseFile: () => void;
  onReset: () => void;
}

export default function UploadStateRenderer({
  uploadState,
  errorMessage,
  uploadedCount,
  onChooseFile,
  onReset,
}: UploadStateRendererProps) {
  if (uploadState === "idle") {
    return <IdleState onChooseFile={onChooseFile} />;
  }

  if (uploadState === "uploading") {
    return <UploadingState />;
  }

  if (uploadState === "success") {
    return <SuccessState uploadedCount={uploadedCount} onReset={onReset} />;
  }

  if (uploadState === "error") {
    return <ErrorState errorMessage={errorMessage} onReset={onReset} />;
  }

  return null;
}

function IdleState({ onChooseFile }: { onChooseFile: () => void }) {
  return (
    <>
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 mb-2">Drag & drop your SRT file here</p>
      <p className="text-gray-500 text-sm mb-4">or</p>
      <Button onClick={onChooseFile} variant="light" size="sm">
        Choose SRT File
      </Button>
    </>
  );
}

function UploadingState() {
  return (
    <>
      <FileText className="mx-auto h-12 w-12 text-blue-400 mb-3 animate-pulse" />
      <p className="text-blue-400">Processing SRT file...</p>
    </>
  );
}

function SuccessState({
  uploadedCount,
  onReset,
}: {
  uploadedCount: number;
  onReset: () => void;
}) {
  return (
    <>
      <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
      <p className="text-green-400 mb-2">Successfully imported!</p>
      <p className="text-gray-400 text-sm mb-4">
        {uploadedCount} caption{uploadedCount !== 1 ? "s" : ""} added to
        timeline
      </p>
      <Button onClick={onReset} variant="light" size="sm">
        Import Another File
      </Button>
    </>
  );
}

function ErrorState({
  errorMessage,
  onReset,
}: {
  errorMessage: string;
  onReset: () => void;
}) {
  return (
    <>
      <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-3" />
      <p className="text-red-400 mb-2">Upload failed</p>
      <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
      <Button onClick={onReset} variant="light" size="sm">
        Try Again
      </Button>
    </>
  );
}
