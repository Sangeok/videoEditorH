"use client";

import React from "react";
import { MediaElement as MediaElementType } from "@/entities/media/types";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { DragState, DragType } from "../../model/types";
import { ResizeHandle } from "./ResizeHandle";
import {
  calculateTimelinePosition,
  calculateElementWidth,
  isElementDragging,
  formatTimeDisplay,
} from "../../lib/timelineLib";

interface MediaElementProps {
  mediaElement: MediaElementType;
  pixelsPerSecond: number;
  dragState: DragState;
  onResizeStart: (e: React.MouseEvent, elementId: string, dragType: DragType) => void;
  onClick: (mediaElement: MediaElementType) => void;
}

export function MediaElement({ mediaElement, pixelsPerSecond, dragState, onResizeStart, onClick }: MediaElementProps) {
  const selectedTrackId = useSelectedTrackStore((state) => state.selectedTrackId);

  // Calculate position and dimensions
  const leftPosition = calculateTimelinePosition(mediaElement.startTime, pixelsPerSecond);
  const width = calculateElementWidth(mediaElement.startTime, mediaElement.endTime, pixelsPerSecond);

  // Check drag state
  const isDragging = isElementDragging(mediaElement.id, dragState);
  const isSelected = selectedTrackId === mediaElement.id;

  // Generate styles
  const elementStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
  };

  const elementClasses = getElementClasses(isDragging);
  const title = generateElementTitle(mediaElement);

  return (
    <div className={elementClasses} style={elementStyles} onClick={() => onClick(mediaElement)} title={title}>
      {/* Left resize handle */}
      <ResizeHandle
        position="left"
        isVisible={isSelected}
        onMouseDown={(e) => onResizeStart(e, mediaElement.id, "left")}
      />

      {/* Media content */}
      <span className="truncate px-3 pointer-events-none">{mediaElement.id || "Media"}</span>

      {/* Right resize handle */}
      <ResizeHandle
        position="right"
        isVisible={isSelected}
        onMouseDown={(e) => onResizeStart(e, mediaElement.id, "right")}
      />
    </div>
  );
}

function getElementClasses(isDragging: boolean): string {
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
  ];

  const cursorClass = isDragging ? "cursor-grabbing" : "cursor-pointer";

  return [...baseClasses, cursorClass].join(" ");
}

function generateElementTitle(mediaElement: MediaElementType): string {
  const timeDisplay = formatTimeDisplay(mediaElement.startTime, mediaElement.endTime);
  return `${mediaElement.type} (${timeDisplay})`;
}
