"use client";

import { useEffect, useRef, RefObject } from "react";
import { PlayerRef } from "@remotion/player";
import { PlayerService } from "../services/playerService";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";

interface UsePlayerSyncProps {
  playerRef: RefObject<PlayerRef | null>;
  fps: number;
}

/**
 * Timeline과 Player 간의 동기화를 담당하는 훅
 * currentTime 동기화 및 주기적 상태 업데이트 처리
 */
export const usePlayerSync = ({ playerRef, fps }: UsePlayerSyncProps) => {
  const { currentTime, isPlaying, setCurrentTime } = useTimelineStore();
  const lastUpdateTimeRef = useRef<number>(-1);

  // Timeline의 currentTime에 따라 RemotionPlayer 시간 이동
  useEffect(() => {
    if (playerRef.current) {
      const frameToSeek = PlayerService.timeToFrame(currentTime, fps);
      playerRef.current.seekTo(frameToSeek);
    }
  }, [currentTime, fps, playerRef]);

  // 플레이어 상태를 주기적으로 동기화
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        const timeInSeconds = PlayerService.frameToTime(currentFrame, fps);
        const roundedTime = PlayerService.roundTime(timeInSeconds);

        // 값이 실제로 변경될 때만 업데이트
        if (roundedTime !== lastUpdateTimeRef.current) {
          lastUpdateTimeRef.current = roundedTime;
          setCurrentTime(roundedTime);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      lastUpdateTimeRef.current = -1;
    };
  }, [setCurrentTime, isPlaying, fps, playerRef]);
};
