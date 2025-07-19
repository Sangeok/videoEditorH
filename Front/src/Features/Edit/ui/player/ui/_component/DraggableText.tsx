"use client";

import { useState, useCallback, useEffect } from "react";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { TextElement } from "@/src/entities/media/types";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";

interface DraggableTextProps {
  element: TextElement;
  children: React.ReactNode;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
}

export default function DraggableText({ element, children }: DraggableTextProps) {
  const { updateTextElement } = useMediaStore();
  const { isPlaying } = useTimelineStore();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying) return;

      e.preventDefault();
      e.stopPropagation();

      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: element.positionX,
        startPosY: element.positionY,
      });
    },
    [isPlaying, element.positionX, element.positionY]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      const scaleX = 1080 / 225;
      const scaleY = 1920 / ((225 * 1920) / 1080);

      // 경계 제한 제거 - 자유로운 이동 허용
      const newPosX = dragState.startPosX + deltaX * scaleX;
      const newPosY = dragState.startPosY + deltaY * scaleY;

      updateTextElement(element.id, {
        positionX: newPosX,
        positionY: newPosY,
      });
    },
    [dragState, updateTextElement, element.id]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0,
    });
  }, []);

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${element.positionX}px`,
        top: `${element.positionY}px`,
        // 자동 크기 조정 - 핵심 수정사항
        width: "fit-content",
        height: "auto",
        fontSize: `${element.fontSize}px`,
        fontFamily: element.font,
        color: element.textColor,
        backgroundColor: element.backgroundColor,
        display: "inline-block",
        padding: "10px",
        whiteSpace: "nowrap",
        borderRadius: "4px",
        boxSizing: "border-box",
        cursor: isPlaying ? "default" : isHovered ? "grab" : dragState.isDragging ? "grabbing" : "grab",
        border: !isPlaying && (isHovered || dragState.isDragging) ? "1px solid #ffffff" : "none",
        userSelect: "none",
        zIndex: dragState.isDragging ? 1001 : 1000,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => !isPlaying && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}
