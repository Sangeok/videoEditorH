"use client";

import { Player as RemotionPlayer } from "@remotion/player";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { usePlayerController } from "@/src/features/Edit/ui/player/model/hooks/usePlayerController";
import { usePlayerSync } from "@/src/features/Edit/ui/player/model/hooks/usePlayerSync";
import { PlayerService } from "@/src/features/Edit/ui/player/model/services/playerService";
import Composition from "./_component/Composition/ui";
// import NoMediaMessage from "./_component/NoMediaMessage";

/**
 * 비디오 플레이어 컴포넌트
 * RemotionPlayer를 래핑하여 타임라인과 동기화된 재생 기능 제공
 */
export default function Player() {
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;
  const fps = media.fps || 30;

  const playerController = usePlayerController();

  // Timeline과 Player 동기화
  usePlayerSync({
    playerRef: playerController.playerRef,
    fps,
  });

  // 미디어가 없는 경우 메시지 표시
  if (duration === 0) {
    return <div>No media</div>;
  }

  const durationInFrames = PlayerService.getDurationInFrames(duration, fps);

  return (
    <RemotionPlayer
      ref={playerController.playerRef}
      component={Composition}
      inputProps={{ textElements: media.textElement || [] }}
      durationInFrames={durationInFrames}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={fps}
      style={{
        width: "225px",
        height: "100%",
        border: "2px solid #333",
        borderRadius: "10px",
        overflow: "hidden",
      }}
      overflowVisible
      acknowledgeRemotionLicense={true}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
    />
  );
}
