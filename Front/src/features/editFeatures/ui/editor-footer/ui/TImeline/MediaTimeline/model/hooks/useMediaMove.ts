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
  const [moveDragState, setMoveDragState] = useState<MoveDragState>(initialMoveDragState);
  const [dropPreview, setDropPreview] = useState<DropPreview>(initialDropPreview);

  // Convert pixels to time (with precision rounding)
  const pixelsToTime = useCallback((pixels: number) => {
    const time = pixels / pixelsPerSecond;
    return Math.round(time * 1000) / 1000; // Round to 3 decimal places
  }, [pixelsPerSecond]);

  // Convert time to pixels (with precision rounding)
  const timeToPixels = useCallback((time: number) => {
    const pixels = time * pixelsPerSecond;
    return Math.round(pixels * 1000) / 1000; // Round to 3 decimal places
  }, [pixelsPerSecond]);

  // Helper function to round time values to 3 decimal places
  const roundTime = useCallback((time: number) => {
    return Math.round(time * 1000) / 1000;
  }, []);

  // Get sorted media elements by start time (excluding currently dragged element)
  const getSortedElements = useCallback(
    (excludeId?: string) => {
      return [...media.mediaElement].filter((el) => el.id !== excludeId).sort((a, b) => a.startTime - b.startTime);
    },
    [media.mediaElement]
  );

  // Calculate valid drop position based on timeline constraints
  const calculateValidDropTime = useCallback(
    (targetTime: number, duration: number, excludeId: string): number => {
      const sortedElements = getSortedElements(excludeId);
      let validTime = roundTime(Math.max(0, targetTime));
      const roundedDuration = roundTime(duration);

      // Check for overlaps and adjust position
      for (const element of sortedElements) {
        const elementStart = roundTime(element.startTime);
        const elementEnd = roundTime(element.endTime);

        console.log("validTime", validTime);
        console.log("elementStart", elementStart);
        console.log("elementEnd", elementEnd);
        console.log("duration", roundedDuration);

        // If target overlaps with existing element, position after it
        if (validTime < elementEnd && validTime + roundedDuration > elementStart) {
          validTime = roundTime(elementEnd);
        }
      }

      return validTime;
    },
    [getSortedElements, roundTime]
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
        originalStartTime: roundTime(element.startTime),
        originalEndTime: roundTime(element.endTime),
        ghostPosition: timeToPixels(roundTime(element.startTime)),
      });

      setDropPreview({
        isVisible: true,
        targetTime: roundTime(element.startTime),
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
      const duration = roundTime(moveDragState.originalEndTime - moveDragState.originalStartTime);

      // Calculate target time
      const targetTime = roundTime(moveDragState.originalStartTime + deltaTime);
      const validTargetTime = calculateValidDropTime(targetTime, duration, moveDragState.elementId);

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
    if (moveDragState.isDragging && moveDragState.elementId && dropPreview.isVisible) {
      const duration = roundTime(moveDragState.originalEndTime - moveDragState.originalStartTime);
      const newStartTime = roundTime(dropPreview.targetTime);
      const newEndTime = roundTime(newStartTime + duration);

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
  }, [moveDragState, dropPreview, updateMediaElement, roundTime]);

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
