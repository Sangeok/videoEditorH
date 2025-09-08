import { create } from "zustand";
import { AudioElement, Media, MediaElement, TextElement } from "./types";

export const initialMedia: Media = {
  // video duration
  projectDuration: 0,
  fps: 30,

  textElement: [],
  mediaElement: [],
  audioElement: [],
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
  ) => void;
  updateTextBackgroundColor: (
    textElementId: string,
    style: { backgroundColor: string; textColor: string }
  ) => void;
  addMediaElement: (mediaElement: MediaElement) => void;
  deleteMediaElement: (mediaElementId: string) => void;
  updateMediaElement: (
    mediaElementId: string,
    updates: Partial<MediaElement>
  ) => void;
  updateMultipleMediaElements: (
    updates: Array<{ id: string; updates: Partial<MediaElement> }>
  ) => void;
  addAudioElement: (audioElement: AudioElement) => void;
  deleteAudioElement: (audioElementId: string) => void;
  updateAudioElement: (
    audioElementId: string,
    updates: Partial<AudioElement>
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
        // if first element or preserveTiming is true, keep original timing
        newTextElement = { ...textElement };
      } else {
        // if normal text element, arrange continuously
        const lastElement = currentTextElements[currentTextElements.length - 1];
        const currentElementDuration = textElement.duration;

        newTextElement = {
          ...textElement,
          startTime: lastElement.endTime,
          endTime: lastElement.endTime + currentElementDuration,
        };
      }

      const updatedTextElements = [...currentTextElements, newTextElement];

      // update projectDuration to the endTime of the last element
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

      // recalculate projectDuration after deletion
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
    set((state) => {
      const updatedTextElements = state.media.textElement.map((element) =>
        element.id === textElementId ? { ...element, ...updates } : element
      );

      const allEndTimes = [
        ...updatedTextElements.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration =
        allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateMultipleTextElements: (
    updates: Array<{ id: string; updates: Partial<TextElement> }>
  ) =>
    set((state) => {
      const updatedTextElements = state.media.textElement.map((element) => {
        const update = updates.find((u) => u.id === element.id);
        return update ? { ...element, ...update.updates } : element;
      });

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...updatedTextElements.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration =
        allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateTextBackgroundColor: (
    textElementId: string,
    style: { backgroundColor: string; textColor: string }
  ) =>
    set((state) => ({
      media: {
        ...state.media,
        textElement: state.media.textElement.map((element) =>
          element.id === textElementId
            ? {
                ...element,
                backgroundColor: style.backgroundColor,
                textColor: style.textColor,
              }
            : element
        ),
      },
    })),

  addMediaElement: (mediaElement: MediaElement) =>
    set((state) => {
      const currentMediaElements = state.media.mediaElement;

      let newMediaElement: MediaElement;

      if (currentMediaElements.length === 0) {
        newMediaElement = { ...mediaElement };
      } else {
        const lastElement =
          currentMediaElements[currentMediaElements.length - 1];
        newMediaElement = {
          ...mediaElement,
          startTime: lastElement.endTime,
          endTime: lastElement.endTime + mediaElement.duration,
        };
      }

      const updatedMediaElements = [...currentMediaElements, newMediaElement];

      const newProjectDuration = Math.max(
        state.media.projectDuration,
        newMediaElement.endTime
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

      const allElements = [
        ...state.media.textElement,
        ...state.media.audioElement,
        ...updatedMediaElements,
      ];

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
    set((state) => {
      const updatedMediaElements = state.media.mediaElement.map((element) =>
        element.id === mediaElementId ? { ...element, ...updates } : element
      );

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...updatedMediaElements.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration =
        allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateMultipleMediaElements: (
    updates: Array<{ id: string; updates: Partial<MediaElement> }>
  ) =>
    set((state) => {
      const updatedMediaElements = state.media.mediaElement.map((element) => {
        const update = updates.find((u) => u.id === element.id);
        return update ? { ...element, ...update.updates } : element;
      });

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...updatedMediaElements.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration =
        allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  addAudioElement: (audioElement: AudioElement) =>
    set((state) => {
      const currentAudioElements = state.media.audioElement;
      let newAudioElement: AudioElement;

      if (currentAudioElements.length === 0) {
        // if first audio element
        newAudioElement = {
          ...audioElement,
          startTime: 0,
          endTime: audioElement.duration,
        };
      } else {
        // if existing audio elements, arrange after the last element
        const lastElement =
          currentAudioElements[currentAudioElements.length - 1];

        newAudioElement = {
          ...audioElement,
          startTime: lastElement.endTime,
          endTime: lastElement.endTime + audioElement.duration,
        };
      }

      const updatedAudioElements = [...currentAudioElements, newAudioElement];

      // update projectDuration to include the endTime of the audio element
      const newProjectDuration = Math.max(
        state.media.projectDuration,
        newAudioElement.endTime
      );

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  deleteAudioElement: (audioElementId: string) =>
    set((state) => {
      const updatedAudioElements = state.media.audioElement.filter(
        (element) => element.id !== audioElementId
      );

      // recalculate projectDuration after deletion
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...updatedAudioElements.map((element) => element.endTime),
      ];

      const newProjectDuration =
        allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateAudioElement: (
    audioElementId: string,
    updates: Partial<AudioElement>
  ) =>
    set((state) => {
      const updatedAudioElements = state.media.audioElement.map((element) =>
        element.id === audioElementId ? { ...element, ...updates } : element
      );

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...updatedAudioElements.map((element) => element.endTime),
      ];

      const newProjectDuration =
        allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateMultipleAudioElements: (
    updates: Array<{ id: string; updates: Partial<AudioElement> }>
  ) =>
    set((state) => {
      const updatedAudioElements = state.media.audioElement.map((element) => {
        const update = updates.find((u) => u.id === element.id);
        return update ? { ...element, ...update.updates } : element;
      });

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...updatedAudioElements.map((element) => element.endTime),
      ];

      const newProjectDuration =
        allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
}));
