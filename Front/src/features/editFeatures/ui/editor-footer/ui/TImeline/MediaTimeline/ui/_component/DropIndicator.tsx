"use client";

import React from "react";
import { DropPreview, MoveDragState } from "../../model/types";
import { calculateElementWidth } from "../../lib/timelineLib";

interface DropIndicatorProps {
  dropPreview: DropPreview;
  moveDragState: MoveDragState;
  pixelsPerSecond: number;
}

export function DropIndicator({ dropPreview, moveDragState, pixelsPerSecond }: DropIndicatorProps) {
  if (!dropPreview.isVisible || !moveDragState.isDragging || !dropPreview.elementId) {
    return null;
  }

  // Calculate dimensions for the preview
  const duration = moveDragState.originalEndTime - moveDragState.originalStartTime;
  const width = calculateElementWidth(0, duration, pixelsPerSecond);
  const leftPosition = dropPreview.targetTime * pixelsPerSecond;

  const previewStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
  };

  return (
    <div
      className="absolute top-2 h-12 bg-blue-500 bg-opacity-50 border-2 border-blue-400 border-dashed rounded pointer-events-none z-10 flex items-center justify-center"
      style={previewStyles}
    >
      <span className="text-white text-xs font-medium opacity-80">
        Drop here
      </span>
    </div>
  );
}