"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useRef } from "react";
import { AudioElement as AudioElementType } from "@/entities/media/types";
import { useTrackElementDrag } from "../../../model/hooks/useTrackElementDrag";
import { useTrackElementMove } from "../../../model/hooks/useTrackElementMove/useTrackElementMove";
import { useTrackElementInteraction } from "../../../model/hooks/useTrackElementInteraction";
import { EmptyState } from "../../_component/EmptyState";
import { DropPreview, MoveDragState } from "../../../model/types";
import { DropIndicator } from "../../_component/DropIndicator";
import AudioElement from "./AudioElement";

export default function AudioTimeline() {
  const {
    media,
    updateAudioElement,
    deleteAudioElement,
    updateMultipleAudioElements,
  } = useMediaStore();

  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const { dragState, handleResizeStart } = useTrackElementDrag({
    SelectedElements: media.audioElement,
    updateSelectedElements: updateAudioElement,
    updateMultipleSelectedElements: updateMultipleAudioElements,
  });

  const { moveDragState, dropPreview, handleMoveStart } = useTrackElementMove({
    SelectedElements: media.audioElement,
    updateSelectedElements: updateAudioElement,
  });

  const { handleTrackElementClick } = useTrackElementInteraction({
    deleteSelectedElements: deleteAudioElement,
  });

  const timelineRef = useRef<HTMLDivElement>(null);

  const hasAudioElements = media.audioElement.length > 0;

  return (
    <div ref={timelineRef} className="relative w-full h-full bg-zinc-900">
      {hasAudioElements && (
        <AudioElementsContainer
          audioElements={media.audioElement}
          pixelsPerSecond={pixelsPerSecond}
          dragState={dragState}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
          onResizeStart={handleResizeStart}
          onMoveStart={handleMoveStart}
          onTrackElementClick={handleTrackElementClick}
        />
      )}
      {!hasAudioElements && <EmptyState />}
    </div>
  );
}

// Separated container component for audio elements
function AudioElementsContainer({
  audioElements,
  pixelsPerSecond,
  dragState,
  moveDragState,
  dropPreview,
  onResizeStart,
  onMoveStart,
  onTrackElementClick,
}: {
  audioElements: AudioElementType[];
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

      {/* Audio elements */}
      {audioElements.map((audioElement) => (
        <AudioElement
          key={audioElement.id}
          audioElement={audioElement}
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
