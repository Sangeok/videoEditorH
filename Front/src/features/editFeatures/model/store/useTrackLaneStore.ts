import { create } from "zustand";

type LaneKind = "text" | "media" | "audio";

interface TrackLaneState {
  textLanes: string[];
  mediaLanes: string[];
  audioLanes: string[];
  activeLaneByType: { text: string; media: string; audio: string };
  addTextLane: () => string;
  addMediaLane: () => string;
  addAudioLane: () => string;
  setActiveLane: (kind: LaneKind, laneId: string) => void;
}

const generateLaneId = (prefix: LaneKind, index: number): string => `${prefix}-${index}`;

export const useTrackLaneStore = create<TrackLaneState>((set, get) => ({
  textLanes: ["text-0"],
  mediaLanes: ["media-0"],
  audioLanes: ["audio-0"],
  activeLaneByType: { text: "text-0", media: "media-0", audio: "audio-0" },

  addTextLane: () => {
    const { textLanes } = get();
    const nextId = generateLaneId("text", textLanes.length);
    const nextLanes = [...textLanes, nextId];
    set({ textLanes: nextLanes, activeLaneByType: { ...get().activeLaneByType, text: nextId } });
    return nextId;
  },

  addMediaLane: () => {
    const { mediaLanes } = get();
    const nextId = generateLaneId("media", mediaLanes.length);
    const nextLanes = [...mediaLanes, nextId];
    set({ mediaLanes: nextLanes, activeLaneByType: { ...get().activeLaneByType, media: nextId } });
    return nextId;
  },

  addAudioLane: () => {
    const { audioLanes } = get();
    const nextId = generateLaneId("audio", audioLanes.length);
    const nextLanes = [...audioLanes, nextId];
    set({ audioLanes: nextLanes, activeLaneByType: { ...get().activeLaneByType, audio: nextId } });
    return nextId;
  },

  setActiveLane: (kind, laneId) => {
    const { activeLaneByType } = get();
    set({ activeLaneByType: { ...activeLaneByType, [kind]: laneId } as TrackLaneState["activeLaneByType"] });
  },
}));
