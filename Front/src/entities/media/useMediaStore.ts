import { create } from "zustand";
import { Media, TextElement } from "./types";

export const initialMedia: Media = {
  // video duration
  projectDuration: 0,

  textElement: [],

  //   videoElement: [],
  //   audioElement: [],
  //   imageElement: [],
};

interface MediaStore {
  media: Media;
  setMedia: (media: Media) => void;
  addTextElement: (textElement: TextElement) => void;
  deleteTextElement: (textElementId: string) => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  media: initialMedia,
  setMedia: (media) => set({ media }),
  addTextElement: (textElement: TextElement) =>
    set((state) => {
      const currentTextElements = state.media.textElement;
      let newTextElement: TextElement;

      if (currentTextElements.length === 0) {
        newTextElement = { ...textElement };
      } else {
        const lastElement = currentTextElements[currentTextElements.length - 1];
        const cuttentElementDuration = lastElement.duration;

        newTextElement = {
          ...textElement,
          startTime: lastElement.endTime,
          endTime: lastElement.endTime + cuttentElementDuration,
        };
      }

      const updatedTextElements = [...currentTextElements, newTextElement];

      // projectDuration을 가장 마지막 요소의 endTime으로 업데이트
      const newProjectDuration = Math.max(
        state.media.projectDuration,
        newTextElement.endTime
      );

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
  deleteTextElement: (textElementId: string) =>
    set((state) => {
      const updatedTextElements = state.media.textElement.filter(
        (textElement) => textElement.id !== textElementId
      );

      // 삭제 후 남은 element들 중 가장 큰 endTime을 찾아 projectDuration 재계산
      const newProjectDuration =
        updatedTextElements.length > 0
          ? Math.max(...updatedTextElements.map((element) => element.endTime))
          : 0;

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
}));
