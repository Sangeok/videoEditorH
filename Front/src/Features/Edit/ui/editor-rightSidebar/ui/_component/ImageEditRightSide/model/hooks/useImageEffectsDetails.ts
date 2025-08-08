"use client";

import { MediaElement } from "@/src/entities/media/types";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

export const useImageEffectsDetails = (imageElement: MediaElement) => {
  const { updateMediaElement } = useMediaStore();

  const handleFadeDurationChange = (value: number, field: "fadeInDuration" | "fadeOutDuration") => {
    updateMediaElement(imageElement.id, { [field]: value });
  };

  return { handleFadeDurationChange };
};
