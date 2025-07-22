"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { TextElement } from "@/src/entities/media/types";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";
import { useSelectedTrackStore } from "@/src/features/Edit/model/store/useSelectedTrackStore";

interface DraggableTextProps {
  element: TextElement;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
}

export default function DraggableText({ element }: DraggableTextProps) {
  const { updateTextElement } = useMediaStore();
  const { isPlaying } = useTimelineStore();
  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );
  const textRef = useRef<HTMLDivElement>(null);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(element.text || "");
  const [isComposing, setIsComposing] = useState(false);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cursorPositionRef = useRef<number>(0);
  // Step 1: 편집 시작 여부를 추적하는 ref
  const isEditingStartRef = useRef<boolean>(false);

  // Step 2: 개선된 커서 위치 저장 함수
  const saveCursorPosition = useCallback(() => {
    if (textRef.current && isEditing) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        cursorPositionRef.current = range.startOffset;
      }
    }
  }, [isEditing]);

  // Step 2: 개선된 커서 위치 복원 함수 - 전체 선택 방지
  const restoreCursorPosition = useCallback(() => {
    if (textRef.current && isEditing && !isEditingStartRef.current) {
      const selection = window.getSelection();
      const textNode = textRef.current.firstChild;

      if (textNode && selection) {
        const maxOffset = textNode.textContent?.length || 0;
        const safeOffset = Math.min(cursorPositionRef.current, maxOffset);

        try {
          // Step 2: collapsed range로 커서만 설정 (선택 영역 없음)
          const range = document.createRange();
          range.setStart(textNode, safeOffset);
          range.collapse(true); // 커서만 설정, 선택 영역 없음

          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.warn("Failed to restore cursor position:", error);
        }
      }
    }
  }, [isEditing]);

  // start drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying || isEditing) return;

      e.preventDefault();
      e.stopPropagation();

      setSelectedTrackAndId("Text", element.id);

      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: element.positionX,
        startPosY: element.positionY,
      });
    },
    [isPlaying, isEditing, element.positionX, element.positionY]
  );

  // start edit
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying) return;

      e.preventDefault();
      e.stopPropagation();

      // 편집 시작: 첫 번째 입력에서 전체 선택을 위한 플래그
      isEditingStartRef.current = true;
      // 편집 모드 활성화
      setIsEditing(true);
      setEditingText(element.text || "");
    },
    [isPlaying, element.text]
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLDivElement>) => {
      setIsComposing(false);
      const newText = (e.target as HTMLDivElement).textContent || "";
      setEditingText(newText);
      updateTextElement(element.id, { text: newText });
    },
    [updateTextElement, element.id]
  );

  const debouncedUpdate = useCallback(
    (text: string) => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }

      updateTimerRef.current = setTimeout(() => {
        updateTextElement(element.id, { text });
      }, 300);
    },
    [updateTextElement, element.id]
  );

  // Step 2: 텍스트 입력 처리 개선 - 전체 선택 방지
  const handleTextInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      // Step 1: 편집 시작이 아닐 때만 커서 위치 저장
      if (!isEditingStartRef.current) {
        saveCursorPosition();
      }

      const newText = (e.target as HTMLDivElement).textContent || "";
      setEditingText(newText);

      if (!isComposing) {
        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(newText);
        if (hasKorean) {
          debouncedUpdate(newText);
        } else {
          updateTextElement(element.id, { text: newText });
        }
      }

      // Step 2: 편집 시작이 아닐 때만 커서 복원
      if (!isEditingStartRef.current) {
        // 즉시 실행하지 않고 약간의 지연을 줘서 브라우저 처리 완료 대기
        requestAnimationFrame(() => {
          restoreCursorPosition();
        });
      } else {
        // Step 1: 편집 시작 플래그 해제
        isEditingStartRef.current = false;
      }
    },
    [
      isComposing,
      debouncedUpdate,
      updateTextElement,
      element.id,
      saveCursorPosition,
      restoreCursorPosition,
    ]
  );

  const handleTextBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
        updateTimerRef.current = null;
      }

      const newText = (e.target as HTMLDivElement).textContent || "";
      updateTextElement(element.id, { text: newText });
      setIsEditing(false);
      // Step 1: 편집 종료 시 플래그 초기화
      isEditingStartRef.current = false;
    },
    [updateTextElement, element.id]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
          updateTimerRef.current = null;
        }

        const newText = (e.target as HTMLDivElement).textContent || "";
        updateTextElement(element.id, { text: newText });
        setIsEditing(false);
        isEditingStartRef.current = false;
        textRef.current?.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();

        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
          updateTimerRef.current = null;
        }

        setIsEditing(false);
        isEditingStartRef.current = false;
        setEditingText(element.text || "");
        if (textRef.current) {
          textRef.current.textContent = element.text || "";
        }
        textRef.current?.blur();
      }
    },
    [updateTextElement, element.id, element.text]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || isEditing) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      const scaleX = 1080 / 225;
      const scaleY = 1920 / ((225 * 1920) / 1080);

      const newPosX = dragState.startPosX + deltaX * scaleX;
      const newPosY = dragState.startPosY + deltaY * scaleY;

      updateTextElement(element.id, {
        positionX: newPosX,
        positionY: newPosY,
      });
    },
    [dragState, updateTextElement, element.id, isEditing]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0,
    });
  }, []);

  useEffect(() => {
    if (dragState.isDragging && !isEditing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp, isEditing]);

  // Step 3: 편집 시작 시에만 텍스트 설정 및 전체 선택
  useEffect(() => {
    if (isEditing && textRef.current && isEditingStartRef.current) {
      const element = textRef.current;

      element.textContent = editingText;
      element.focus();

      // Step 3: 편집 시작 시에만 전체 선택
      const selection = window.getSelection();
      const range = document.createRange();
      if (element.firstChild) {
        range.selectNodeContents(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing]); // Step 3: editingText 의존성 제거

  // element.text 변경 시 editingText 동기화
  useEffect(() => {
    if (!isEditing) {
      setEditingText(element.text || "");
    }
  }, [element.text, isEditing]);

  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  // 공통 스타일 정의
  const baseStyle = {
    fontSize: `${element.fontSize}px`,
    fontFamily: element.font,
    color: element.textColor,
    backgroundColor: element.backgroundColor,
  };

  const showBorder =
    !isPlaying && (isHovered || dragState.isDragging || isEditing);
  const borderColor = isEditing ? "#3b82f6" : "#ffffff";

  const displayText = element.text;

  return (
    <div
      style={{
        position: "absolute",
        left: `${element.positionX}px`,
        top: `${element.positionY}px`,
        width: "fit-content",
        height: "auto",
        display: "inline-block",
        padding: "10px",
        whiteSpace: "nowrap",
        borderRadius: "4px",
        boxSizing: "border-box",
        border: showBorder
          ? `1px solid ${borderColor}`
          : "1px solid transparent",
        cursor: isPlaying
          ? "default"
          : isEditing
          ? "text"
          : isHovered
          ? "grab"
          : dragState.isDragging
          ? "grabbing"
          : "grab",
        userSelect: isEditing ? "text" : "none",
        zIndex: dragState.isDragging || isEditing ? 1001 : 1000,
        ...baseStyle,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => !isPlaying && !isEditing && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div
          ref={textRef}
          contentEditable
          onInput={handleTextInput}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          style={{
            height: "100%",
            outline: "none",
            background: "transparent",
            minWidth: "1ch",
            whiteSpace: "nowrap",
          }}
          suppressContentEditableWarning={true}
        />
      ) : (
        <span style={{ whiteSpace: "nowrap" }}>{displayText}</span>
      )}
    </div>
  );
}
