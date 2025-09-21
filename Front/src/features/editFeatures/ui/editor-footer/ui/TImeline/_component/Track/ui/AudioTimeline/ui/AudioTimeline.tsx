"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { AudioElement as AudioElementType } from "@/entities/media/types";
import { useTrackElementMove } from "../../../model/hooks/useTrackElementMove/useTrackElementMove";
import { useTrackElementInteraction } from "../../../model/hooks/useTrackElementInteraction";
import { EmptyState } from "../../_component/EmptyState";
import { DropPreview, MoveDragState } from "../../../model/types";
import { DropIndicator } from "../../_component/DropIndicator";
import AudioElement from "./_component/AudioElement/ui/AudioElement";

export default function AudioTimeline() {
  const { media, updateAudioElement, deleteAudioElement } = useMediaStore();

  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const { moveDragState, dropPreview, handleMoveStart } = useTrackElementMove({
    SelectedElements: media.audioElement,
    updateSelectedElements: updateAudioElement,
  });

  const { handleTrackElementClick } = useTrackElementInteraction({
    deleteSelectedElements: deleteAudioElement,
  });

  const hasAudioElements = media.audioElement.length > 0;

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {hasAudioElements && (
        <AudioElementsContainer
          audioElements={media.audioElement}
          pixelsPerSecond={pixelsPerSecond}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
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
  moveDragState,
  dropPreview,
  onMoveStart,
  onTrackElementClick,
}: {
  audioElements: AudioElementType[];
  pixelsPerSecond: number;
  moveDragState: MoveDragState;
  dropPreview: DropPreview;
  onMoveStart: (e: React.MouseEvent, elementId: string) => void;
  onTrackElementClick: (trackElementId: string) => void;
}) {
  return (
    <div className="relative h-full">
      {/* Drop indicator for move preview */}
      <DropIndicator dropPreview={dropPreview} moveDragState={moveDragState} pixelsPerSecond={pixelsPerSecond} />

      {/* Audio elements */}
      {audioElements.map((audioElement) => (
        <AudioElement
          key={audioElement.id}
          audioElement={audioElement}
          pixelsPerSecond={pixelsPerSecond}
          moveDragState={moveDragState}
          onMoveStart={onMoveStart}
          onClick={onTrackElementClick}
        />
      ))}
    </div>
  );
}
