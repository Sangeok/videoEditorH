import { MediaElement } from "@/entities/media/types";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { Upload } from "lucide-react";
import { RefObject } from "react";

interface ImageFileUploadAreaProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  actions: {
    handleFileSelect: (files: FileList | null) => void;
    handleDrag: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    removeImage: (index: number) => void;
    selectImage: (imageId: string) => void;
    updateImageSettings: (
      imageId: string,
      updates: Partial<MediaElement>
    ) => void;
    deleteImage: (imageId: string) => void;
  };
  dragActive: boolean;
}

export default function ImageFileUploadArea({
  fileInputRef,
  actions,
  dragActive,
}: ImageFileUploadAreaProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
        dragActive
          ? "border-blue-500 bg-blue-500/10"
          : "border-zinc-600 bg-zinc-800/50"
      }`}
      onDragEnter={actions.handleDrag}
      onDragLeave={actions.handleDrag}
      onDragOver={actions.handleDrag}
      onDrop={actions.handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => actions.handleFileSelect(e.target.files)}
      />

      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 mb-2">Drag & drop your image file here</p>
      <p className="text-gray-500 text-sm mb-4">or</p>
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="light"
        size="sm"
      >
        Choose Image
      </Button>
    </div>
  );
}
