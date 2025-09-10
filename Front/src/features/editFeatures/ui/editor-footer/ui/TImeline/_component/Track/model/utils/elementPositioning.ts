import { createOverlapDetector } from "./overlapDetection";
import {
  AudioElement,
  MediaElement,
  TextElement,
} from "@/entities/media/types";

type TimelineElement = MediaElement | AudioElement | TextElement;

export function createElementPositioner<T extends TimelineElement>(
  elements: T[]
) {
  const detector = createOverlapDetector(elements);
  const { roundTime, hasOverlapAt, findPrimaryOverlapElement } = detector;

  function calculateValidDropTime(
    targetTime: number,
    duration: number,
    excludeId: string
  ): number {
    const sortedElements = detector.getSortedElements(excludeId);
    let validTime = roundTime(Math.max(0, targetTime));
    const roundedDuration = roundTime(duration);

    for (const element of sortedElements) {
      const elementStart = roundTime(element.startTime);
      const elementEnd = roundTime(element.endTime);

      const wouldOverlapWithElement = 
        validTime < elementEnd && validTime + roundedDuration > elementStart;

      if (wouldOverlapWithElement) {
        validTime = roundTime(elementEnd);
      }
    }

    return validTime;
  }

  function computeSnapPosition(
    targetStartTime: number,
    duration: number,
    excludeId: string
  ): number {
    const primaryOverlapElement = findPrimaryOverlapElement(
      targetStartTime,
      duration,
      excludeId
    );

    if (!primaryOverlapElement) {
      return calculateValidDropTime(targetStartTime, duration, excludeId);
    }

    const primaryCenter = roundTime(
      (primaryOverlapElement.startTime + primaryOverlapElement.endTime) / 2
    );
    const draggedCenter = roundTime(targetStartTime + duration / 2);
    const isDraggedLeftOfPrimary = draggedCenter < primaryCenter;

    let candidateStart: number;
    
    if (isDraggedLeftOfPrimary) {
      candidateStart = roundTime(
        Math.max(0, roundTime(primaryOverlapElement.startTime) - duration)
      );
    } else {
      candidateStart = roundTime(primaryOverlapElement.endTime);
    }

    const candidateHasOverlap = hasOverlapAt(candidateStart, duration, excludeId);
    
    if (candidateHasOverlap) {
      const alternativePosition = isDraggedLeftOfPrimary
        ? roundTime(primaryOverlapElement.endTime)
        : roundTime(Math.max(0, roundTime(primaryOverlapElement.startTime) - duration));

      const alternativeHasNoOverlap = !hasOverlapAt(alternativePosition, duration, excludeId);
      
      if (alternativeHasNoOverlap) {
        return alternativePosition;
      }

      return calculateValidDropTime(targetStartTime, duration, excludeId);
    }

    return candidateStart;
  }

  return {
    calculateValidDropTime,
    computeSnapPosition,
  };
}