export type UploadState = "idle" | "uploading" | "success" | "error";

export interface CaptionUploadState {
  uploadState: UploadState;
  errorMessage: string;
  uploadedCount: number;
}

export interface FileHandlerActions {
  handleFileSelect: (file: File) => Promise<void>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  openFileDialog: () => void;
  resetUpload: () => void;
}