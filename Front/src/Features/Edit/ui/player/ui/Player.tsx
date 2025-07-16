"use client";

import { useRef, useEffect } from "react";
import { Player as RemotionPlayer, PlayerRef } from "@remotion/player";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";
import Composition from "./_component/Sequence/Composition";

const fps = 30;

export default function Player() {
  const playerRef = useRef<PlayerRef>(null);
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;

  const { currentTime, isPlaying, setCurrentTime } = useTimelineStore();

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

  // Timeline의 currentTime에 따라 RemotionPlayer 시간 이동
  useEffect(() => {
    if (playerRef.current) {
      const frameToSeek = Math.floor(currentTime * fps);
      playerRef.current.seekTo(frameToSeek);
    }
  }, [currentTime]);

  // 플레이어 상태를 주기적으로 동기화
  useEffect(() => {
    if (!isPlaying) return;

    let lastUpdateTime = -1; // 이전 값 추적

    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        const timeInSeconds = currentFrame / fps;

        // 소수점 2자리로 반올림하여 정밀도 최적화
        const roundedTime = Math.round(timeInSeconds * 100) / 100;

        // 값이 실제로 변경될 때만 업데이트
        if (roundedTime !== lastUpdateTime) {
          lastUpdateTime = roundedTime;
          setCurrentTime(roundedTime);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      lastUpdateTime = -1;
    };
  }, [setCurrentTime, isPlaying]);

  if (duration === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-2xl font-bold">No media</div>
        <div className="text-sm text-gray-500">
          Please add media to the project
        </div>
      </div>
    );
  }

  // height가 최소 400을 가지게 해야함. 그래야 화면 비율이 맞음. 근데 현재는 height 400을 가지면 짤림.
  return (
    <RemotionPlayer
      ref={playerRef}
      component={Composition}
      inputProps={{ textElements: media.textElement || [] }}
      durationInFrames={Math.floor(duration * fps) + 1}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={fps}
      style={{
        width: "225px",
        height: "400px",
        border: "2px solid #333",
        borderRadius: "10px",
      }}
      acknowledgeRemotionLicense={true}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
    />
  );
}
