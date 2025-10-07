"use client";

import { useCallback } from "react";
import { EffectType } from "@/entities/media/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { DEFAULT_EFFECT_DURATION } from "../../constants";

export function useImageEffects() {
  const { updateAllMediaElement } = useMediaStore();

  const handleInEffectChange = useCallback(
    (inEffect: EffectType) => {
      if (inEffect === "fadeIn") {
        updateAllMediaElement("image", {
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
        updateAllMediaElement("image", {
          fadeOut: true,
          fadeOutDuration: DEFAULT_EFFECT_DURATION,
        });
      }
    },
    [updateAllMediaElement]
  );

  const handleFadeDurationChange = useCallback(
    (value: number, field: "fadeInDuration" | "fadeOutDuration") => {
      updateAllMediaElement("image", { [field]: value });
    },
    [updateAllMediaElement]
  );

  return {
    handleInEffectChange,
    handleOutEffectChange,
    handleFadeDurationChange,
  };
}
