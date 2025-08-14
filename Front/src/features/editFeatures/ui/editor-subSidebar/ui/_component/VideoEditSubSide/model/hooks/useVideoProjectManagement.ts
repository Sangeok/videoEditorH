import { useMediaStore } from "@/entities/media/useMediaStore";
import { createVideoElement } from "../../lib/videoElementFactory";
import { MediaElement } from "@/entities/media/types";

interface VideoData {
  url: string;
  duration: number;
  width: number;
  height: number;
}

export function useVideoProjectManagement() {
  const { addMediaElement, updateMediaElement, deleteMediaElement } =
    useMediaStore();

  const addVideoToProject = (videoData: VideoData) => {
    const videoElement = createVideoElement(videoData);
    addMediaElement(videoElement);
  };

  const updateVideoSettings = (
    videoId: string,
    updates: Partial<MediaElement>
  ) => {
    updateMediaElement(videoId, updates);
  };

  const deleteVideo = (videoId: string) => {
    deleteMediaElement(videoId);
  };

  return {
    addVideoToProject,
    updateVideoSettings,
    deleteVideo,
  };
}