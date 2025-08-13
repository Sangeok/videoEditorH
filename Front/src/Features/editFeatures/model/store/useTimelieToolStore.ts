import { create } from "zustand";

interface TimelineToolStore {
  isDelete: boolean;
  setIsDelete: (isDelete: boolean) => void;

  isClone: boolean;
  setIsClone: (isClone: boolean) => void;

  isSplit: boolean;
  setIsSplit: (isSplit: boolean) => void;
}

export const useTimelineToolStore = create<TimelineToolStore>((set) => ({
  isDelete: false,
  setIsDelete: (isDelete) => set({ isDelete }),

  isClone: false,
  setIsClone: (isClone) => set({ isClone }),

  isSplit: false,
  setIsSplit: (isSplit) => set({ isSplit }),
}));
