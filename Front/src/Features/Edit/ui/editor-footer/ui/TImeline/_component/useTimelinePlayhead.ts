"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

interface PlayheadState {
  isScrubbing: boolean;
  scrubTime: number | null;
  isDragging: boolean;
}

// 프레임 단위 스냅핑 유틸리티
// 정확한 프레임 매핑을 위함
function snapTimeToFrame(time: number, fps: number): number {
  if (fps <= 0) return time;
  const frame = Math.round(time * fps);
  return frame / fps;
}

// 고정밀 타이머 시스템
let playbackTimer: number | null = null;

const startTimer = (store: () => any) => {
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

export const useTimelinePlayhead = () => {
  const { currentTime, pixelsPerSecond, isPlaying, setCurrentTime } = useTimelineStore();
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;

  const [playheadState, setPlayheadState] = useState<PlayheadState>({
    isScrubbing: false,
    scrubTime: null,
    isDragging: false,
  });

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

  // 정확한 playhead 위치 계산
  const playheadPosition = useMemo(() => {
    return playheadState.isScrubbing && playheadState.scrubTime !== null ? playheadState.scrubTime : currentTime;
  }, [playheadState.isScrubbing, playheadState.scrubTime, currentTime]);

  const leftPosition = useMemo(() => {
    return playheadPosition * pixelsPerSecond;
  }, [playheadPosition, pixelsPerSecond]);

  // 스크러빙 핸들러
  const handleScrub = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      // DOM 쿼리로 ruler 요소 찾기
      const ruler = document.querySelector("[data-timeline-ruler]") as HTMLDivElement;
      if (!ruler) return;

      const rect = ruler.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const rawTime = Math.max(0, Math.min(duration, x / pixelsPerSecond));

      // 프레임 단위 스냅핑 (30fps 기본)
      const fps = 30; // 프로젝트 FPS
      const time = snapTimeToFrame(rawTime, fps);

      setPlayheadState((prev) => ({
        ...prev,
        scrubTime: time,
      }));
    },
    [duration, pixelsPerSecond]
  );

  // 마우스 다운 핸들러
  const handlePlayheadMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setPlayheadState((prev) => ({
        ...prev,
        isScrubbing: true,
        isDragging: true,
      }));

      handleScrub(e);
    },
    [handleScrub]
  );

  // 전역 마우스 이벤트 처리
  useEffect(() => {
    if (!playheadState.isScrubbing) return;

    const onMouseMove = (e: MouseEvent) => {
      handleScrub(e);
    };

    const onMouseUp = () => {
      if (playheadState.scrubTime !== null) {
        setCurrentTime(playheadState.scrubTime);
      }

      setPlayheadState({
        isScrubbing: false,
        scrubTime: null,
        isDragging: false,
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [playheadState.isScrubbing, playheadState.scrubTime, setCurrentTime, handleScrub]);

  // 자동 스크롤 시스템
  useEffect(() => {
    // DOM 쿼리로 timeline container 찾기
    const container = document.querySelector("[data-timeline-container]") as HTMLDivElement;
    if (!container || playheadState.isScrubbing) return;

    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const playheadPx = leftPosition;

    // 100px 버퍼로 예측적 스크롤
    const bufferZone = 100;
    const shouldScrollLeft = playheadPx < scrollLeft + bufferZone;
    const shouldScrollRight = playheadPx > scrollLeft + containerWidth - bufferZone;

    if (shouldScrollLeft || shouldScrollRight) {
      const targetScroll = Math.max(0, playheadPx - containerWidth / 2);
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, [leftPosition, playheadState.isScrubbing]);

  return {
    playheadPosition,
    leftPosition,
    isScrubbing: playheadState.isScrubbing,
    isDragging: playheadState.isDragging,
    handlePlayheadMouseDown,
  };
};
