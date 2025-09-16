"use client";

import { memo } from "react";
import { useSnapGuideStore } from "@/features/editFeatures/model/store/useSnapGuideStore";

/**
 * Vertical snap guide overlay spanning the whole timeline area.
 * Render under CurrentTimeIndicator (z-index lower than 150) but above tracks.
 */
const SnapGuideIndicator = memo(() => {
  const { isVisible, xPositionPx } = useSnapGuideStore();

  if (!isVisible || xPositionPx == null) return null;

  return (
    <div
      className="absolute pointer-events-none z-[140]"
      style={{
        left: 0,
        top: 0,
        width: 2,
        height: "100%",
        transform: `translateX(${xPositionPx}px)`,
      }}
    >
      <div
        className="absolute left-0 h-full"
        style={{
          width: 1,
          background: "#9370DB",
          boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
          opacity: 0.9,
        }}
      />
    </div>
  );
});

SnapGuideIndicator.displayName = "SnapGuideIndicator";

export default SnapGuideIndicator;
