"use client";

import { memo, useMemo } from "react";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";

const CurrentTimeIndicator = memo(() => {
  const { currentTime, pixelsPerSecond, isPlaying } = useTimelineStore();

  const currentTimePosition = useMemo(() => {
    return currentTime * pixelsPerSecond;
  }, [currentTime, pixelsPerSecond]);

  const indicatorStyle = useMemo(
    () => ({
      left: `${currentTimePosition}px`,
    }),
    [currentTimePosition]
  );

  return (
    <div
      className={`
        absolute top-0 w-0.5 h-full bg-white/70 z-20 pointer-events-none
        transform-gpu will-change-transform
        ${
          isPlaying
            ? "transition-[left] duration-75 ease-linear"
            : "transition-[left] duration-200 ease-out"
        }
      `}
      style={indicatorStyle}
    >
      <div className="absolute -top-1 w-3 h-3 bg-white/70 rounded-full" />
    </div>
  );
});

CurrentTimeIndicator.displayName = "CurrentTimeIndicator";

export default CurrentTimeIndicator;
