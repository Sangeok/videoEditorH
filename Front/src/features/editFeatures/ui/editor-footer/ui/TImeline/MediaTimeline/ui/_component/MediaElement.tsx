"use client";

import React from "react";
import { MediaElement as MediaElementType } from "@/entities/media/types";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { DragState, DragType, MoveDragState } from "../../model/types";
import { ResizeHandle } from "./ResizeHandle";
import {
  calculateTimelinePosition,
  calculateElementWidth,
  isElementDragging,
  formatTimeDisplay,
} from "../../lib/timelineLib";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";

interface MediaElementProps {
  mediaElement: MediaElementType;
  pixelsPerSecond: number;
  dragState: DragState;
  moveDragState?: MoveDragState;
  onResizeStart: (e: React.MouseEvent, elementId: string, dragType: DragType) => void;
  onMoveStart?: (e: React.MouseEvent, elementId: string) => void;
  onClick: (mediaElement: MediaElementType) => void;
}

export function MediaElement({
  mediaElement,
  pixelsPerSecond,
  dragState,
  moveDragState,
  onResizeStart,
  onMoveStart,
  onClick,
}: MediaElementProps) {
  const setSelectedTrackAndId = useSelectedTrackStore((state) => state.setSelectedTrackAndId);
  const isDelete = useTimelineToolStore((state) => state.isDelete);
  const selectedTrackId = useSelectedTrackStore((state) => state.selectedTrackId);

  // Calculate position and dimensions
  const leftPosition = calculateTimelinePosition(mediaElement.startTime, pixelsPerSecond);
  const width = calculateElementWidth(mediaElement.startTime, mediaElement.endTime, pixelsPerSecond);

  // Check drag states
  const isResizeDragging = isElementDragging(mediaElement.id, dragState);
  const isMoveDragging = Boolean(moveDragState?.isDragging && moveDragState.elementId === mediaElement.id);
  const isDragging = isResizeDragging || isMoveDragging;
  const isSelected = selectedTrackId === mediaElement.id;

  // Generate styles with visibility for move dragging
  const elementStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
    opacity: isMoveDragging ? 0.3 : 1, // Make original element semi-transparent during move
  };

  const elementClasses = getElementClasses(isDragging, isMoveDragging);
  const title = generateElementTitle(mediaElement);

  // Handle move drag start on element body
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if this is a move drag (not clicking on resize handles)
    if (!isDelete && onMoveStart && !e.defaultPrevented) {
      // Prevent text selection during move drag
      e.preventDefault();
      onMoveStart(e, mediaElement.id);

      const clickedTrack = mediaElement.type === "video" ? "Video" : "Image";
      setSelectedTrackAndId(clickedTrack, mediaElement.id);
    } else if (!e.defaultPrevented) {
      // Regular click - don't prevent default to allow normal interactions
      onClick(mediaElement);
    }
  };

  return (
    <div className={elementClasses} onMouseDown={handleMouseDown} style={elementStyles} title={title}>
      {/* Left resize handle */}
      <ResizeHandle
        position="left"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, mediaElement.id, "left");
        }}
      />

      <span className="truncate px-3 pointer-events-none select-none">{mediaElement.id || "Media"}</span>
      {/* Media content */}

      {/* Right resize handle */}
      <ResizeHandle
        position="right"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, mediaElement.id, "right");
        }}
      />
    </div>
  );
}

function getElementClasses(isDragging: boolean, isMoveDragging?: boolean): string {
  const baseClasses = [
    "absolute",
    "top-2",
    "h-12",
    "bg-gray-700",
    "border-b-4",
    "hover:bg-gray-800",
    "border-1",
    "border-gray-500",
    "rounded",
    "transition-colors",
    "duration-200",
    "flex",
    "items-center",
    "justify-center",
    "text-white",
    "text-xs",
    "font-medium",
    "overflow-hidden",
    "select-none", // Prevent text selection
    "user-select-none", // Additional browser compatibility
  ];

  // Different cursor styles for different drag states
  let cursorClass: string;
  if (isMoveDragging) {
    cursorClass = "cursor-grabbing";
  } else if (isDragging) {
    cursorClass = "cursor-grabbing"; // resize dragging
  } else {
    cursorClass = "cursor-grab hover:cursor-grab"; // ready to be dragged
  }

  return [...baseClasses, cursorClass].join(" ");
}

function generateElementTitle(mediaElement: MediaElementType): string {
  const timeDisplay = formatTimeDisplay(mediaElement.startTime, mediaElement.endTime);
  return `${mediaElement.type} (${timeDisplay})`;
}
