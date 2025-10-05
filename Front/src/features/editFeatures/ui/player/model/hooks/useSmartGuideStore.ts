import { create } from "zustand";

interface NearObjEdgeData {
  edgeKey: "left" | "right" | "top" | "bottom";
  distance: number;
  edgeXorYPosition: number;
  top: number; // composition 좌표계 기준 이미지 상단 위치(px)
  height: number; // composition 좌표계 기준 이미지 높이(px)
}

interface SmartGuideState {
  /** 수직 가이드라인 표시 여부 */
  showVerticalSmartGuide: boolean;
  /** 수평 가이드라인 표시 여부 */
  showHorizonSmartGuide: boolean;

  isDraggingText: boolean;

  /** 객체 가장자리 가이드라인 위치 */
  nearObjEdgeData: NearObjEdgeData | null;
}

interface SmartGuideActions {
  /** 수직 가이드라인 표시 설정 */
  setShowVerticalSmartGuide: (showVerticalSmartGuide: boolean) => void;
  /** 수평 가이드라인 표시 설정 */
  setShowHorizonSmartGuide: (showHorizonSmartGuide: boolean) => void;
  /** 드래그 중인 텍스트 여부 설정 */
  setIsDraggingText: (isDraggingText: boolean) => void;

  setSmartGuides: (showVerticalSmartGuide: boolean, showHorizonSmartGuide: boolean) => void;
  /** 객체 가장자리 가이드라인 위치 설정 */
  setNearObjEdgeData: (nearObjEdgeData: NearObjEdgeData | null) => void;
  /** 가이드라인 초기화 */
  clearSmartGuides: () => void;
}

export type SmartGuideStore = SmartGuideState & SmartGuideActions;

export const useSmartGuideStore = create<SmartGuideStore>((set) => ({
  showVerticalSmartGuide: false,
  showHorizonSmartGuide: false,
  isDraggingText: false,
  nearObjEdgeData: null,

  setSmartGuides: (showVerticalSmartGuide, showHorizonSmartGuide) =>
    set({ showVerticalSmartGuide, showHorizonSmartGuide }),

  setShowVerticalSmartGuide: (showVerticalSmartGuide) => set({ showVerticalSmartGuide }),
  setShowHorizonSmartGuide: (showHorizonSmartGuide) => set({ showHorizonSmartGuide }),
  setIsDraggingText: (isDraggingText) => set({ isDraggingText }),
  setNearObjEdgeData: (nearObjEdgeData) => set({ nearObjEdgeData }),
  clearSmartGuides: () => set({ showVerticalSmartGuide: false, showHorizonSmartGuide: false, nearObjEdgeData: null }),
}));
