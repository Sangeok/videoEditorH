"use client";

import React from "react";
import { calculateElementWidth } from "../../lib/timelineLib";
import { DropPreview, MoveDragState } from "../../model/types";

interface DropIndicatorProps {
  dropPreview: DropPreview;
  moveDragState: MoveDragState;
  pixelsPerSecond: number;
}

export function DropIndicator({
  dropPreview,
  moveDragState,
  pixelsPerSecond,
}: DropIndicatorProps) {
  if (
    !dropPreview.isVisible ||
    !moveDragState.isDragging ||
    !dropPreview.elementId
  ) {
    return null;
  }

  // Calculate dimensions for the preview
  const duration =
    moveDragState.originalEndTime - moveDragState.originalStartTime;
  const width = calculateElementWidth(0, duration, pixelsPerSecond);
  // Raw cursor-based position (what user sees under cursor)
  const rawLeftPosition = dropPreview.targetTime * pixelsPerSecond;
  // Resolved non-overlapping position (what will actually be applied on drop)
  const resolvedLeftPosition =
    typeof moveDragState.ghostPosition === "number"
      ? moveDragState.ghostPosition
      : null;
  const showResolved =
    resolvedLeftPosition !== null &&
    Math.abs(resolvedLeftPosition - rawLeftPosition) > 0.5;

  const rawPreviewStyles = {
    left: `${rawLeftPosition}px`,
    width: `${width}px`,
  };

  const resolvedPreviewStyles =
    resolvedLeftPosition !== null
      ? {
          left: `${resolvedLeftPosition}px`,
          width: `${width}px`,
        }
      : undefined;

  return (
    <>
      {/* Raw (cursor) preview */}
      <div
        className="absolute top-2 h-12 bg-blue-500 bg-opacity-50 border-2 border-blue-400 border-dashed rounded pointer-events-none z-20 flex items-center justify-center"
        style={rawPreviewStyles}
      >
        <span className="text-white text-xs font-medium opacity-80">
          Drop here
        </span>
      </div>

      {/* Resolved (will snap) preview */}
      {showResolved && resolvedPreviewStyles && (
        <div
          className="absolute top-2 h-12 bg-green-500 bg-opacity-30 border-2 border-green-400 border-dashed rounded pointer-events-none z-10 flex items-center justify-center"
          style={resolvedPreviewStyles}
        >
          <span className="text-white text-[10px] font-medium opacity-80">
            Will snap
          </span>
        </div>
      )}
    </>
  );
}
