import { useState, useCallback, useEffect } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { MoveDragState, DropPreview } from "../types";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";

const initialMoveDragState: MoveDragState = {
  isDragging: false,
  elementId: null, // elementId to be dragged
  startX: 0, // starting x position of the drag(pixels)
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
  const isDelete = useTimelineToolStore((state) => state.isDelete);

  // Convert pixels to time (with precision rounding)
  const pixelsToTime = useCallback(
    (pixels: number) => {
      const time = pixels / pixelsPerSecond;
      return Math.round(time * 1000) / 1000; // Round to 3 decimal places
    },
    [pixelsPerSecond]
  );

  // Convert time to pixels (with precision rounding)
  const timeToPixels = useCallback(
    (time: number) => {
      const pixels = time * pixelsPerSecond;
      return Math.round(pixels * 1000) / 1000; // Round to 3 decimal places
    },
    [pixelsPerSecond]
  );

  // Helper function to round time values to 3 decimal places
  const roundTime = useCallback((time: number) => {
    return Math.round(time * 1000) / 1000;
  }, []);

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
      let validTime = roundTime(Math.max(0, targetTime));
      const roundedDuration = roundTime(duration);

      // Check for overlaps and adjust position
      for (const element of sortedElements) {
        const elementStart = roundTime(element.startTime);
        const elementEnd = roundTime(element.endTime);

        // If target overlaps with existing element, position after it
        if (
          validTime < elementEnd &&
          validTime + roundedDuration > elementStart
        ) {
          validTime = roundTime(elementEnd);
        }
      }

      return validTime;
    },
    [getSortedElements, roundTime]
  );

  // Find overlapping elements against the dragged range
  const findOverlappingElements = useCallback(
    (targetStartTime: number, duration: number, excludeId: string) => {
      const sortedElements = getSortedElements(excludeId);
      const dragStart = roundTime(targetStartTime);
      const dragEnd = roundTime(targetStartTime + duration);

      return sortedElements.filter((element) => {
        const elementStart = roundTime(element.startTime);
        const elementEnd = roundTime(element.endTime);
        return dragStart < elementEnd && dragEnd > elementStart;
      });
    },
    [getSortedElements, roundTime]
  );

  // Choose the primary overlapping element (closest center to dragged center)
  const choosePrimaryOverlap = useCallback(
    (targetStartTime: number, duration: number, excludeId: string) => {
      const overlaps = findOverlappingElements(
        targetStartTime,
        duration,
        excludeId
      );
      if (overlaps.length === 0) return null;

      const draggedCenter = roundTime(targetStartTime + duration / 2);
      let best = overlaps[0];
      let bestDelta = Math.abs(
        draggedCenter -
          roundTime((overlaps[0].startTime + overlaps[0].endTime) / 2)
      );

      for (let i = 1; i < overlaps.length; i += 1) {
        const candidate = overlaps[i];
        const candidateCenter = roundTime(
          (candidate.startTime + candidate.endTime) / 2
        );
        const delta = Math.abs(draggedCenter - candidateCenter);
        if (delta < bestDelta) {
          best = candidate;
          bestDelta = delta;
        }
      }

      return best;
    },
    [findOverlappingElements, roundTime]
  );

  // Check if a candidate start overlaps any element
  const hasOverlapAt = useCallback(
    (candidateStart: number, duration: number, excludeId: string) => {
      const candidateStartRounded = roundTime(candidateStart);
      const candidateEndRounded = roundTime(candidateStartRounded + duration);
      for (const element of getSortedElements(excludeId)) {
        const elementStart = roundTime(element.startTime);
        const elementEnd = roundTime(element.endTime);
        if (
          candidateStartRounded < elementEnd &&
          candidateEndRounded > elementStart
        ) {
          return true;
        }
      }
      return false;
    },
    [getSortedElements, roundTime]
  );

  // Compute snap start time based on overlap side relative to the overlapping element's center
  const computeSnapStartForPreview = useCallback(
    (targetStartTime: number, duration: number, excludeId: string): number => {
      const primary = choosePrimaryOverlap(
        targetStartTime,
        duration,
        excludeId
      );
      if (!primary) {
        return calculateValidDropTime(targetStartTime, duration, excludeId);
      }

      const primaryCenter = roundTime(
        (primary.startTime + primary.endTime) / 2
      );
      const draggedCenter = roundTime(targetStartTime + duration / 2);

      let candidateStart: number;
      if (draggedCenter < primaryCenter) {
        // Place before overlapping element so dragged end touches its start
        candidateStart = roundTime(
          Math.max(0, roundTime(primary.startTime) - duration)
        );
      } else {
        // Place after overlapping element so dragged start touches its end
        candidateStart = roundTime(primary.endTime);
      }

      // If candidate still overlaps others, try the opposite side
      if (hasOverlapAt(candidateStart, duration, excludeId)) {
        let alternative: number;
        if (draggedCenter < primaryCenter) {
          alternative = roundTime(primary.endTime);
        } else {
          alternative = roundTime(
            Math.max(0, roundTime(primary.startTime) - duration)
          );
        }

        if (!hasOverlapAt(alternative, duration, excludeId)) {
          return alternative;
        }

        // Fallback to default behavior
        return calculateValidDropTime(targetStartTime, duration, excludeId);
      }

      return candidateStart;
    },
    [choosePrimaryOverlap, calculateValidDropTime, hasOverlapAt, roundTime]
  );

  // Handle move drag start
  const handleMoveStart = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      const element = media.mediaElement.find((el) => el.id === elementId);
      if (!element) return;

      if (isDelete) return;

      setMoveDragState({
        isDragging: true,
        elementId,
        startX: e.clientX,
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
    [media.mediaElement, timeToPixels, roundTime, isDelete]
  );

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!moveDragState.isDragging || !moveDragState.elementId) return;

      const deltaX = e.clientX - moveDragState.startX;
      const deltaTime = pixelsToTime(deltaX);
      const duration = roundTime(
        moveDragState.originalEndTime - moveDragState.originalStartTime
      );

      // Calculate target time
      const targetTime = roundTime(moveDragState.originalStartTime + deltaTime);
      const validTargetTime = computeSnapStartForPreview(
        targetTime,
        duration,
        moveDragState.elementId
      );

      // Update ghost position and drop preview
      setMoveDragState((prev) => ({
        ...prev,
        ghostPosition: timeToPixels(validTargetTime),
      }));

      // Keep preview at the raw cursor position; show resolved position via ghostPosition
      setDropPreview((prev) => ({
        ...prev,
        targetTime: targetTime,
      }));
    },
    [
      moveDragState,
      pixelsToTime,
      timeToPixels,
      computeSnapStartForPreview,
      roundTime,
    ]
  );

  // Handle mouse up (drop)
  const handleMouseUp = useCallback(() => {
    if (
      moveDragState.isDragging &&
      moveDragState.elementId &&
      dropPreview.isVisible
    ) {
      const duration = roundTime(
        moveDragState.originalEndTime - moveDragState.originalStartTime
      );
      const rawStartTime = roundTime(dropPreview.targetTime);
      // Resolve to a valid non-overlapping start time at drop
      const resolvedStartTime = computeSnapStartForPreview(
        rawStartTime,
        duration,
        moveDragState.elementId
      );
      const newEndTime = roundTime(resolvedStartTime + duration);

      // Update the media element position
      updateMediaElement(moveDragState.elementId, {
        startTime: resolvedStartTime,
        endTime: newEndTime,
        duration,
      });
    }

    // Reset states
    setMoveDragState(initialMoveDragState);
    setDropPreview(initialDropPreview);
  }, [
    moveDragState,
    dropPreview,
    updateMediaElement,
    roundTime,
    computeSnapStartForPreview,
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
