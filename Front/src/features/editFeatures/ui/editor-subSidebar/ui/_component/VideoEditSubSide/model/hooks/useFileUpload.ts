import { useRef, useState } from "react";

export interface UploadedVideo {
  id: string;
  file: File;
  url: string;
  duration: number;
  width: number;
  height: number;
}

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  const handleFileSelect = async (
    files: FileList | null,
    addVideoToProject: (videoData: { url: string; duration: number; width: number; height: number }) => void
  ) => {
    if (!files) return;

    const videoFiles = Array.from(files).filter((file) => file.type.startsWith("video/"));

    for (const file of videoFiles) {
      const videoUrl = URL.createObjectURL(file);

      // Create video element to get metadata
      const videoElement = document.createElement("video");
      videoElement.src = videoUrl;

      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          const videoData = {
            url: videoUrl,
            duration: videoElement.duration,
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          };

          const uploadedVideo: UploadedVideo = {
            id: `video-${Date.now()}-${Math.random()}`,
            file,
            ...videoData,
          };

          setUploadedVideos((prev) => [...prev, uploadedVideo]);
          addVideoToProject(videoData);
          resolve();
        };
      });
    }
  };

  const removeVideo = (index: number) => {
    setUploadedVideos((prev) => {
      const videoToRemove = prev[index];
      if (videoToRemove) {
        URL.revokeObjectURL(videoToRemove.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  return {
    fileInputRef,
    uploadedVideos,
    handleFileSelect,
    removeVideo,
  };
}
