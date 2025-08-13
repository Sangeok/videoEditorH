"use client";

import { useEffect, useRef } from "react";
import useTimelineStore from "@/src/features/editFeatures/model/store/useTimelineStore";
import { calculateTicks } from "../../../lib/zoomUtils";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

interface TimelineRulerProps {
  className?: string;
}

export default function TimelineRuler({ className = "" }: TimelineRulerProps) {
  const rulerRef = useRef<HTMLDivElement>(null);

  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;
  const {
    zoom,
    pixelsPerSecond,
    viewportStartTime,
    viewportEndTime,
    setTimelineWidth,
    setCurrentTime,
  } = useTimelineStore();

  // 컴포넌트가 마운트되면 타임라인 너비를 측정하고 store에 저장
  useEffect(() => {
    if (rulerRef.current) {
      const width = rulerRef.current.clientWidth;
      setTimelineWidth(width);
    }
  }, [setTimelineWidth]);

  // 창 크기 변경 시 타임라인 너비 업데이트
  useEffect(() => {
    const handleResize = () => {
      if (rulerRef.current) {
        const width = rulerRef.current.clientWidth;
        setTimelineWidth(width);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setTimelineWidth]);

  // 눈금 계산
  const { majorTicks, minorTicks } = calculateTicks(
    viewportStartTime,
    viewportEndTime,
    zoom,
    pixelsPerSecond
  );

  // 클릭으로 시간 이동
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;

    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickedTime = clickX / pixelsPerSecond;

    // duration 범위 내에서만 이동
    const clampedTime = Math.max(0, Math.min(clickedTime, duration));
    setCurrentTime(clampedTime);
  };

  return (
    <div
      ref={rulerRef}
      className={`relative h-8 bg-black overflow-hidden cursor-pointer ${className}`}
      onClick={handleTimelineClick}
    >
      {/* 배경 */}
      <div className="absolute inset-0 bg-black" />

      {/* 보조 눈금 */}
      {minorTicks.map(
        (tick: { time: number; position: number }, index: number) => (
          <div
            key={`minor-${index}`}
            className="absolute top-4 w-px h-4 bg-gray-600"
            style={{
              left: `${tick.position}px`,
            }}
          />
        )
      )}

      {/* 주 눈금과 시간 라벨 */}
      {majorTicks.map(
        (
          tick: { time: number; position: number; label: string },
          index: number
        ) => (
          <div
            key={`major-${index}`}
            className="absolute top-0 flex flex-col items-center"
            style={{
              left: `${tick.position}px`,
              transform: "translateX(-50%)",
            }}
          >
            {/* 시간 라벨 */}
            <span className="text-xs text-gray-600 mb-1 whitespace-nowrap">
              {tick.label}
            </span>
            {/* 주 눈금 */}
            <div className="w-px h-6 bg-gray-600" />
          </div>
        )
      )}

      {/* 0초 기준선 */}
      <div className="absolute top-0 left-0 w-px h-full bg-white/50" />
    </div>
  );
}
