"use client";

import { memo, useRef, useEffect, useMemo } from "react";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { useTimelinePlayhead } from "./useTimelinePlayhead";

const CurrentTimeIndicator = memo(() => {
  const playheadRef = useRef<HTMLDivElement>(null);
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;

  // 커스텀 훅으로 고급 playhead 기능 사용
  const { playheadPosition, leftPosition, isScrubbing, isDragging, handlePlayheadMouseDown } = useTimelinePlayhead();

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

  // GPU 가속 스타일 계산
  const playheadStyle = useMemo(
    () => ({
      transform: `translateX(${leftPosition}px)`,
      height: `${totalHeight}px`,
      // GPU 가속 및 성능 최적화
      willChange: isScrubbing ? "transform" : "auto",
      backfaceVisibility: "hidden" as const,
      perspective: "1000px",
    }),
    [leftPosition, totalHeight, isScrubbing]
  );

  // 시각적 피드백을 위한 동적 클래스
  const playheadClasses = useMemo(() => {
    const baseClasses = [
      "absolute",
      "pointer-events-auto",
      "z-[150]",
      "cursor-col-resize",
      "transform-gpu", // GPU 가속 강제
    ];

    // 상태별 시각적 피드백
    if (isDragging) {
      baseClasses.push("scale-110", "shadow-lg");
    }

    if (isScrubbing) {
      baseClasses.push("opacity-90");
    }

    return baseClasses.join(" ");
  }, [isDragging, isScrubbing]);

  // 에러 처리 및 경계값 검증
  if (duration <= 0) {
    return null; // 비디오가 없으면 playhead 숨김
  }

  if (playheadPosition < 0 || leftPosition < 0) {
    return null; // 잘못된 위치 값은 렌더링하지 않음
  }

  return (
    <div
      ref={playheadRef}
      className={playheadClasses}
      style={{
        left: "0px", // transform으로 위치 조정하므로 기본값
        top: "0px",
        width: "2px",
        ...playheadStyle,
      }}
      onMouseDown={handlePlayheadMouseDown}
      role="slider"
      aria-label="Timeline playhead"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={playheadPosition}
      tabIndex={0}
    >
      {/* 세로 라인 - GPU 가속 최적화 */}
      <div
        className="absolute left-0 w-0.5 h-full bg-white shadow-md transition-all duration-75 ease-linear"
        style={{
          background: isScrubbing ? "linear-gradient(180deg, #ffffff 0%, #e5e5e5 100%)" : "#ffffff",
          boxShadow: isScrubbing ? "0 0 8px rgba(255, 255, 255, 0.6)" : "0 2px 4px rgba(0, 0, 0, 0.3)",
          willChange: "background, box-shadow",
        }}
      />

      {/* 상단 원형 표시 - 향상된 시각적 피드백 */}
      <div
        className="absolute top-1 left-1/2 transform -translate-x-1/2 rounded-full border-2 transition-all duration-75 ease-linear"
        style={{
          width: isDragging ? "14px" : "12px",
          height: isDragging ? "14px" : "12px",
          backgroundColor: isScrubbing ? "#ffffff" : "#f0f0f0",
          borderColor: isScrubbing ? "#ffffff" : "#cccccc",
          boxShadow: isDragging ? "0 4px 12px rgba(255, 255, 255, 0.4)" : "0 2px 6px rgba(0, 0, 0, 0.2)",
          willChange: "width, height, background-color, border-color, box-shadow",
        }}
      />

      {/* 스크러빙 시 시간 표시 */}
      {isScrubbing && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded shadow-lg"
          style={{
            whiteSpace: "nowrap",
            fontFamily: "monospace",
            willChange: "opacity",
          }}
        >
          {Math.max(0, playheadPosition).toFixed(2)}s
        </div>
      )}
    </div>
  );
});

CurrentTimeIndicator.displayName = "CurrentTimeIndicator";

export default CurrentTimeIndicator;
