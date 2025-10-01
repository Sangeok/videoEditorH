"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { PLAYER_CONFIG } from "@/features/editFeatures/ui/player/config/playerConfig";
import { useState, useCallback, useEffect } from "react";

interface DragState {
  isDragging: boolean;
  initialClientX: number;
  initialClientY: number;
  initialCanvasX: number;
  initialCanvasY: number;
}

const INITIAL_DRAG_STATE: DragState = {
  isDragging: false,
  initialClientX: 0,
  initialClientY: 0,
  initialCanvasX: 0,
  initialCanvasY: 0,
};

interface UseDragTextProps {
  elementId: string;
  currentCanvasX: number;
  currentCanvasY: number;
  isPlaying: boolean;
  isEditing: boolean;
}

export const useDragText = ({
  elementId,
  currentCanvasX,
  currentCanvasY,
  isPlaying,
  isEditing,
}: UseDragTextProps) => {
  const { updateTextElement } = useMediaStore();
  const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);

  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );

  const handleSelect = useCallback(() => {
    setSelectedTrackAndId("Text", elementId);
  }, [setSelectedTrackAndId, elementId]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying || isEditing) return;

      e.preventDefault();
      e.stopPropagation();

      handleSelect();

      setDragState({
        isDragging: true,
        initialClientX: e.clientX,
        initialClientY: e.clientY,
        initialCanvasX: currentCanvasX,
        initialCanvasY: currentCanvasY,
      });
    },
    [isPlaying, isEditing, currentCanvasX, currentCanvasY, handleSelect]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || isEditing) return;

      const deltaX = e.clientX - dragState.initialClientX;
      const deltaY = e.clientY - dragState.initialClientY;

      // Convert viewer coordinates to composition coordinates using centralized scale factors
      const newPosX = dragState.initialCanvasX + deltaX * PLAYER_CONFIG.SCALE_X;
      const newPosY = dragState.initialCanvasY + deltaY * PLAYER_CONFIG.SCALE_Y;

      updateTextElement(elementId, {
        positionX: newPosX,
        positionY: newPosY,
      });
    },
    [dragState, updateTextElement, elementId, isEditing]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(INITIAL_DRAG_STATE);
  }, []);

  useEffect(() => {
    if (dragState.isDragging && !isEditing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp, isEditing]);

  return {
    dragState,
    handleMouseDown,
  };
};
