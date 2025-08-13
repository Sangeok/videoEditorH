"use client";

import { useEffect, useMemo } from "react";
import useTimelineStore, { TimelineStore } from "@/src/features/Edit/model/store/useTimelineStore";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

// 고정밀 타이머 (id)
let playbackTimer: number | null = null;

const startTimer = (store: () => TimelineStore) => {
  if (playbackTimer) cancelAnimationFrame(playbackTimer);
  let lastUpdate = performance.now();

  const updateTime = () => {
    const state = store();
    if (state.isPlaying) {
      const now = performance.now();
      const delta = (now - lastUpdate) / 1000; // 밀리초 → 초 변환
      lastUpdate = now;

      const newTime = state.currentTime + delta;
      const { media } = useMediaStore.getState();
      const duration = media.projectDuration || 0;

      if (newTime < duration) {
        state.setCurrentTime(newTime);
        playbackTimer = requestAnimationFrame(updateTime);
      } else {
        state.setCurrentTime(duration);
        state.setIsPlaying(false);
      }
    }
  };

  playbackTimer = requestAnimationFrame(updateTime);
};

const stopTimer = () => {
  if (playbackTimer) {
    cancelAnimationFrame(playbackTimer);
    playbackTimer = null;
  }
};

export const useCurrentTimeIndicator = () => {
  const { currentTime, pixelsPerSecond, isPlaying } = useTimelineStore();

  // 고정밀 타이머 관리
  useEffect(() => {
    if (isPlaying) {
      startTimer(useTimelineStore.getState);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isPlaying]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // currentTimeIndicator 위치 계산
  // currentTimeIndicator : 현재 재생 시간 (초 단위)
  const currentTimePosition = useMemo(() => {
    return currentTime;
  }, [currentTime]);

  // currentTimeIndicator Pixel position
  const leftPosition = useMemo(() => {
    return currentTimePosition * pixelsPerSecond;
  }, [currentTimePosition, pixelsPerSecond]);

  // 자동 스크롤 시스템
  useEffect(() => {
    // DOM 쿼리로 timeline container 찾기
    const container = document.querySelector("[data-timeline-container]") as HTMLDivElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const indicatorPx = leftPosition;

    // 100px 버퍼로 예측적 스크롤
    const bufferZone = 100;
    const shouldScrollLeft = indicatorPx < scrollLeft + bufferZone;
    const shouldScrollRight = indicatorPx > scrollLeft + containerWidth - bufferZone;

    if (shouldScrollLeft || shouldScrollRight) {
      const targetScroll = Math.max(0, indicatorPx - containerWidth / 2);
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, [leftPosition]);

  return {
    currentTimePosition,
    leftPosition,
  };
};