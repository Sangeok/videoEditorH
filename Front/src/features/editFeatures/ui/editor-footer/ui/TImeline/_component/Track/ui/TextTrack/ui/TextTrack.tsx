"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { useTrackElementResizeDrag } from "../../../model/hooks/useTrackElementResizeDrag/useTrackElementResizeDrag";
import { useTrackElementMove } from "../../../model/hooks/useTrackElementMove/useTrackElementMove";
import { EmptyState } from "../../_component/EmptyState";
import { useTrackElementInteraction } from "../../../model/hooks/useTrackElementInteraction";
import { TextElement as TextElementType } from "@/entities/media/types";
import { DropIndicator } from "../../_component/DropIndicator";
import { DropPreview, MoveDragState } from "../../../model/types";
import TextElement from "./_component/TextElement";

export default function TextTrack() {
  const { media, updateTextElement, deleteTextElement, updateMultipleTextElements } = useMediaStore();

  const { dragState, handleResizeStart } = useTrackElementResizeDrag({
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

  const hasTextElements = media.textElement.length > 0;

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {hasTextElements && (
        <TextElementsContainer
          textElements={media.textElement}
          dragState={dragState}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
          onResizeStart={handleResizeStart}
          onMoveStart={handleMoveStart}
          onTrackElementClick={handleTrackElementClick}
        />
      )}
      {!hasTextElements && <EmptyState message="There is no text element." />}
    </div>
  );
}

// Separated container component for text elements
function TextElementsContainer({
  textElements,
  dragState,
  moveDragState,
  dropPreview,
  onResizeStart,
  onMoveStart,
  onTrackElementClick,
}: {
  textElements: TextElementType[];
  dragState: MoveDragState;
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

      {/* Text elements */}
      {textElements.map((textElement) => (
        <TextElement
          key={textElement.id}
          textElement={textElement}
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
