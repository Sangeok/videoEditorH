import { create } from "zustand";

interface NearObjEdgeData {
  edgeKey: "left" | "right" | "top" | "bottom";
  distance: number;
  edgeXorYPosition: number;
}

interface SmartGuideState {
  /** 기본 가이드라인 표시 여부 */
  showBaseSmartGuide: boolean;
  /** 객체 가장자리 가이드라인 표시 여부 */
  showObjectEdgeSmartGuide: boolean;
  /** 드래그 중인 텍스트 여부 */
  isDraggingText: boolean;

  /** 객체 가장자리 가이드라인 위치 */
  nearObjEdgeData: NearObjEdgeData | null;
}

interface SmartGuideActions {
  /** 가이드라인 표시 설정 */
  setBaseSmartGuides: (showBaseSmartGuide: boolean) => void;

  /** 객체 가장자리 가이드라인 표시 설정 */
  setObjectEdgeSmartGuides: (showObjectEdgeSmartGuide: boolean) => void;

  /** 드래그 중인 텍스트 여부 설정 */
  setIsDraggingText: (isDraggingText: boolean) => void;

  /** 모든 가이드라인 숨김 */
  clearSmartGuides: () => void;

  /** 객체 가장자리 가이드라인 위치 설정 */
  setNearObjEdgeData: (objEdge: NearObjEdgeData | null) => void;
}

export type SmartGuideStore = SmartGuideState & SmartGuideActions;

export const useSmartGuideStore = create<SmartGuideStore>((set) => ({
  showBaseSmartGuide: false,
  showObjectEdgeSmartGuide: false,
  isDraggingText: false,
  nearObjEdgeData: null,

  setBaseSmartGuides: (showBaseSmartGuide) => set({ showBaseSmartGuide }),
  setObjectEdgeSmartGuides: (showObjectEdgeSmartGuide) => set({ showObjectEdgeSmartGuide }),
  setIsDraggingText: (isDraggingText) => set({ isDraggingText }),

  setNearObjEdgeData: (nearObjEdgeData) => set({ nearObjEdgeData }),
  clearSmartGuides: () => set({ showBaseSmartGuide: false, showObjectEdgeSmartGuide: false, isDraggingText: false }),
}));
