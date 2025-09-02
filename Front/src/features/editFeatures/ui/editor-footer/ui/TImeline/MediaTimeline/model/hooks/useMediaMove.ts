import { useState, useCallback, useEffect } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { MoveDragState, DropPreview } from "../types";

const initialMoveDragState: MoveDragState = {
  isDragging: false,
  elementId: null, // elementId to be dragged
  startX: 0, // starting x position of the drag(pixels)
  startY: 0, // starting y position of the drag(pixels)
  originalStartTime: 0, // original start time of the element(seconds)
  originalEndTime: 0, // original end time of the element(seconds)
  ghostPosition: null, // preview position in pixels
};

const initialDropPreview: DropPreview = {
  isVisible: false, // whether the drop preview is visible
  targetTime: 0, // target time of the drop preview(seconds)
  elementId: null, // elementId of the drop preview
};

export function useMediaMove() {
  const { media, updateMediaElement } = useMediaStore();
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const [moveDragState, setMoveDragState] =
    useState<MoveDragState>(initialMoveDragState);
  const [dropPreview, setDropPreview] =
    useState<DropPreview>(initialDropPreview);

  // Convert pixels to time
  const pixelsToTime = useCallback(
    (pixels: number) => pixels / pixelsPerSecond,
    [pixelsPerSecond]
  );

  // Convert time to pixels
  const timeToPixels = useCallback(
    (time: number) => time * pixelsPerSecond,
    [pixelsPerSecond]
  );

  // Get sorted media elements by start time (excluding currently dragged element)
  const getSortedElements = useCallback(
    (excludeId?: string) => {
      return [...media.mediaElement]
        .filter((el) => el.id !== excludeId)
        .sort((a, b) => a.startTime - b.startTime);
    },
    [media.mediaElement]
  );

  // Calculate valid drop position based on timeline constraints
  const calculateValidDropTime = useCallback(
    (targetTime: number, duration: number, excludeId: string): number => {
      const sortedElements = getSortedElements(excludeId);
      let validTime = Math.max(0, targetTime);

      // Check for overlaps and adjust position
      for (const element of sortedElements) {
        const elementStart = element.startTime;
        const elementEnd = element.endTime;

        // If target overlaps with existing element, position after it
        if (validTime < elementEnd && validTime + duration > elementStart) {
          validTime = elementEnd;
        }
      }

      return validTime;
    },
    [getSortedElements]
  );

  // Handle move drag start
  const handleMoveStart = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      const element = media.mediaElement.find((el) => el.id === elementId);
      if (!element) return;

      setMoveDragState({
        isDragging: true,
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        originalStartTime: element.startTime,
        originalEndTime: element.endTime,
        ghostPosition: timeToPixels(element.startTime),
      });

      setDropPreview({
        isVisible: true,
        targetTime: element.startTime,
        elementId,
      });
    },
    [media.mediaElement, timeToPixels]
  );

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!moveDragState.isDragging || !moveDragState.elementId) return;

      const deltaX = e.clientX - moveDragState.startX;
      const deltaTime = pixelsToTime(deltaX);
      const duration =
        moveDragState.originalEndTime - moveDragState.originalStartTime;

      // Calculate target time
      const targetTime = moveDragState.originalStartTime + deltaTime;
      const validTargetTime = calculateValidDropTime(
        targetTime,
        duration,
        moveDragState.elementId
      );

      // Update ghost position and drop preview
      setMoveDragState((prev) => ({
        ...prev,
        ghostPosition: timeToPixels(validTargetTime),
      }));

      setDropPreview((prev) => ({
        ...prev,
        targetTime: validTargetTime,
      }));
    },
    [moveDragState, pixelsToTime, timeToPixels, calculateValidDropTime]
  );

  // Handle mouse up (drop)
  const handleMouseUp = useCallback(() => {
    if (
      moveDragState.isDragging &&
      moveDragState.elementId &&
      dropPreview.isVisible
    ) {
      const duration =
        moveDragState.originalEndTime - moveDragState.originalStartTime;
      const newStartTime = dropPreview.targetTime;
      const newEndTime = newStartTime + duration;

      // Update the media element position
      updateMediaElement(moveDragState.elementId, {
        startTime: newStartTime,
        endTime: newEndTime,
        duration,
      });
    }

    // Reset states
    setMoveDragState(initialMoveDragState);
    setDropPreview(initialDropPreview);
  }, [moveDragState, dropPreview, updateMediaElement]);

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
