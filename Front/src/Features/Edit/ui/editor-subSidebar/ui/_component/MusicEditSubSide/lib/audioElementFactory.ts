import { AudioElement } from "@/src/entities/media/types";
import { v4 as uuidv4 } from "uuid";

export function createAudioElement(
  audioUrl: string,
  projectDuration: number
): Promise<AudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      const audioElement: AudioElement = {
        id: uuidv4(),
        type: "audio",
        startTime: projectDuration,
        endTime: projectDuration + duration,
        duration: duration,
        url: audioUrl,
        volume: 1,
        speed: 1,
      };
      resolve(audioElement);
    });
    audio.addEventListener("error", (e) => {
      reject(e);
    });
  });
}