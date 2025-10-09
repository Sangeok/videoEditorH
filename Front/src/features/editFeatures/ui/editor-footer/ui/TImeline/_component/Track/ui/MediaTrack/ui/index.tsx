"use client";

import React from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { ResizeDragState, MoveDragState, DropPreview } from "../../../model/types";
import { MediaElement as MediaElementType } from "@/entities/media/types";
import { useTrackElementResizeDrag } from "../../../model/hooks/useTrackElementResizeDrag/useTrackElementResizeDrag";
import { useTrackElementMove } from "../../../model/hooks/useTrackElementMove/useTrackElementMove";
import { useTrackElementInteraction } from "../../../model/hooks/useTrackElementInteraction";
import { EmptyState } from "../../_component/EmptyState";
import { DropIndicator } from "../../_component/DropIndicator";
import { MediaElement } from "./_component/MediaElement/ui/MediaElement";

export default function MediaTrack({ laneId }: { laneId: string }) {
  const { media, updateMediaElement, deleteMediaElement, updateMultipleMediaElements } = useMediaStore();

  const { dragState, handleResizeStart } = useTrackElementResizeDrag({
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

  // Filter by lane
  const elementsInLane = media.mediaElement.filter((el) => (el.laneId ?? "media-0") === laneId);
  const hasMediaElements = elementsInLane.length > 0;

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {hasMediaElements && (
        <MediaElementsContainer
          mediaElements={elementsInLane}
          dragState={dragState}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
          onResizeStart={handleResizeStart}
          onMoveStart={handleMoveStart}
          onTrackElementClick={handleTrackElementClick}
        />
      )}
      {!hasMediaElements && <EmptyState message="There is no media element." />}
    </div>
  );
}

// Separated container component for media elements
function MediaElementsContainer({
  mediaElements,
  dragState,
  moveDragState,
  dropPreview,
  onResizeStart,
  onMoveStart,
  onTrackElementClick,
}: {
  mediaElements: MediaElementType[];
  dragState: ResizeDragState;
  moveDragState: MoveDragState;
  dropPreview: DropPreview;
  onResizeStart: (e: React.MouseEvent, elementId: string, dragType: "left" | "right") => void;
  onMoveStart: (e: React.MouseEvent, elementId: string) => void;
  onTrackElementClick: (trackElementId: string) => void;
}) {
  return (
    <div className="relative h-full">
      {/* Drop indicator for move preview */}
      <DropIndicator dropPreview={dropPreview} moveDragState={moveDragState} />

      {/* Media elements */}
      {mediaElements.map((mediaElement) => (
        <MediaElement
          key={mediaElement.id}
          mediaElement={mediaElement}
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
