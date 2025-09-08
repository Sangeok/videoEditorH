import { useCallback } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { MediaElement } from "@/entities/media/types";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";

export function useMediaInteraction() {
  const { deleteMediaElement } = useMediaStore();
  const isDelete = useTimelineToolStore((state) => state.isDelete);
  const setSelectedTrackAndId = useSelectedTrackStore((state) => state.setSelectedTrackAndId);

  const handleMediaClick = useCallback(
    (mediaElement: MediaElement) => {
      if (isDelete) {
        deleteMediaElement(mediaElement.id);
      }
    },
    [isDelete, deleteMediaElement, setSelectedTrackAndId]
  );

  return {
    handleMediaClick,
  };
}
