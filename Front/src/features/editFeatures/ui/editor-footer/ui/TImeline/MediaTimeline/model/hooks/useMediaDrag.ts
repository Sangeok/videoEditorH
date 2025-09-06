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
  const roundTime = useCallback((time: number) => Math.round(time * 1000) / 1000, []);

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

  // Adjust subsequent elements only when overlap occurs
  const adjustSubsequentElements = useCallback(
    (elementId: string, newEndTime: number, sortedElements: MediaElement[]): ElementAdjustment[] => {
      const currentIndex = sortedElements.findIndex((el) => el.id === elementId);
      if (currentIndex === -1) return [];

      const adjustments: ElementAdjustment[] = [];
      let prevEnd = newEndTime;

      for (let i = currentIndex + 1; i < sortedElements.length; i++) {
        const currentElement = sortedElements[i];
        const overlap = prevEnd - currentElement.startTime;
        const shift = Math.max(overlap, 0);

        if (shift > 0) {
          const adjustment: ElementAdjustment = {
            id: currentElement.id,
            startTime: currentElement.startTime + shift,
            endTime: currentElement.endTime + shift,
            duration: currentElement.endTime - currentElement.startTime,
          };
          adjustments.push(adjustment);
          prevEnd = adjustment.endTime;
        } else {
          prevEnd = currentElement.endTime;
        }
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
        maxEndTimeDuringDrag: element.endTime,
      });
    },
    [media.mediaElement]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.elementId) return;

      // calculate the time difference between the start point and the current point
      const deltaX = e.clientX - dragState.startX;
      // convert the time difference to the time difference in seconds
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
      newStartTime = roundTime(newStartTime);

      // Prevent start time from exceeding end time
      const minAllowedStartTime = roundTime(dragState.originalEndTime - 0.1);
      if (newStartTime >= dragState.originalEndTime) {
        newStartTime = minAllowedStartTime;
      }

      const newDuration = roundTime(dragState.originalEndTime - newStartTime);

      updateMediaElement(dragState.elementId, {
        startTime: newStartTime,
        endTime: dragState.originalEndTime,
        duration: newDuration,
      });
    },
    [dragState, getSortedElements, getMinStartTime, updateMediaElement, roundTime]
  );

  const handleRightResize = useCallback(
    (deltaTime: number) => {
      if (!dragState.elementId) return;

      let candidateEndTime = Math.max(dragState.originalStartTime + 0.1, dragState.originalEndTime + deltaTime);
      candidateEndTime = roundTime(candidateEndTime);

      const isExtendingBeyondMax = candidateEndTime > (dragState.maxEndTimeDuringDrag ?? dragState.originalEndTime);

      const sortedElements = getSortedElements();
      const adjustments = isExtendingBeyondMax
        ? adjustSubsequentElements(dragState.elementId, candidateEndTime, sortedElements)
        : [];

      // Update current element
      const currentUpdate = {
        id: dragState.elementId,
        updates: {
          endTime: candidateEndTime,
          duration: roundTime(candidateEndTime - dragState.originalStartTime),
        },
      };

      // Update subsequent elements
      const allUpdates = [
        currentUpdate,
        ...adjustments.map((adj) => ({
          id: adj.id,
          updates: {
            startTime: roundTime(adj.startTime),
            endTime: roundTime(adj.endTime),
            duration: roundTime(adj.duration),
          },
        })),
      ];

      if (allUpdates.length > 0) {
        updateMultipleMediaElements(allUpdates);
      }

      // Track the farthest right edge reached during this drag
      if (isExtendingBeyondMax) {
        setDragState((prev) => ({
          ...prev,
          maxEndTimeDuringDrag: candidateEndTime,
        }));
      }
    },
    [dragState, getSortedElements, adjustSubsequentElements, updateMultipleMediaElements, roundTime]
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
