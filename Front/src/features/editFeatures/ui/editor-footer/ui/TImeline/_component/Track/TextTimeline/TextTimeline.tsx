"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useTrackElementDrag } from "../model/hooks/useTrackElementDrag";
import { useTrackElementMove } from "../model/hooks/useTrackElementMove";
import { useRef } from "react";
import { EmptyState } from "../ui/EmptyState";
import { useTrackElementInteraction } from "../model/hooks/useTrackElementInteraction";
import { TextElement as TextElementType } from "@/entities/media/types";
import { DropIndicator } from "../ui/DropIndicator";
import TextElement from "./TextElement";
import { DropPreview, MoveDragState } from "../model/types";

export default function TextTimeline() {
  const {
    media,
    updateTextElement,
    deleteTextElement,
    updateMultipleTextElements,
  } = useMediaStore();

  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const { dragState, handleResizeStart } = useTrackElementDrag({
    SelectedElements: media.textElement,
    updateSelectedElements: updateTextElement,
    updateMultipleSelectedElements: updateMultipleTextElements,
  });

  const { moveDragState, dropPreview, handleMoveStart } = useTrackElementMove({
    SelectedElements: media.textElement,
    updateSelectedElements: updateTextElement,
  });

  const { handleTrackElementClick } = useTrackElementInteraction({
    deleteSelectedElements: deleteTextElement,
  });

  const timelineRef = useRef<HTMLDivElement>(null);

  const hasTextElements = media.textElement.length > 0;

  return (
    <div ref={timelineRef} className="relative w-full h-full bg-zinc-900">
      {hasTextElements && (
        <TextElementsContainer
          textElements={media.textElement}
          pixelsPerSecond={pixelsPerSecond}
          dragState={dragState}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
          onResizeStart={handleResizeStart}
          onMoveStart={handleMoveStart}
          onTrackElementClick={handleTrackElementClick}
        />
      )}
      {!hasTextElements && <EmptyState />}
    </div>
  );
}

// Separated container component for text elements
function TextElementsContainer({
  textElements,
  pixelsPerSecond,
  dragState,
  moveDragState,
  dropPreview,
  onResizeStart,
  onMoveStart,
  onTrackElementClick,
}: {
  textElements: TextElementType[];
  pixelsPerSecond: number;
  dragState: MoveDragState;
  moveDragState: MoveDragState;
  dropPreview: DropPreview;
  onResizeStart: (
    e: React.MouseEvent,
    elementId: string,
    dragType: "left" | "right"
  ) => void;
  onMoveStart: (e: React.MouseEvent, elementId: string) => void;
  onTrackElementClick: (trackElementId: string) => void;
}) {
  return (
    <div className="relative h-full">
      {/* Drop indicator for move preview */}
      <DropIndicator
        dropPreview={dropPreview}
        moveDragState={moveDragState}
        pixelsPerSecond={pixelsPerSecond}
      />

      {/* Text elements */}
      {textElements.map((textElement) => (
        <TextElement
          key={textElement.id}
          textElement={textElement}
          pixelsPerSecond={pixelsPerSecond}
          dragState={dragState}
          moveDragState={moveDragState}
          onResizeStart={onResizeStart}
          onMoveStart={onMoveStart}
          onClick={onTrackElementClick}
        />
      ))}
    </div>
  );
}
