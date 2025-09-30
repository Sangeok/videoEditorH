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
 * synchronize timeline and player
 * handle currentTime synchronization and periodic state updates
 */
export const usePlayerSync = ({ playerRef, fps }: UsePlayerSyncProps) => {
  const { currentTime, isPlaying, setCurrentTime } = useTimelineStore();
  const lastUpdateTimeRef = useRef<number>(-1);
  // flag to check if the update comes from the player
  const isUpdatingFromPlayerRef = useRef<boolean>(false);

  // synchronize player based on timeline's currentTime
  // Works when stopping the player and dragging the timeline
  useEffect(() => {
    // don't seek if the update comes from the player
    // prevent circular reference
    if (isUpdatingFromPlayerRef.current) {
      isUpdatingFromPlayerRef.current = false;
      return;
    }

    if (playerRef.current && !isPlaying) {
      const frameToSeek = PlayerService.timeToFrame(currentTime, fps);
      const currentFrame = playerRef.current.getCurrentFrame();
      // only seek if the current frame is different
      if (Math.abs(currentFrame - frameToSeek) > 1) {
        playerRef.current.seekTo(frameToSeek);
      }
    }
  }, [currentTime, fps, playerRef, isPlaying]);

  // synchronize player state periodically
  // synchronize timeline based on player's currentTime
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        const timeInSeconds = PlayerService.frameToTime(currentFrame, fps);
        const roundedTime = PlayerService.roundTime(timeInSeconds);

        // only update if the value actually changed
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
