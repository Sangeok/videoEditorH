"use client";

import { useMemo } from "react";
import { Player as RemotionPlayer } from "@remotion/player";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import Composition from "./_component/Composition/ui";
import { usePlayerController } from "../model/hooks/usePlayerController";
import { usePlayerSync } from "../model/hooks/usePlayerSync";
import { PlayerService } from "../model/services/playerService";
// import NoMediaMessage from "./_component/NoMediaMessage";

/**
 * 비디오 플레이어 컴포넌트
 * RemotionPlayer를 래핑하여 타임라인과 동기화된 재생 기능 제공
 */
export default function Player() {
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;
  const fps = media.fps || 30;
  const projectDuration = media.projectDuration || 0;

  const playerController = usePlayerController({ projectDuration });

  // Timeline과 Player 동기화
  usePlayerSync({
    playerRef: playerController.playerRef,
    fps,
  });

  // Memoize inputProps to prevent unnecessary re-renders
  const inputProps = useMemo(
    () => ({
      textElements: media.textElement || [],
    }),
    [media.textElement]
  );

  // Memoize style object to prevent unnecessary re-renders
  const playerStyle = useMemo(
    () => ({
      width: "225px",
      height: "100%",
      border: "2px solid #333",
      borderRadius: "10px",
      overflow: "hidden",
    }),
    []
  );

  // 미디어가 없는 경우 메시지 표시
  if (duration === 0) {
    return <div>No media</div>;
  }

  const durationInFrames = PlayerService.getDurationInFrames(duration, fps);

  return (
    <RemotionPlayer
      ref={playerController.playerRef}
      component={Composition}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={fps}
      style={playerStyle}
      overflowVisible
      acknowledgeRemotionLicense={true}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
    />
  );
}
