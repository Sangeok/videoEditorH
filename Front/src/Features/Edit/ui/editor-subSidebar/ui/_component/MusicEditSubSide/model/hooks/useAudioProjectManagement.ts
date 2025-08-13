// import { useMediaStore } from "@/src/entities/media/useMediaStore";
// import { AudioElement } from "@/src/entities/media/types";

// export function useAudioProjectManagement() {
//   const { addAudioElement, updateAudioElement, deleteAudioElement } = useMediaStore();

//   const addAudioToProject = (audioUrl: string, duration?: number) => {
//     const audioElement: AudioElement = {
//       id: crypto.randomUUID(),
//       type: "audio",
//       src: audioUrl,
//       startTime: 0,
//       duration: duration || 10, // Use actual duration or default
//       volume: 1,
//       name: `Audio ${Date.now()}`,
//     };

//     addAudioElement(audioElement);
//     return audioElement.id;
//   };

//   const updateAudioSettings = (audioId: string, updates: Partial<AudioElement>) => {
//     updateAudioElement(audioId, updates);
//   };

//   const deleteAudio = (audioId: string) => {
//     deleteAudioElement(audioId);
//   };

//   return {
//     addAudioToProject,
//     updateAudioSettings,
//     deleteAudio,
//   };
// }
