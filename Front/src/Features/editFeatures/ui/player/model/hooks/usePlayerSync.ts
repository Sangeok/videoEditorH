"use client";

import { useEffect, useRef, RefObject } from "react";
import { PlayerRef } from "@remotion/player";
import { PlayerService } from "../services/playerService";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";

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
  const isUpdatingFromPlayerRef = useRef<boolean>(false);

  // Timeline의 currentTime에 따라 RemotionPlayer 시간 이동
  useEffect(() => {
    // 플레이어에서 오는 업데이트인 경우 seek하지 않음
    if (isUpdatingFromPlayerRef.current) {
      isUpdatingFromPlayerRef.current = false;
      return;
    }

    if (playerRef.current && !isPlaying) {
      const frameToSeek = PlayerService.timeToFrame(currentTime, fps);
      const currentFrame = playerRef.current.getCurrentFrame();
      // 현재 프레임과 다를 때만 seek 실행
      if (Math.abs(currentFrame - frameToSeek) > 1) {
        playerRef.current.seekTo(frameToSeek);
      }
    }
  }, [currentTime, fps, playerRef, isPlaying]);

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
          isUpdatingFromPlayerRef.current = true;
          setCurrentTime(roundedTime);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      lastUpdateTimeRef.current = -1;
    };
  }, [isPlaying, fps, playerRef, setCurrentTime]);
};
