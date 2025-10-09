import { useMediaStore } from "@/entities/media/useMediaStore";
import { createVideoElement } from "../../lib/videoElementFactory";
import { MediaElement } from "@/entities/media/types";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

interface VideoData {
  url: string;
  duration: number;
  width: number;
  height: number;
}

export function useVideoProjectManagement() {
  const { media, addMediaElement, updateMediaElement, deleteMediaElement } = useMediaStore();
  const { activeLaneByType } = useTrackLaneStore();

  const addVideoToTimeLine = (videoData: VideoData) => {
    const laneId = activeLaneByType.media;
    const videoElement = createVideoElement(videoData, laneId);

    const existingVideo = media.mediaElement.find((el) => el.url === videoData.url);
    if (existingVideo) {
      alert("Video already exists in the timeline");
      return;
    }

    addMediaElement(videoElement);
  };

  const updateVideoSettings = (videoId: string, updates: Partial<MediaElement>) => {
    updateMediaElement(videoId, updates);
  };

  const deleteVideo = (videoId: string) => {
    deleteMediaElement(videoId);
  };

  return {
    addVideoToTimeLine,
    updateVideoSettings,
    deleteVideo,
  };
}
