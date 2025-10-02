import { create } from "zustand";

interface SmartGuideState {
  /** 기본 가이드라인 표시 여부 */
  showBaseSmartGuide: boolean;
}

interface SmartGuideActions {
  /** 가이드라인 표시 설정 */
  setBaseSmartGuides: (showBaseSmartGuide: boolean) => void;

  /** 모든 가이드라인 숨김 */
  clearBaseSmartGuides: () => void;
}

export type SmartGuideStore = SmartGuideState & SmartGuideActions;

export const useSmartGuideStore = create<SmartGuideStore>((set) => ({
  showBaseSmartGuide: false,

  setBaseSmartGuides: (showBaseSmartGuide) => set({ showBaseSmartGuide }),

  clearBaseSmartGuides: () => set({ showBaseSmartGuide: false }),
}));
