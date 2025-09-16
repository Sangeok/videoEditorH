"use client";

import { memo, useEffect } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { useCurrentTimeIndicator } from "../model/hooks/useCurrentTimeIndicator";

const CurrentTimeIndicator = memo(() => {
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;

  const { currentTimePosition, leftPosition } = useCurrentTimeIndicator();

  // add data attribute to timeline container and ruler
  useEffect(() => {
    const timelineContainer = document.querySelector(
      ".relative.flex-1.flex.flex-col.border.border-gray-700.overflow-x-auto"
    );
    if (timelineContainer) {
      timelineContainer.setAttribute("data-timeline-container", "true");
    }
  }, []);

  // if there is no duration( any media is not loaded), hide the current time indicator
  if (duration <= 0) {
    return null;
  }

  // if the current time position or left position is less than 0, hide the current time indicator
  if (currentTimePosition < 0 || leftPosition < 0) {
    return null;
  }

  return (
    <div
      className="absolute pointer-events-none z-[150]"
      style={{
        left: "0px",
        top: "0px",
        width: "2px",
        height: "100%",
        transform: `translateX(${leftPosition}px)`,
      }}
    >
      {/* vertical line */}
      <div
        className="absolute left-0 w-0.5 h-full bg-white shadow-md"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          height: "100%",
        }}
      />

      {/* top circular display */}
      <div
        className="absolute top-1 left-1/2 transform -translate-x-1/2 rounded-full border-2"
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "#f0f0f0",
          borderColor: "#cccccc",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        }}
      />
    </div>
  );
});

CurrentTimeIndicator.displayName = "CurrentTimeIndicator";

export default CurrentTimeIndicator;
