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

  const { currentTime, isPlaying, setCurrentTime, setDuration } =
    useTimelineStore();

  // RemotionPlayer와 TimelineStore 동기화
  useEffect(() => {
    if (duration > 0) {
      setDuration(duration);
    }
  }, [duration, setDuration]);

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
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        const timeInSeconds = currentFrame / fps;
        setCurrentTime(timeInSeconds);
      }
    }, 100); // 100ms마다 업데이트

    return () => clearInterval(interval);
  }, [setCurrentTime]);

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

  return (
    <RemotionPlayer
      ref={playerRef}
      component={Composition}
      inputProps={{}}
      durationInFrames={Math.floor(duration * fps) + 1}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={fps}
      style={{ width: "100%", height: "100%" }}
      acknowledgeRemotionLicense={true}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
    />
  );
}
