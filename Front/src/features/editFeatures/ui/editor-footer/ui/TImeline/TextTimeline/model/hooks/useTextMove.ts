// import { useState, useCallback, useEffect, useRef } from "react";
// import { useMediaStore } from "@/entities/media/useMediaStore";
// import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";

// interface TextMoveState {
//   isMoving: boolean;
//   elementId: string | null;
//   startX: number;
//   originalStartTime: number;
//   originalEndTime: number;
// }

// const initialMoveState: TextMoveState = {
//   isMoving: false,
//   elementId: null,
//   startX: 0,
//   originalStartTime: 0,
//   originalEndTime: 0,
// };

// export function useTextMove() {
//   const {
//     media,
//     updateTextElement,
//     startDragging,
//     updateDragPosition,
//     finishDragging,
//     clearDropPreview,
//     dropPreview
//   } = useMediaStore();
//   const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
//   const [moveState, setMoveState] = useState<TextMoveState>(initialMoveState);

//   const rafRef = useRef<number | null>(null);
//   const lastUpdateTimeRef = useRef<number>(0);
//   const tempPositionRef = useRef<{ startTime: number; endTime: number } | null>(null);

//   const pixelsToTime = useCallback((pixels: number) => pixels / pixelsPerSecond, [pixelsPerSecond]);

//   const handleMoveStart = useCallback(
//     (e: React.MouseEvent, elementId: string) => {
//       e.stopPropagation();
//       const element = media.textElement.find((el) => el.id === elementId);
//       if (!element) return;

//       startDragging(elementId, 'text');

//       setMoveState({
//         isMoving: true,
//         elementId,
//         startX: e.clientX,
//         originalStartTime: element.startTime,
//         originalEndTime: element.endTime,
//       });

//       tempPositionRef.current = {
//         startTime: element.startTime,
//         endTime: element.endTime,
//       };
//     },
//     [media.textElement, startDragging]
//   );

//   const updateElementPosition = useCallback(
//     (elementId: string, startTime: number, endTime: number) => {
//       updateTextElement(elementId, {
//         startTime,
//         endTime,
//         duration: endTime - startTime,
//       });
//     },
//     [updateTextElement]
//   );

//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (!moveState.isMoving || !moveState.elementId) return;

//       // 극도로 강화된 스로틀링 - 32ms(30fps)
//       const currentTime = performance.now();
//       if (currentTime - lastUpdateTimeRef.current < 32) return;

//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//       }

//       // 계산을 RAF 밖에서 수행
//       const deltaX = e.clientX - moveState.startX;
//       const deltaTime = pixelsToTime(deltaX);
//       const originalDuration = moveState.originalEndTime - moveState.originalStartTime;

//       let newStartTime = moveState.originalStartTime + deltaTime;
//       let newEndTime = newStartTime + originalDuration;

//       if (newStartTime < 0) {
//         newStartTime = 0;
//         newEndTime = originalDuration;
//       }

//       // 더 큰 threshold
//       const prevPosition = tempPositionRef.current;
//       const hasSignificantChange = !prevPosition ||
//         Math.abs(prevPosition.startTime - newStartTime) > 0.1 ||
//         Math.abs(prevPosition.endTime - newEndTime) > 0.1;

//       if (!hasSignificantChange) return;

//       // RAF로 최소한의 작업만
//       rafRef.current = requestAnimationFrame(() => {
//         tempPositionRef.current = {
//           startTime: newStartTime,
//           endTime: newEndTime,
//         };
//         lastUpdateTimeRef.current = currentTime;
//       });

//       // dropPreview는 비동기로
//       setTimeout(() => {
//         updateDragPosition(
//           moveState.elementId!,
//           'text',
//           newStartTime,
//           originalDuration
//         );
//       }, 0);
//     },
//     [
//       moveState.isMoving,
//       moveState.elementId,
//       moveState.startX,
//       moveState.originalStartTime,
//       moveState.originalEndTime,
//       pixelsToTime,
//       updateDragPosition,
//     ]
//   );

//   const handleMouseUp = useCallback(() => {
//     if (moveState.isMoving) {
//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//         rafRef.current = null;
//       }

//       const canDrop = finishDragging();

//       if (canDrop && moveState.elementId) {
//         // Use the snapped position from dropPreview if available, otherwise use tempPosition
//         const finalStartTime = dropPreview?.startTime ?? tempPositionRef.current?.startTime ?? moveState.originalStartTime;
//         const finalEndTime = dropPreview?.endTime ?? tempPositionRef.current?.endTime ?? moveState.originalEndTime;

//         updateElementPosition(moveState.elementId, finalStartTime, finalEndTime);
//       } else {
//         clearDropPreview();
//       }

//       setMoveState(initialMoveState);
//       tempPositionRef.current = null;
//       lastUpdateTimeRef.current = 0;
//     }
//   }, [moveState.isMoving, moveState.elementId, updateElementPosition, finishDragging, clearDropPreview, dropPreview]);

//   useEffect(() => {
//     if (moveState.isMoving) {
//       document.addEventListener("mousemove", handleMouseMove, { passive: true });
//       document.addEventListener("mouseup", handleMouseUp);
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//         if (rafRef.current) {
//           cancelAnimationFrame(rafRef.current);
//         }
//       };
//     }
//   }, [moveState.isMoving, handleMouseMove, handleMouseUp]);

//   return {
//     moveState,
//     handleMoveStart,
//     tempPosition: tempPositionRef.current,
//   };
// }
