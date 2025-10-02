"use client";

import { useCallback } from "react";
import { EffectType, MediaElement } from "@/entities/media/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { DEFAULT_EFFECT_DURATION } from "../../constants";

export function useImageEffects(imageElement: MediaElement) {
  const { updateMediaElement } = useMediaStore();

  const handleInEffectChange = useCallback(
    (inEffect: EffectType) => {
      if (inEffect === "fadeIn") {
        updateMediaElement(imageElement.id, {
          fadeIn: true,
          fadeInDuration: DEFAULT_EFFECT_DURATION,
        });
      }
    },
    [imageElement.id, updateMediaElement]
  );

  const handleOutEffectChange = useCallback(
    (outEffect: EffectType) => {
      if (outEffect === "fadeOut") {
        updateMediaElement(imageElement.id, {
          fadeOut: true,
          fadeOutDuration: DEFAULT_EFFECT_DURATION,
        });
      }
    },
    [imageElement.id, updateMediaElement]
  );

  const handleFadeDurationChange = useCallback(
    (value: number, field: "fadeInDuration" | "fadeOutDuration") => {
      updateMediaElement(imageElement.id, { [field]: value });
    },
    [imageElement.id, updateMediaElement]
  );

  return {
    handleInEffectChange,
    handleOutEffectChange,
    handleFadeDurationChange,
  };
}
