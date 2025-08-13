import { useMediaStore } from "@/entities/media/useMediaStore";
import { useState, useCallback, useRef, useEffect } from "react";

interface UseTextEditProps {
  elementId: string;
  initialText: string;
  isPlaying: boolean;
}

export const useTextEdit = ({
  elementId,
  initialText,
  isPlaying,
}: UseTextEditProps) => {
  const { updateTextElement } = useMediaStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(initialText);
  const [isComposing, setIsComposing] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cursorPositionRef = useRef<number>(0);
  const isEditingStartRef = useRef<boolean>(false);

  // Cursor position management
  const saveCursorPosition = useCallback(() => {
    if (textRef.current && isEditing) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        cursorPositionRef.current = range.startOffset;
      }
    }
  }, [isEditing]);

  const restoreCursorPosition = useCallback(() => {
    if (textRef.current && isEditing && !isEditingStartRef.current) {
      const selection = window.getSelection();
      const textNode = textRef.current.firstChild;

      if (textNode && selection) {
        const maxOffset = textNode.textContent?.length || 0;
        const safeOffset = Math.min(cursorPositionRef.current, maxOffset);

        try {
          const range = document.createRange();
          range.setStart(textNode, safeOffset);
          range.collapse(true);

          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.warn("Failed to restore cursor position:", error);
        }
      }
    }
  }, [isEditing]);

  // Debounced update for Korean text
  const debouncedUpdate = useCallback(
    (text: string) => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }

      updateTimerRef.current = setTimeout(() => {
        updateTextElement(elementId, { text });
      }, 300);
    },
    [updateTextElement, elementId]
  );

  // Event handlers
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying) return;

      e.preventDefault();
      e.stopPropagation();

      isEditingStartRef.current = true;
      setIsEditing(true);
      setEditingText(initialText);
    },
    [isPlaying, initialText]
  );

  const handleTextInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
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
          updateTextElement(elementId, { text: newText });
        }
      }

      if (!isEditingStartRef.current) {
        requestAnimationFrame(() => {
          restoreCursorPosition();
        });
      } else {
        isEditingStartRef.current = false;
      }
    },
    [
      isComposing,
      debouncedUpdate,
      updateTextElement,
      elementId,
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
      updateTextElement(elementId, { text: newText });
      setIsEditing(false);
      isEditingStartRef.current = false;
    },
    [updateTextElement, elementId]
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
        updateTextElement(elementId, { text: newText });
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
        setEditingText(initialText);
        if (textRef.current) {
          textRef.current.textContent = initialText;
        }
        textRef.current?.blur();
      }
    },
    [updateTextElement, elementId, initialText]
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLDivElement>) => {
      setIsComposing(false);
      const newText = (e.target as HTMLDivElement).textContent || "";
      setEditingText(newText);
      updateTextElement(elementId, { text: newText });
    },
    [updateTextElement, elementId]
  );

  // Focus and select text when editing starts
  useEffect(() => {
    if (isEditing && textRef.current && isEditingStartRef.current) {
      const element = textRef.current;

      element.textContent = editingText;
      element.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      if (element.firstChild) {
        range.selectNodeContents(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing, editingText]);

  // Sync with external text changes
  useEffect(() => {
    if (!isEditing) {
      setEditingText(initialText);
    }
  }, [initialText, isEditing]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  return {
    isEditing,
    editingText,
    textRef,
    handleDoubleClick,
    handleTextInput,
    handleTextBlur,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  };
};
