import { useCallback, useEffect } from "react";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import {
  AudioElement,
  MediaElement,
  TextElement,
} from "@/entities/media/types";
import { createElementPositioner } from "./_internal/elementPositioning";
import { useDragState } from "../useDragState";
import {
  pixelsToTime,
  roundTime,
  timeToPixels,
} from "@/shared/lib/timeConversion";

interface UseTrackElementMoveProps<
  T extends MediaElement | AudioElement | TextElement
> {
  SelectedElements: T[];
  updateSelectedElements: (elementId: string, updates: Partial<T>) => void;
}

export function useTrackElementMove<
  T extends MediaElement | AudioElement | TextElement
>({ SelectedElements, updateSelectedElements }: UseTrackElementMoveProps<T>) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const isDeleteMode = useTimelineToolStore((state) => state.isDelete);

  const {
    moveDragState,
    dropPreview,
    isDraggingElement,
    startDragging,
    updateDragPositions,
    resetDragState,
  } = useDragState();

  const positioner = createElementPositioner(SelectedElements);

  const handleMoveStart = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();

      const element = SelectedElements.find((el) => el.id === elementId);
      if (!element || isDeleteMode) return;

      const elementStartTime = roundTime(element.startTime);
      const elementEndTime = roundTime(element.endTime);
      const initialGhostPosition = timeToPixels(
        elementStartTime,
        pixelsPerSecond
      );

      startDragging(
        elementId,
        e.clientX,
        elementStartTime,
        elementEndTime,
        initialGhostPosition
      );
    },
    [SelectedElements, pixelsPerSecond, isDeleteMode, startDragging]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingElement) return;

      const deltaX = e.clientX - moveDragState.startX;
      const deltaTime = pixelsToTime(deltaX, pixelsPerSecond);
      const elementDuration = roundTime(
        moveDragState.originalEndTime - moveDragState.originalStartTime
      );

      const rawTargetTime = roundTime(
        moveDragState.originalStartTime + deltaTime
      );
      const snappedPosition = positioner.computeSnapPosition(
        rawTargetTime,
        elementDuration,
        moveDragState.elementId!
      );

      const ghostPixelPosition = timeToPixels(snappedPosition, pixelsPerSecond);

      updateDragPositions(ghostPixelPosition, rawTargetTime);
    },
    [
      isDraggingElement,
      moveDragState,
      positioner,
      updateDragPositions,
      pixelsPerSecond,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDraggingElement || !dropPreview.isVisible) {
      resetDragState();
      return;
    }

    const elementDuration = roundTime(
      moveDragState.originalEndTime - moveDragState.originalStartTime
    );
    const rawStartTime = roundTime(dropPreview.targetTime);

    const finalStartTime = positioner.computeSnapPosition(
      rawStartTime,
      elementDuration,
      moveDragState.elementId!
    );
    const finalEndTime = roundTime(finalStartTime + elementDuration);

    updateSelectedElements(moveDragState.elementId!, {
      startTime: finalStartTime,
      endTime: finalEndTime,
      duration: elementDuration,
    } as Partial<T>);

    resetDragState();
  }, [
    isDraggingElement,
    dropPreview.isVisible,
    moveDragState,
    dropPreview.targetTime,
    positioner,
    updateSelectedElements,
    resetDragState,
  ]);

  // Global mouse event listeners
  useEffect(() => {
    if (moveDragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [moveDragState.isDragging, handleMouseMove, handleMouseUp]);

  return {
    moveDragState,
    dropPreview,
    handleMoveStart,
  };
}
