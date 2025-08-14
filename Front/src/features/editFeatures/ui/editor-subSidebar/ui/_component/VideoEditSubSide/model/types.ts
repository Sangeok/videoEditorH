import { MediaElement } from "@/entities/media/types";

export interface VideoEditActions {
  handleFileSelect: (files: FileList | null) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  removeVideo: (index: number) => void;
  selectVideo: (videoId: string) => void;
  updateVideoSettings: (videoId: string, updates: Partial<MediaElement>) => void;
  deleteVideo: (videoId: string) => void;
}
