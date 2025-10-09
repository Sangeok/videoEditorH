"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";

export const useImageEffectsDetails = () => {
  const { updateAllMediaElement } = useMediaStore();

  const handleFadeDurationChange = (value: number, field: "fadeInDuration" | "fadeOutDuration") => {
    updateAllMediaElement("image", { [field]: value });
  };

  return { handleFadeDurationChange };
};
