import { create } from "zustand";

interface TimelineToolStore {
  isDelete: boolean;
  setIsDelete: (isDelete: boolean) => void;

  isClone: boolean;
  setIsClone: (isClone: boolean) => void;
}

export const useTimelineToolStore = create<TimelineToolStore>((set) => ({
  isDelete: false,
  setIsDelete: (isDelete) => set({ isDelete }),

  isClone: false,
  setIsClone: (isClone) => set({ isClone }),
}));
