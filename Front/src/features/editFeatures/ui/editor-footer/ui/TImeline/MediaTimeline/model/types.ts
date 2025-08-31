export interface DragState {
  isDragging: boolean;
  elementId: string | null;
  dragType: "left" | "right" | null;
  startX: number;
  originalStartTime: number;
  originalEndTime: number;
}

export interface MediaTimelineProps {
  className?: string;
}

export type DragType = "left" | "right";

export interface ElementAdjustment {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
}