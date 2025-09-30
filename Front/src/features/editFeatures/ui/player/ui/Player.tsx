"use client";

import { Player as RemotionPlayer } from "@remotion/player";
import { useMediaStore } from "@/entities/media/useMediaStore";
import Composition from "./_component/Composition/ui";
import { usePlayerController } from "../model/hooks/usePlayerController";
import { usePlayerSync } from "../model/hooks/usePlayerSync";
import { PlayerService } from "../model/services/playerService";

export default function Player() {
  const { media } = useMediaStore();
  const fps = media.fps || 30;
  const projectDuration = media.projectDuration || 0;

  const playerController = usePlayerController({ projectDuration });

  // synchronize timeline and player
  usePlayerSync({
    playerRef: playerController.playerRef,
    fps,
  });

  // show message if no media
  if (projectDuration === 0) {
    return <div>No media</div>;
  }

  const durationInFrames = PlayerService.getDurationInFrames(
    projectDuration,
    fps
  );

  return (
    <RemotionPlayer
      ref={playerController.playerRef}
      component={Composition}
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
