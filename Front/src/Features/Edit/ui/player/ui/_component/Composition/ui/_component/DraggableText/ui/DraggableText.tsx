"use client";

import { useState, useCallback } from "react";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";
import { useSelectedTrackStore } from "@/src/features/Edit/model/store/useSelectedTrackStore";
import { useDragText } from "@/src/features/Edit/model/hooks/useDragText";
import { useTextEdit } from "@/src/features/Edit/model/hooks/useTextEdit";
import { DraggableTextProps, CursorType } from "../model/types";

export default function DraggableText({ element }: DraggableTextProps) {
  const { isPlaying } = useTimelineStore();
  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );
  
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSelect = useCallback(() => {
    setSelectedTrackAndId("Text", element.id);
  }, [setSelectedTrackAndId, element.id]);
  
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
    positionX: element.positionX,
    positionY: element.positionY,
    isPlaying,
    isEditing,
    onSelect: handleSelect,
  });

  // Style calculations
  const showBorder = !isPlaying && (isHovered || dragState.isDragging || isEditing);
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
        display: "inline-block",
        padding: "10px",
        whiteSpace: "nowrap",
        borderRadius: "4px",
        boxSizing: "border-box",
        border: showBorder ? `1px solid ${borderColor}` : "1px solid transparent",
        cursor: getCursor(),
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
            whiteSpace: "nowrap",
          }}
          suppressContentEditableWarning={true}
        />
      ) : (
        <span style={{ whiteSpace: "nowrap" }}>{element.text}</span>
      )}
    </div>
  );
}
