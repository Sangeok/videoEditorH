import { useMediaStore } from "@/entities/media/useMediaStore";
import { useState, useCallback, useEffect } from "react";

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
}

const INITIAL_DRAG_STATE: DragState = {
  isDragging: false,
  startX: 0,
  startY: 0,
  startPosX: 0,
  startPosY: 0,
};

interface UseDragTextProps {
  elementId: string;
  positionX: number;
  positionY: number;
  isPlaying: boolean;
  isEditing: boolean;
  onSelect: () => void;
}

export const useDragText = ({
  elementId,
  positionX,
  positionY,
  isPlaying,
  isEditing,
  onSelect,
}: UseDragTextProps) => {
  const { updateTextElement } = useMediaStore();
  const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying || isEditing) return;

      e.preventDefault();
      e.stopPropagation();

      onSelect();

      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: positionX,
        startPosY: positionY,
      });
    },
    [isPlaying, isEditing, positionX, positionY, onSelect]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || isEditing) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      // Scale factors for coordinate conversion
      const scaleX = 1080 / 225;
      const scaleY = 1920 / ((225 * 1920) / 1080);

      const newPosX = dragState.startPosX + deltaX * scaleX;
      const newPosY = dragState.startPosY + deltaY * scaleY;

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
