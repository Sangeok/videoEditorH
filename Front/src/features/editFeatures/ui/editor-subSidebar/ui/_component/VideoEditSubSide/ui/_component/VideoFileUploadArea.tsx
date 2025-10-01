import Button from "@/shared/ui/atoms/Button/ui/Button";
import { Upload } from "lucide-react";
import { RefObject } from "react";

interface VideoFileUploadAreaProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  actions: {
    handleFileSelect: (files: FileList | null) => void;
    handleDrag: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
  };
  dragActive: boolean;
}

export default function VideoFileUploadArea({ fileInputRef, actions, dragActive }: VideoFileUploadAreaProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
        dragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-600 bg-zinc-800/50"
      }`}
      onDragEnter={actions.handleDrag}
      onDragLeave={actions.handleDrag}
      onDragOver={actions.handleDrag}
      onDrop={actions.handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => actions.handleFileSelect(e.target.files)}
      />

      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 mb-2">Drag & drop your video file here</p>
      <p className="text-gray-500 text-sm mb-4">or</p>
      <Button onClick={() => fileInputRef.current?.click()} variant="light" size="sm">
        Choose Video
      </Button>
    </div>
  );
}
