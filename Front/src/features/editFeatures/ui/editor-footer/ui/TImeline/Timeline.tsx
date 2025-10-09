"use client";

import { useEffect, useMemo, useRef } from "react";
import TimelineRuler from "./_component/TimelineRuler/TimelineRuler";
import CurrentTimeIndicator from "./_component/CurrentTimeIndicator/ui/CurrentTimeIndicator";

import SnapGuideIndicator from "./_component/SnapGuide/SnapGuideIndicator";
import TextTrack from "./_component/Track/ui/TextTrack/ui/TextTrack";
import MediaTrack from "./_component/Track/ui/MediaTrack/ui";
import AudioTrack from "./_component/Track/ui/AudioTrack/ui/AudioTrack";
import DeleteSelectedElementListener from "./_component/DeleteSelectedElementListener";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { media } = useMediaStore();

  const { pixelsPerSecond, timelineWidth, setTimelineWidth, setViewportFromContainer } = useTimelineStore();

  // total timeline pixel length (content width)
  const contentWidth = useMemo(() => {
    const duration = media.projectDuration || 0;
    const totalPx = duration * pixelsPerSecond;
    // container can be shorter, so ensure minimum value
    return Math.max(totalPx, timelineWidth);
  }, [media.projectDuration, pixelsPerSecond, timelineWidth]);

  // measure container initial/resize and sync viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateFromContainer = () => {
      setTimelineWidth(el.clientWidth);
      setViewportFromContainer(el.scrollLeft, el.clientWidth);
    };

    updateFromContainer();

    const handleScroll = () => setViewportFromContainer(el.scrollLeft, el.clientWidth);
    el.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateFromContainer());
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [setTimelineWidth, setViewportFromContainer]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex flex-col border border-gray-700 overflow-x-auto"
      data-timeline-container="true"
    >
      <div className="relative flex h-full flex-col" style={{ width: `${contentWidth}px` }}>
        {/* dynamic ruler */}
        <TimelineRuler />

        {/* main timeline area */}
        <div className="flex-1 bg-black rounded-b">
          {/* area for timeline tracks */}
          <div className="h-full min-h-[100px] relative flex flex-col overflow-y-auto overflow-hidden">
            <div className="flex-1">
              <TextTrack />
            </div>
            <div className="flex-1">
              <MediaTrack />
            </div>
            <div className="flex-1">
              <AudioTrack />
            </div>
            {/* future timeline track components will be rendered here */}
          </div>
        </div>

        <DeleteSelectedElementListener />
        {/* Snap vertical guide overlay (beneath current time indicator) */}
        <SnapGuideIndicator />
        <CurrentTimeIndicator />
      </div>
    </div>
  );
}
