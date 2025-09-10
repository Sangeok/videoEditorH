import {
  AudioElement,
  MediaElement,
  TextElement,
} from "@/entities/media/types";
import { roundTime } from "@/shared/lib/timeConversion";

type TimelineElement = MediaElement | AudioElement | TextElement;

interface TimeRange {
  start: number;
  end: number;
}

function createTimeRange(startTime: number, duration: number): TimeRange {
  return {
    start: roundTime(startTime),
    end: roundTime(startTime + duration),
  };
}

function getElementTimeRange(element: TimelineElement): TimeRange {
  return {
    start: roundTime(element.startTime),
    end: roundTime(element.endTime),
  };
}

function doTimeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
  return range1.start < range2.end && range1.end > range2.start;
}

function getElementCenter(element: TimelineElement): number {
  return roundTime((element.startTime + element.endTime) / 2);
}

function findClosestElementByCenter<T extends TimelineElement>(
  elements: T[],
  targetCenter: number
): T | null {
  if (elements.length === 0) return null;

  let closest = elements[0];
  let minDistance = Math.abs(targetCenter - getElementCenter(closest));

  for (let i = 1; i < elements.length; i++) {
    const element = elements[i];
    const distance = Math.abs(targetCenter - getElementCenter(element));
    if (distance < minDistance) {
      closest = element;
      minDistance = distance;
    }
  }

  return closest;
}

export function createOverlapDetector<T extends TimelineElement>(
  elements: T[]
) {
  function getSortedElements(excludeId?: string): T[] {
    return [...elements]
      .filter((el) => el.id !== excludeId)
      .sort((a, b) => a.startTime - b.startTime);
  }

  function findOverlappingElements(
    targetStartTime: number,
    duration: number,
    excludeId: string
  ): T[] {
    const sortedElements = getSortedElements(excludeId);
    const targetRange = createTimeRange(targetStartTime, duration);

    return sortedElements.filter((element) => {
      const elementRange = getElementTimeRange(element);
      return doTimeRangesOverlap(targetRange, elementRange);
    });
  }

  function findPrimaryOverlapElement(
    targetStartTime: number,
    duration: number,
    excludeId: string
  ): T | null {
    const overlappingElements = findOverlappingElements(
      targetStartTime,
      duration,
      excludeId
    );

    const targetCenter = roundTime(targetStartTime + duration / 2);
    return findClosestElementByCenter(overlappingElements, targetCenter);
  }

  function hasOverlapAt(
    candidateStart: number,
    duration: number,
    excludeId: string
  ): boolean {
    const candidateRange = createTimeRange(candidateStart, duration);
    const sortedElements = getSortedElements(excludeId);

    return sortedElements.some((element) => {
      const elementRange = getElementTimeRange(element);
      return doTimeRangesOverlap(candidateRange, elementRange);
    });
  }

  return {
    getSortedElements,
    findOverlappingElements,
    findPrimaryOverlapElement,
    hasOverlapAt,
    roundTime,
  };
}
