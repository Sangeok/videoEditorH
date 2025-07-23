"use client";

import { useRef, useEffect, RefObject } from "react";
import { PlayerRef } from "@remotion/player";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";
import { PlayerService } from "../services/playerService";

interface UsePlayerControllerReturn {
  playerRef: RefObject<PlayerRef | null>; // null 허용으로 변경
  play: () => void;
  pause: () => void;
  seekTo: (time: number, fps: number) => void;
}

/**
 * RemotionPlayer 제어를 담당하는 훅
 * 재생/일시정지, 시크 기능을 제공
 */
export const usePlayerController = ({
  projectDuration,
}: {
  projectDuration: number;
}): UsePlayerControllerReturn => {
  const playerRef = useRef<PlayerRef>(null);
  const isPlaying = useTimelineStore((state) => state.isPlaying);

  // Timeline의 재생 상태에 따라 RemotionPlayer 제어
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying]);

  const play = () => {
    if (projectDuration > 0 && playerRef.current) {
      playerRef.current.play();
    }
  };

  const pause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const seekTo = (time: number, fps: number) => {
    if (playerRef.current) {
      const frameToSeek = PlayerService.timeToFrame(time, fps);
      playerRef.current.seekTo(frameToSeek);
    }
  };

  return {
    playerRef,
    play,
    pause,
    seekTo,
  };
};
