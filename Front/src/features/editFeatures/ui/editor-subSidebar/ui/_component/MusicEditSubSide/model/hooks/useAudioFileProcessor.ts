import { useMediaStore } from "@/entities/media/useMediaStore";
import { createAudioElement } from "../../lib/audioElementFactory";
import { UploadedAudio } from "../types";

export function useAudioFileProcessor() {
  const { media, addAudioElement } = useMediaStore();

  const processAudioFile = (
    file: File,
    onStart: () => void,
    onSuccess: (audio: UploadedAudio) => void,
    onError: () => void
  ) => {
    onStart();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const audioUrl = e.target?.result as string;
      const audioName = file.name;

      const uploadedAudio: UploadedAudio = {
        url: audioUrl,
        name: audioName,
      };

      onSuccess(uploadedAudio);

      try {
        const audioElement = await createAudioElement(audioUrl, media.projectDuration);
        addAudioElement(audioElement);
      } catch (error) {
        const fallbackAudioElement = {
          id: `audio-${Date.now()}-${Math.random()}`,
          type: "audio" as const,
          startTime: media.projectDuration,
          endTime: media.projectDuration + 30,
          duration: 30,
          url: audioUrl,
          volume: 100,
          speed: 1,
        };
        addAudioElement(fallbackAudioElement);
      }
    };

    reader.onerror = () => {
      alert("Failed to read audio file");
      onError();
    };

    reader.readAsDataURL(file);
  };

  return {
    processAudioFile,
  };
}