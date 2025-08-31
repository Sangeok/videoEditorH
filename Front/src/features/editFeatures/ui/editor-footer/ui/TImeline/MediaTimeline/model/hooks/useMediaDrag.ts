import { useState, useCallback, useEffect } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { MediaElement } from "@/entities/media/types";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { DragState, DragType, ElementAdjustment } from "../types";

const initialDragState: DragState = {
  isDragging: false,
  elementId: null,
  dragType: null,
  startX: 0,
  originalStartTime: 0,
  originalEndTime: 0,
};

export function useMediaDrag() {
  const { media, updateMediaElement, updateMultipleMediaElements } = useMediaStore();
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const [dragState, setDragState] = useState<DragState>(initialDragState);

  // Convert pixels to time
  const pixelsToTime = useCallback((pixels: number) => pixels / pixelsPerSecond, [pixelsPerSecond]);

  // Get sorted media elements by start time
  const getSortedElements = useCallback(() => {
    return [...media.mediaElement].sort((a, b) => a.startTime - b.startTime);
  }, [media.mediaElement]);

  // Calculate minimum start time to prevent overlap
  const getMinStartTime = useCallback((elementId: string, sortedElements: MediaElement[]): number => {
    const currentIndex = sortedElements.findIndex((el) => el.id === elementId);
    if (currentIndex === -1 || currentIndex === 0) return 0;

    const prevElement = sortedElements[currentIndex - 1];
    return prevElement.endTime;
  }, []);

  // Adjust subsequent elements when one element's end time changes
  // if the end time of the current element is changed, the start time of the subsequent elements should be adjusted to maintain the timeline consistency
  const adjustSubsequentElements = useCallback(
    (elementId: string, newEndTime: number, sortedElements: MediaElement[]): ElementAdjustment[] => {
      // find the index of the current element
      const currentIndex = sortedElements.findIndex((el) => el.id === elementId);
      if (currentIndex === -1) return [];

      const adjustments: ElementAdjustment[] = [];

      // iterate over the subsequent elements and adjust the start time of the subsequent elements to maintain the timeline consistency
      for (let i = currentIndex + 1; i < sortedElements.length; i++) {
        // prevElement is the previous element of the current element
        const prevElement =
          i === currentIndex + 1
            ? { ...sortedElements[currentIndex], endTime: newEndTime }
            : adjustments[adjustments.length - 1];
        const currentElement = sortedElements[i];

        // calculate the time difference between the previous element and the current element
        const timeDiff = prevElement.endTime - currentElement.startTime;
        const adjustment: ElementAdjustment = {
          id: currentElement.id,
          startTime: prevElement.endTime, // the start time of the subsequent elements should be adjusted to the end time of the previous element
          endTime: currentElement.endTime + timeDiff, // the end time of the subsequent elements should be adjusted to the end time of the current element + the time difference
          duration: currentElement.endTime + timeDiff - prevElement.endTime,
        };

        adjustments.push(adjustment);
      }

      return adjustments;
    },
    []
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, elementId: string, dragType: DragType) => {
      e.stopPropagation();
      const element = media.mediaElement.find((el) => el.id === elementId);
      if (!element) return;

      setDragState({
        isDragging: true,
        elementId,
        dragType,
        startX: e.clientX,
        originalStartTime: element.startTime,
        originalEndTime: element.endTime,
      });
    },
    [media.mediaElement]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.elementId) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaTime = pixelsToTime(deltaX);

      if (dragState.dragType === "left") {
        handleLeftResize(deltaTime);
      } else if (dragState.dragType === "right") {
        handleRightResize(deltaTime);
      }
    },
    [dragState, pixelsToTime]
  );

  const handleLeftResize = useCallback(
    (deltaTime: number) => {
      if (!dragState.elementId) return;

      const sortedElements = getSortedElements();
      const minStartTime = getMinStartTime(dragState.elementId, sortedElements);

      let newStartTime = Math.max(minStartTime, dragState.originalStartTime + deltaTime);

      // Prevent start time from exceeding end time
      const minAllowedStartTime = dragState.originalEndTime - 0.1;
      if (newStartTime >= dragState.originalEndTime) {
        newStartTime = minAllowedStartTime;
      }

      const newDuration = dragState.originalEndTime - newStartTime;

      updateMediaElement(dragState.elementId, {
        startTime: newStartTime,
        endTime: dragState.originalEndTime,
        duration: newDuration,
      });
    },
    [dragState, getSortedElements, getMinStartTime, updateMediaElement]
  );

  const handleRightResize = useCallback(
    (deltaTime: number) => {
      if (!dragState.elementId) return;

      const newEndTime = Math.max(dragState.originalStartTime + 0.1, dragState.originalEndTime + deltaTime);

      const sortedElements = getSortedElements();
      const adjustments = adjustSubsequentElements(dragState.elementId, newEndTime, sortedElements);

      // Update current element
      const currentUpdate = {
        id: dragState.elementId,
        updates: {
          endTime: newEndTime,
          duration: newEndTime - dragState.originalStartTime,
        },
      };

      // Update subsequent elements
      const allUpdates = [
        currentUpdate,
        ...adjustments.map((adj) => ({
          id: adj.id,
          updates: {
            startTime: adj.startTime,
            endTime: adj.endTime,
            duration: adj.duration,
          },
        })),
      ];

      if (allUpdates.length > 0) {
        updateMultipleMediaElements(allUpdates);
      }
    },
    [dragState, getSortedElements, adjustSubsequentElements, updateMultipleMediaElements]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState(initialDragState);
    }
  }, [dragState.isDragging]);

  // Global mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return {
    dragState,
    handleResizeStart,
  };
}
