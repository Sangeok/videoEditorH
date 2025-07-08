"use client";

import { useMediaStore } from "@/src/entities/media/useMediaStore";
import IconButton from "@/src/shared/ui/atoms/Button/ui/IconButton";
import { formatTime } from "@/lib/utils";
import { SkipBack, SkipForward } from "lucide-react";
import { Play } from "lucide-react";

const PlaybackIcons = [
  {
    label: "Skip Back",
    icon: <SkipBack size={15} />,
  },
  {
    label: "Play",
    icon: <Play size={15} />,
  },
  {
    label: "Skip Forward",
    icon: <SkipForward size={15} />,
  },
] as const;

export default function PlaybackDisplay() {
  const { media } = useMediaStore();

  return (
    <div className="flex items-center gap-4">
      {PlaybackIcons.map((icon) => (
        <IconButton key={icon.label}>{icon.icon}</IconButton>
      ))}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-mono text-white">00:00</span>
        <span className="text-white/50">/</span>
        <span className="font-mono text-white/50">
          {formatTime(media.projectDuration)}
        </span>
      </div>
    </div>
  );
}
