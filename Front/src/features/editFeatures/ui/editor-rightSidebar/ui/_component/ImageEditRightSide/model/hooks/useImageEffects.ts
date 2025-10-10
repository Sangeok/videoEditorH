"use client";

import { useCallback } from "react";
import { EffectType } from "@/entities/media/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { DEFAULT_EFFECT_DURATION } from "../../constants";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";

export function useImageEffects() {
  const { updateAllMediaElement } = useMediaStore();
  const selectedTrackId: string | null = useSelectedTrackStore((s) => s.selectedTrackId);

  const handleInEffectChange = useCallback(
    (inEffect: EffectType) => {
      if (inEffect === "fadeIn") {
        updateAllMediaElement(selectedTrackId as string, "image", {
          fadeIn: true,
          fadeInDuration: DEFAULT_EFFECT_DURATION,
        });
      }
    },
    [updateAllMediaElement]
  );

  const handleOutEffectChange = useCallback(
    (outEffect: EffectType) => {
      if (outEffect === "fadeOut") {
        updateAllMediaElement(selectedTrackId as string, "image", {
          fadeOut: true,
          fadeOutDuration: DEFAULT_EFFECT_DURATION,
        });
      }
    },
    [updateAllMediaElement]
  );

  const handleFadeDurationChange = useCallback(
    (value: number, field: "fadeInDuration" | "fadeOutDuration") => {
      updateAllMediaElement(selectedTrackId as string, "image", { [field]: value });
    },
    [updateAllMediaElement]
  );

  return {
    handleInEffectChange,
    handleOutEffectChange,
    handleFadeDurationChange,
  };
}
