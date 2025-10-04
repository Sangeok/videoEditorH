import { create } from "zustand";

interface SmartGuideState {
  /** 수직 가이드라인 표시 여부 */
  showVerticalSmartGuide: boolean;
  /** 수평 가이드라인 표시 여부 */
  showHorizonSmartGuide: boolean;

  isDraggingText: boolean;
}

interface SmartGuideActions {
  /** 수직 가이드라인 표시 설정 */
  setShowVerticalSmartGuide: (showVerticalSmartGuide: boolean) => void;
  /** 수평 가이드라인 표시 설정 */
  setShowHorizonSmartGuide: (showHorizonSmartGuide: boolean) => void;
  /** 드래그 중인 텍스트 여부 설정 */
  setIsDraggingText: (isDraggingText: boolean) => void;

  setSmartGuides: (showVerticalSmartGuide: boolean, showHorizonSmartGuide: boolean) => void;
}

export type SmartGuideStore = SmartGuideState & SmartGuideActions;

export const useSmartGuideStore = create<SmartGuideStore>((set) => ({
  showVerticalSmartGuide: false,
  showHorizonSmartGuide: false,
  isDraggingText: false,

  setSmartGuides: (showVerticalSmartGuide, showHorizonSmartGuide) =>
    set({ showVerticalSmartGuide, showHorizonSmartGuide }),

  setShowVerticalSmartGuide: (showVerticalSmartGuide) => set({ showVerticalSmartGuide }),
  setShowHorizonSmartGuide: (showHorizonSmartGuide) => set({ showHorizonSmartGuide }),
  setIsDraggingText: (isDraggingText) => set({ isDraggingText }),
}));
