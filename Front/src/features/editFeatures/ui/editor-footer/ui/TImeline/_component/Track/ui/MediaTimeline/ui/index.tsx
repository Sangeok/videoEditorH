"use client";

import React, { useRef } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
// import { useMediaDrag } from "../model/hooks/useMediaDrag";
// import { useMediaMove } from "../model/hooks/useMediaMove";
import {
  ResizeDragState,
  MoveDragState,
  DropPreview,
} from "../../../model/types";
import { MediaElement as MediaElementType } from "@/entities/media/types";
import { useTrackElementDrag } from "../../../model/hooks/useTrackElementDrag";
import { useTrackElementMove } from "../../../model/hooks/useTrackElementMove";
import { useTrackElementInteraction } from "../../../model/hooks/useTrackElementInteraction";
import { EmptyState } from "../../_component/EmptyState";
import { DropIndicator } from "../../_component/DropIndicator";
import { MediaElement } from "./_component/MediaElement";

export default function MediaTimeline() {
  const {
    media,
    updateMediaElement,
    deleteMediaElement,
    updateMultipleMediaElements,
  } = useMediaStore();
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  // const { dragState, handleResizeStart } = useMediaDrag();
  const { dragState, handleResizeStart } = useTrackElementDrag({
    SelectedElements: media.mediaElement,
    updateSelectedElements: updateMediaElement,
    updateMultipleSelectedElements: updateMultipleMediaElements,
  });
  const { moveDragState, dropPreview, handleMoveStart } = useTrackElementMove({
    SelectedElements: media.mediaElement,
    updateSelectedElements: updateMediaElement,
  });
  const { handleTrackElementClick } = useTrackElementInteraction({
    deleteSelectedElements: deleteMediaElement,
  });
  // const { moveDragState, dropPreview, handleMoveStart } = useMediaMove();
  // const { handleMediaClick } = useMediaInteraction();

  const timelineRef = useRef<HTMLDivElement>(null);

  // Check if media elements exist
  const hasMediaElements = media.mediaElement.length > 0;

  return (
    <div ref={timelineRef} className="relative w-full h-full bg-zinc-900">
      {hasMediaElements && (
        <MediaElementsContainer
          mediaElements={media.mediaElement}
          pixelsPerSecond={pixelsPerSecond}
          dragState={dragState}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
          onResizeStart={handleResizeStart}
          onMoveStart={handleMoveStart}
          onTrackElementClick={handleTrackElementClick}
        />
      )}
      {!hasMediaElements && <EmptyState />}
    </div>
  );
}

// Separated container component for media elements
function MediaElementsContainer({
  mediaElements,
  pixelsPerSecond,
  dragState,
  moveDragState,
  dropPreview,
  onResizeStart,
  onMoveStart,
  onTrackElementClick,
}: {
  mediaElements: MediaElementType[];
  pixelsPerSecond: number;
  dragState: ResizeDragState;
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

      {/* Media elements */}
      {mediaElements.map((mediaElement) => (
        <MediaElement
          key={mediaElement.id}
          mediaElement={mediaElement}
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
