import { create } from "zustand";

interface TimelineState {
  // 기본 상태
  currentTime: number; // 현재 재생 시간 (초)
  duration: number; // 전체 지속 시간 (초)
  zoom: number; // 줌 레벨 (1.0 = 100%)
  isPlaying: boolean; // 재생 상태

  // 뷰 관련 상태
  pixelsPerSecond: number; // 1초당 픽셀 수
  timelineWidth: number; // 타임라인 전체 너비
  viewportStartTime: number; // 현재 뷰포트 시작 시간
  viewportEndTime: number; // 현재 뷰포트 종료 시간
}

interface TimelineActions {
  // 기본 액션
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setZoom: (zoom: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;

  // 뷰 관련 액션
  setTimelineWidth: (width: number) => void;
  updateViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

type TimelineStore = TimelineState & TimelineActions;

const useTimelineStore = create<TimelineStore>((set, get) => ({
  // 초기 상태
  currentTime: 0,
  duration: 60, // 1분 기본값
  zoom: 1.0, // 100%(0.1 ~ 10) => 0.1은 10% 1은 100% 10은 1000%
  isPlaying: false,
  pixelsPerSecond: 20, // 기본값: 1초당 20픽셀
  timelineWidth: 800, // 기본값: 800px
  viewportStartTime: 0,
  viewportEndTime: 40, // 기본값: 40초까지 표시

  // 기본 액션
  setCurrentTime: (time: number) => {
    set({ currentTime: Math.max(0, Math.min(time, get().duration)) });
  },

  setDuration: (duration: number) => {
    set({ duration: Math.max(1, duration) });
    get().updateViewport();
  },

  setZoom: (zoom: number) => {
    const newZoom = Math.max(0.1, Math.min(10, zoom)); // 0.1x ~ 10x 제한

    // 극단적인 zoom 레벨에서의 부드러운 처리
    const smoothZoom =
      newZoom < 0.2
        ? Math.round(newZoom * 100) / 100 // 낮은 zoom에서 더 정밀한 단계
        : Math.round(newZoom * 10) / 10; // 일반적인 zoom에서 0.1 단위

    set({ zoom: smoothZoom });
    get().updateViewport();
  },

  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
  },

  // 뷰 관련 액션
  setTimelineWidth: (width: number) => {
    set({ timelineWidth: width });
    get().updateViewport();
  },

  updateViewport: () => {
    const { zoom, timelineWidth } = get();
    const basePixelsPerSecond = 20; // 1초 = 20px
    const pixelsPerSecond = basePixelsPerSecond * zoom; // zoom 적용된 밀도도

    // 뷰포트에 표시될 시간 범위 계산
    const viewportDuration = timelineWidth / pixelsPerSecond;
    const viewportStartTime = 0; // 현재는 항상 0부터 시작
    const viewportEndTime = viewportDuration;

    set({
      pixelsPerSecond,
      viewportStartTime,
      viewportEndTime,
    });
  },

  zoomIn: () => {
    const currentZoom = get().zoom;
    get().setZoom(currentZoom * 1.2); // 1.2(20%) 증가 => 업계에서 이렇게 씀..
  },

  zoomOut: () => {
    const currentZoom = get().zoom;
    get().setZoom(currentZoom / 1.2);
  },

  resetZoom: () => {
    get().setZoom(1.0);
  },
}));

export default useTimelineStore;
