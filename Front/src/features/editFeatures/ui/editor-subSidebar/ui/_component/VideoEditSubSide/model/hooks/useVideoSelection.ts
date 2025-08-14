import { useState } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";

export function useVideoSelection() {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { media } = useMediaStore();

  const selectVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const clearSelection = () => {
    setSelectedVideoId(null);
  };

  const isVideoSelected = (videoId: string) => {
    return selectedVideoId === videoId;
  };

  const selectedVideo = selectedVideoId ? media.mediaElement.find((element) => element.id === selectedVideoId) : null;

  return {
    selectedVideoId,
    selectedVideo,
    selectVideo,
    clearSelection,
    isVideoSelected,
  };
}
