"use client";

import React, { useRef } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useMediaDrag } from "../model/hooks/useMediaDrag";
import { useMediaInteraction } from "../model/hooks/useMediaInteraction";
import { MediaElement } from "./_component/MediaElement";
import { EmptyState } from "./_component/EmptyState";
import { MediaTimelineProps } from "../model/types";

export default function MediaTimeline({ className }: MediaTimelineProps = {}) {
  const { media } = useMediaStore();
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const { dragState, handleResizeStart } = useMediaDrag();
  const { handleMediaClick } = useMediaInteraction();

  const timelineRef = useRef<HTMLDivElement>(null);

  // Check if media elements exist
  const hasMediaElements = media.mediaElement.length > 0;

  return (
    <div ref={timelineRef} className={`relative w-full h-full bg-zinc-900 ${className || ""}`}>
      {hasMediaElements && (
        <MediaElementsContainer
          mediaElements={media.mediaElement}
          pixelsPerSecond={pixelsPerSecond}
          dragState={dragState}
          onResizeStart={handleResizeStart}
          onMediaClick={handleMediaClick}
        />
      )}
      {!hasMediaElements && <EmptyState />}
    </div>
  );
}

// Separated container component for media elements
function MediaElementsContainer({
  mediaElements,
  pixelsPerSecond,
  dragState,
  onResizeStart,
  onMediaClick,
}: {
  mediaElements: any[];
  pixelsPerSecond: number;
  dragState: any;
  onResizeStart: (e: React.MouseEvent, elementId: string, dragType: "left" | "right") => void;
  onMediaClick: (mediaElement: any) => void;
}) {
  return (
    <div className="relative h-full">
      {mediaElements.map((mediaElement) => (
        <MediaElement
          key={mediaElement.id}
          mediaElement={mediaElement}
          pixelsPerSecond={pixelsPerSecond}
          dragState={dragState}
          onResizeStart={onResizeStart}
          onClick={onMediaClick}
        />
      ))}
    </div>
  );
}
