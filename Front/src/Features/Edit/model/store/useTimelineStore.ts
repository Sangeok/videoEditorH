import { create } from "zustand";

export interface TimelineElement {
  id: string;
  type: "video" | "audio" | "image" | "text";
  name: string;
  startTime: number; // seconds
  duration: number; // seconds
  trackIndex: number;
  src?: string;
  content?: string; // for text elements
  volume?: number; // for audio/video elements
  opacity?: number;
  zIndex?: number;
  position?: { x: number; y: number };
  selected?: boolean;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: "video" | "audio" | "text" | "image";
  locked: boolean;
  visible: boolean;
  elements: TimelineElement[];
}

interface TimelineStore {
  // State
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  zoom: number;
  tracks: TimelineTrack[];
  selectedElements: string[];
  playbackRate: number;

  // Actions
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
  setPlaybackRate: (rate: number) => void;

  // Track actions
  addTrack: (track: Omit<TimelineTrack, "id">) => void;
  removeTrack: (trackId: string) => void;
  toggleTrackLock: (trackId: string) => void;
  toggleTrackVisibility: (trackId: string) => void;

  // Element actions
  addElement: (element: Omit<TimelineElement, "id">) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<TimelineElement>) => void;
  selectElement: (elementId: string) => void;
  selectMultipleElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  duplicateElement: (elementId: string) => void;
  splitElement: (elementId: string, splitTime: number) => void;
  moveElement: (elementId: string, newStartTime: number, newTrackIndex?: number) => void;
}

const useTimelineStore = create<TimelineStore>((set, get) => ({
  // Initial state
  currentTime: 0,
  duration: 60, // 1 minute default
  isPlaying: false,
  zoom: 1,
  tracks: [
    {
      id: "track-1",
      name: "Video Track",
      type: "video",
      locked: false,
      visible: true,
      elements: [
        {
          id: "element-1",
          type: "video",
          name: "Sample Video",
          startTime: 2,
          duration: 10,
          trackIndex: 0,
          volume: 0.8,
          opacity: 1,
          zIndex: 1,
        },
        {
          id: "element-2",
          type: "text",
          name: "Title Text",
          startTime: 15,
          duration: 5,
          trackIndex: 0,
          content: "Sample Title",
          opacity: 1,
          zIndex: 2,
        },
      ],
    },
    {
      id: "track-2",
      name: "Audio Track",
      type: "audio",
      locked: false,
      visible: true,
      elements: [
        {
          id: "element-3",
          type: "audio",
          name: "Background Music",
          startTime: 0,
          duration: 30,
          trackIndex: 1,
          volume: 0.5,
        },
      ],
    },
  ],
  selectedElements: [],
  playbackRate: 1,

  // Actions
  setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
  setDuration: (duration) => set({ duration: Math.max(1, duration) }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),

  // Track actions
  addTrack: (track) => {
    const newTrack: TimelineTrack = {
      ...track,
      id: `track-${Date.now()}`,
      elements: [],
    };
    set((state) => ({
      tracks: [...state.tracks, newTrack],
    }));
  },

  removeTrack: (trackId) => {
    set((state) => ({
      tracks: state.tracks.filter((track) => track.id !== trackId),
    }));
  },

  toggleTrackLock: (trackId) => {
    set((state) => ({
      tracks: state.tracks.map((track) => (track.id === trackId ? { ...track, locked: !track.locked } : track)),
    }));
  },

  toggleTrackVisibility: (trackId) => {
    set((state) => ({
      tracks: state.tracks.map((track) => (track.id === trackId ? { ...track, visible: !track.visible } : track)),
    }));
  },

  // Element actions
  addElement: (element) => {
    const newElement: TimelineElement = {
      ...element,
      id: `element-${Date.now()}`,
      selected: false,
    };

    set((state) => ({
      tracks: state.tracks.map((track, index) =>
        index === element.trackIndex ? { ...track, elements: [...track.elements, newElement] } : track
      ),
    }));
  },

  removeElement: (elementId) => {
    set((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        elements: track.elements.filter((el) => el.id !== elementId),
      })),
      selectedElements: state.selectedElements.filter((id) => id !== elementId),
    }));
  },

  updateElement: (elementId, updates) => {
    set((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        elements: track.elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)),
      })),
    }));
  },

  selectElement: (elementId) => {
    set({ selectedElements: [elementId] });
  },

  selectMultipleElements: (elementIds) => {
    set({ selectedElements: elementIds });
  },

  clearSelection: () => {
    set({ selectedElements: [] });
  },

  duplicateElement: (elementId) => {
    const state = get();
    const element = state.tracks.flatMap((track) => track.elements).find((el) => el.id === elementId);

    if (element) {
      const duplicatedElement: TimelineElement = {
        ...element,
        id: `element-${Date.now()}`,
        startTime: element.startTime + element.duration,
        selected: false,
      };

      set((state) => ({
        tracks: state.tracks.map((track, index) =>
          index === element.trackIndex ? { ...track, elements: [...track.elements, duplicatedElement] } : track
        ),
      }));
    }
  },

  splitElement: (elementId, splitTime) => {
    const state = get();
    const trackIndex = state.tracks.findIndex((track) => track.elements.some((el) => el.id === elementId));

    if (trackIndex === -1) return;

    const element = state.tracks[trackIndex].elements.find((el) => el.id === elementId);

    if (!element || splitTime <= element.startTime || splitTime >= element.startTime + element.duration) {
      return;
    }

    const firstPart: TimelineElement = {
      ...element,
      duration: splitTime - element.startTime,
    };

    const secondPart: TimelineElement = {
      ...element,
      id: `element-${Date.now()}`,
      startTime: splitTime,
      duration: element.duration - (splitTime - element.startTime),
    };

    set((state) => ({
      tracks: state.tracks.map((track, index) =>
        index === trackIndex
          ? {
              ...track,
              elements: track.elements.filter((el) => el.id !== elementId).concat([firstPart, secondPart]),
            }
          : track
      ),
    }));
  },

  moveElement: (elementId, newStartTime, newTrackIndex) => {
    const state = get();
    const currentTrackIndex = state.tracks.findIndex((track) => track.elements.some((el) => el.id === elementId));

    if (currentTrackIndex === -1) return;

    const element = state.tracks[currentTrackIndex].elements.find((el) => el.id === elementId);

    if (!element) return;

    const targetTrackIndex = newTrackIndex ?? currentTrackIndex;
    const updatedElement = {
      ...element,
      startTime: Math.max(0, newStartTime),
      trackIndex: targetTrackIndex,
    };

    set((state) => ({
      tracks: state.tracks.map((track, index) => {
        if (index === currentTrackIndex) {
          return {
            ...track,
            elements: track.elements.filter((el) => el.id !== elementId),
          };
        }
        if (index === targetTrackIndex) {
          return {
            ...track,
            elements: [...track.elements, updatedElement],
          };
        }
        return track;
      }),
    }));
  },
}));

export default useTimelineStore;
