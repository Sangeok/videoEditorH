"use client";

import { memo, useRef, useEffect, useMemo } from "react";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { useCurrentTimeIndicator } from "./useCurrentTimeIndicator";

const CurrentTimeIndicator = memo(() => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;

  // currentTimeIndicator 위치 정보만 사용
  const { currentTimePosition, leftPosition } = useCurrentTimeIndicator();

  // Timeline 컨테이너와 ruler에 data 속성 추가 (DOM 쿼리용)
  useEffect(() => {
    const timelineContainer = document.querySelector(
      ".relative.flex-1.flex.flex-col.border.border-gray-700.overflow-x-auto"
    );
    if (timelineContainer) {
      timelineContainer.setAttribute("data-timeline-container", "true");
    }

    const ruler =
      document.querySelector('[class*="ruler"]') ||
      document.querySelector(".border-b") ||
      document.querySelector(".bg-gray-800");
    if (ruler) {
      ruler.setAttribute("data-timeline-ruler", "true");
    }
  }, []);

  // 전체 높이 계산 (ruler + tracks 영역)
  const totalHeight = useMemo(() => {
    const rulerHeight = 32; // TimelineRuler 기본 높이
    const tracksHeight = 100; // TextTimeline 최소 높이
    return rulerHeight + tracksHeight;
  }, []);

  // 기본 스타일 계산
  const indicatorStyle = useMemo(
    () => ({
      transform: `translateX(${leftPosition}px)`,
      height: `${totalHeight}px`,
    }),
    [leftPosition, totalHeight]
  );

  // 에러 처리 및 경계값 검증
  if (duration <= 0) {
    return null; // 비디오가 없으면 currentTimeIndicator 숨김
  }

  if (currentTimePosition < 0 || leftPosition < 0) {
    return null; // 잘못된 위치 값은 렌더링하지 않음
  }

  return (
    <div
      ref={indicatorRef}
      className="absolute pointer-events-none z-[150]"
      style={{
        left: "0px", // transform으로 위치 조정하므로 기본값
        top: "0px",
        width: "2px",
        ...indicatorStyle,
      }}
    >
      {/* 세로 라인 */}
      <div
        className="absolute left-0 w-0.5 h-full bg-white shadow-md"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* 상단 원형 표시 */}
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
