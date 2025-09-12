import { useCallback } from "react";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";

interface UseTrackElementInteractionProps {
  deleteSelectedElements: (selectedElements: string) => void;
}

export function useTrackElementInteraction({
  deleteSelectedElements,
}: UseTrackElementInteractionProps) {
  const isDelete = useTimelineToolStore((state) => state.isDelete);

  const handleTrackElementClick = useCallback(
    (selectedElements: string) => {
      if (isDelete) {
        deleteSelectedElements(selectedElements);
      }
    },
    [isDelete, deleteSelectedElements]
  );

  return {
    handleTrackElementClick,
  };
}
