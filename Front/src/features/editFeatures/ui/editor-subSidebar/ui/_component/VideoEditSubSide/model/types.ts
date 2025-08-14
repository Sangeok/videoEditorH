export interface VideoEditState {
  uploadedVideos: UploadedVideo[];
  selectedVideoId: string | null;
  dragActive: boolean;
  selectedVideo: any;
}

export interface VideoEditActions {
  handleFileSelect: (files: FileList | null) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  removeVideo: (index: number) => void;
  selectVideo: (videoId: string) => void;
  updateVideoSettings: (videoId: string, updates: any) => void;
  deleteVideo: (videoId: string) => void;
}

export interface UploadedVideo {
  id: string;
  file: File;
  url: string;
  duration: number;
  width: number;
  height: number;
}