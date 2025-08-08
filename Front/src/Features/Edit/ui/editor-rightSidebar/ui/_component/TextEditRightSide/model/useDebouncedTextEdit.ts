"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TextElement } from "@/src/entities/media/types";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { DebouncedTextEditState, DebouncedTextEditActions } from "./types";

const DEBOUNCE_DELAY = 300;

export function useDebouncedTextEdit(
  selectedTrackId: string | null
): DebouncedTextEditState & DebouncedTextEditActions {
  const { updateTextElement } = useMediaStore();
  const textElement = useMediaStore((state) =>
    state.media.textElement.find((element) => element.id === selectedTrackId)
  );

  const [localState, setLocalState] = useState<DebouncedTextEditState>({
    localText: "",
    localWidth: "",
    localFontSize: "",
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with textElement changes
  useEffect(() => {
    const newState = textElement
      ? {
          localText: textElement.text || "",
          localWidth: textElement.width?.toString() || "",
          localFontSize: textElement.fontSize?.toString() || "",
        }
      : {
          localText: "",
          localWidth: "",
          localFontSize: "",
        };

    setLocalState(newState);
  }, [textElement]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const debouncedUpdateTextElement = useCallback(
    (field: keyof TextElement, value: number | string) => {
      if (!selectedTrackId) return;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        updateTextElement(selectedTrackId, { [field]: value });
      }, DEBOUNCE_DELAY);
    },
    [selectedTrackId, updateTextElement]
  );

  const handleTextChange = useCallback(
    (value: string) => {
      setLocalState((prev) => ({ ...prev, localText: value }));
      debouncedUpdateTextElement("text", value);
    },
    [debouncedUpdateTextElement]
  );

  const handleWidthChange = useCallback(
    (value: string) => {
      setLocalState((prev) => ({ ...prev, localWidth: value }));
      const numericValue = parseNumericValue(value);
      if (numericValue !== null) {
        debouncedUpdateTextElement("width", numericValue);
      }
    },
    [debouncedUpdateTextElement]
  );

  const handleFontSizeChange = useCallback(
    (value: string) => {
      setLocalState((prev) => ({ ...prev, localFontSize: value }));
      const numericValue = parseNumericValue(value);
      if (numericValue !== null) {
        debouncedUpdateTextElement("fontSize", numericValue);
      }
    },
    [debouncedUpdateTextElement]
  );

  return {
    ...localState,
    handleTextChange,
    handleWidthChange,
    handleFontSizeChange,
  };
}

function parseNumericValue(value: string): number | null {
  const numericValue = Number(value);
  return isNaN(numericValue) ? null : numericValue;
}
