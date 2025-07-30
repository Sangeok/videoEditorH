import { create } from "zustand";
import { Media, MediaElement, TextElement } from "./types";

export const initialMedia: Media = {
  // video duration
  projectDuration: 0,
  fps: 30,

  textElement: [],
  mediaElement: [],
};

interface MediaStore {
  media: Media;
  setMedia: (media: Media) => void;
  setFps: (fps: number) => void;
  addTextElement: (textElement: TextElement, preserveTiming?: boolean) => void;
  deleteTextElement: (textElementId: string) => void;
  updateTextElement: (
    textElementId: string,
    updates: Partial<TextElement>
  ) => void; // 추가
  addMediaElement: (mediaElement: MediaElement) => void;
  deleteMediaElement: (mediaElementId: string) => void;
  updateMediaElement: (
    mediaElementId: string,
    updates: Partial<MediaElement>
  ) => void;
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  media: initialMedia,
  setMedia: (media) => set({ media }),
  setFps: (fps) => set({ media: { ...get().media, fps } }),
  addTextElement: (textElement: TextElement, preserveTiming = false) =>
    set((state) => {
      const currentTextElements = state.media.textElement;
      let newTextElement: TextElement;

      if (currentTextElements.length === 0 || preserveTiming) {
        // 첫 번째 요소이거나 타이밍 보존이 요청된 경우 원본 타이밍 유지
        newTextElement = { ...textElement };
      } else {
        // 일반 텍스트 요소인 경우 연속 배치
        const lastElement = currentTextElements[currentTextElements.length - 1];
        const currentElementDuration = textElement.duration;

        newTextElement = {
          ...textElement,
          startTime: lastElement.endTime,
          endTime: lastElement.endTime + currentElementDuration,
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
  updateTextElement: (textElementId: string, updates: Partial<TextElement>) =>
    set((state) => ({
      media: {
        ...state.media,
        textElement: state.media.textElement.map((element) =>
          element.id === textElementId ? { ...element, ...updates } : element
        ),
      },
    })),

  addMediaElement: (mediaElement: MediaElement) =>
    set((state) => {
      const updatedMediaElements = [...state.media.mediaElement, mediaElement];
      const newProjectDuration = Math.max(
        state.media.projectDuration,
        mediaElement.endTime
      );

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
  deleteMediaElement: (mediaElementId: string) =>
    set((state) => {
      const updatedMediaElements = state.media.mediaElement.filter(
        (mediaElement) => mediaElement.id !== mediaElementId
      );

      const allElements = [...state.media.textElement, ...updatedMediaElements];
      const newProjectDuration =
        allElements.length > 0
          ? Math.max(...allElements.map((element) => element.endTime))
          : 0;

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
  updateMediaElement: (
    mediaElementId: string,
    updates: Partial<MediaElement>
  ) =>
    set((state) => ({
      media: {
        ...state.media,
        mediaElement: state.media.mediaElement.map((element) =>
          element.id === mediaElementId ? { ...element, ...updates } : element
        ),
      },
    })),
}));
