import { useState } from "react";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

export function useAudioSelection() {
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const { media } = useMediaStore();

  const selectedAudio = selectedAudioId 
    ? media.audioElement.find(el => el.id === selectedAudioId && el.type === "audio")
    : null;

  const selectAudio = (audioId: string) => {
    setSelectedAudioId(audioId);
  };

  const clearSelection = () => {
    setSelectedAudioId(null);
  };

  const isAudioSelected = (audioId: string) => {
    return selectedAudioId === audioId;
  };

  return {
    selectedAudioId,
    selectedAudio,
    selectAudio,
    clearSelection,
    isAudioSelected,
  };
}
