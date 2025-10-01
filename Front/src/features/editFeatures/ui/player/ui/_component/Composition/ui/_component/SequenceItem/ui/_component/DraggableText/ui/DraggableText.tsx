"use client";

import { useState } from "react";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { DraggableTextProps, CursorType } from "../model/types";
import { useDragText } from "../model/useDragText";
import { useTextEdit } from "../model/useTextEdit";

export default function DraggableText({ element }: DraggableTextProps) {
  const { isPlaying } = useTimelineStore();

  const [isHovered, setIsHovered] = useState(false);

  const {
    isEditing,
    textRef,
    handleDoubleClick,
    handleTextInput,
    handleTextBlur,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  } = useTextEdit({
    elementId: element.id,
    initialText: element.text || "",
    isPlaying,
  });

  // Use drag hook with current editing state
  const { dragState, handleMouseDown } = useDragText({
    elementId: element.id,
    currentCanvasX: element.positionX,
    currentCanvasY: element.positionY,
    isPlaying,
    isEditing,
  });

  // Style calculations
  const showBorder =
    !isPlaying && (isHovered || dragState.isDragging || isEditing);
  const borderColor = isEditing ? "#3b82f6" : "#ffffff";
  const getCursor = (): CursorType => {
    if (isPlaying) return "default";
    if (isEditing) return "text";
    if (dragState.isDragging) return "grabbing";
    if (isHovered) return "grab";
    return "grab";
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${element.positionX}px`,
        top: `${element.positionY}px`,
        width: "fit-content",
        height: "auto",
        maxWidth: element?.maxWidth ? element?.maxWidth : "",
        display: "inline-block",
        padding: "10px",
        whiteSpace: element?.whiteSpace ? element?.whiteSpace : "nowrap", // pre-wrap에서 nowrap으로 변경
        borderRadius: "4px",
        boxSizing: "border-box",
        border: showBorder
          ? `1px solid ${borderColor}`
          : "1px solid transparent",
        cursor: getCursor(),
        textAlign: "center",
        userSelect: isEditing ? "text" : "none",
        zIndex: dragState.isDragging || isEditing ? 1001 : 1000,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.font,
        color: element.textColor,
        backgroundColor: element.backgroundColor,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => !isPlaying && !isEditing && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div
          ref={textRef}
          contentEditable
          onInput={handleTextInput}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          style={{
            height: "100%",
            outline: "none",
            background: "transparent",
            minWidth: "1ch",
            whiteSpace: element?.whiteSpace ? element?.whiteSpace : "nowrap", // pre-wrap에서 nowrap으로 변경
          }}
          suppressContentEditableWarning={true}
        />
      ) : (
        <span
          style={{
            whiteSpace: element?.whiteSpace ? element?.whiteSpace : "nowrap", // pre-wrap에서 nowrap으로 변경
          }}
        >
          {element.text}
        </span>
      )}
    </div>
  );
}
