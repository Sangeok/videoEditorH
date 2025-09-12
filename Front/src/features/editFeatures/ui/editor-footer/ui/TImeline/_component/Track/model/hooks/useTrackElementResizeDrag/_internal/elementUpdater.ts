import {
  AudioElement,
  MediaElement,
  TextElement,
} from "@/entities/media/types";
import { roundTime } from "@/shared/lib/timeConversion";
import { ElementAdjustment } from "../../../types";

type TimelineElement = MediaElement | AudioElement | TextElement;

export function createElementUpdater<T extends TimelineElement>({
  updateSelectedElements,
  updateMultipleSelectedElements,
}: {
  updateSelectedElements: (elementId: string, updates: Partial<T>) => void;
  updateMultipleSelectedElements: (
    updates: Array<{ id: string; updates: Partial<T> }>
  ) => void;
}) {
  function updateElementTimeProperties(
    elementId: string,
    startTime: number,
    endTime: number
  ): void {
    const duration = roundTime(endTime - startTime);
    updateSelectedElements(elementId, {
      startTime,
      endTime,
      duration,
    } as Partial<T>);
  }

  function updateMultipleElementsTimeProperties(
    currentElementId: string,
    newEndTime: number,
    originalStartTime: number,
    adjustments: ElementAdjustment[]
  ): void {
    const currentUpdate = {
      id: currentElementId,
      updates: {
        endTime: newEndTime,
        duration: roundTime(newEndTime - originalStartTime),
      },
    };

    const subsequentUpdates = adjustments.map((adj) => ({
      id: adj.id,
      updates: {
        startTime: roundTime(adj.startTime),
        endTime: roundTime(adj.endTime),
        duration: roundTime(adj.duration),
      },
    }));

    const allUpdates = [currentUpdate, ...subsequentUpdates];

    if (allUpdates.length > 0) {
      updateMultipleSelectedElements(
        allUpdates as Array<{ id: string; updates: Partial<T> }>
      );
    }
  }

  return {
    updateElementTimeProperties,
    updateMultipleElementsTimeProperties,
  };
}
