import { create } from "zustand";

interface SmartGuideState {
  /** 기본 가이드라인 표시 여부 */
  showBaseSmartGuide: boolean;
  /** 객체 가장자리 가이드라인 표시 여부 */
  showObjectEdgeSmartGuide: boolean;
  /** 드래그 중인 텍스트 여부 */
  isDraggingText: boolean;

  /** 객체 가장자리 가이드라인 위치 */
  nearObjEdge: number | null;
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
  setNearObjEdge: (objEdge: number | null) => void;
}

export type SmartGuideStore = SmartGuideState & SmartGuideActions;

export const useSmartGuideStore = create<SmartGuideStore>((set) => ({
  showBaseSmartGuide: false,
  showObjectEdgeSmartGuide: false,
  isDraggingText: false,
  nearObjEdge: null,

  setBaseSmartGuides: (showBaseSmartGuide) => set({ showBaseSmartGuide }),
  setObjectEdgeSmartGuides: (showObjectEdgeSmartGuide) => set({ showObjectEdgeSmartGuide }),
  setIsDraggingText: (isDraggingText) => set({ isDraggingText }),

  setNearObjEdge: (nearObjEdge) => set({ nearObjEdge }),
  clearSmartGuides: () => set({ showBaseSmartGuide: false, showObjectEdgeSmartGuide: false, isDraggingText: false }),
}));
