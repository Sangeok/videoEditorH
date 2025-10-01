"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { useCallback, useMemo, useState } from "react";

export const useCaptionEdit = () => {
  const { media, updateTextElement } = useMediaStore();

  // Inline edit state
  const [editing, setEditing] = useState<{ id: string; field: "start" | "end" | "text" } | null>(null);

  const sortedTextElements = useMemo(() => {
    return [...media.textElement].sort((a, b) => a.startTime - b.startTime);
  }, [media.textElement]);

  const hasNoTextElement = sortedTextElements.length === 0;

  // Parse time inputs like mm:ss or h:mm:ss into seconds
  const parseClockTime = useCallback((value: string): number | null => {
    const trimmed = value.trim();
    if (!/^\d{1,2}(:\d{2}){1,2}$/.test(trimmed)) {
      // allow h:mm:ss or mm:ss (00 padded seconds required)
      return null;
    }
    const parts = trimmed.split(":").map((p) => Number(p));
    if (parts.some((n) => Number.isNaN(n))) return null;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (parts.length === 2) {
      [minutes, seconds] = parts;
    } else {
      [hours, minutes, seconds] = parts;
    }
    if (seconds > 59 || minutes > 59) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }, []);

  const beginEdit = useCallback((id: string, field: "start" | "end") => {
    setEditing({ id, field });
  }, []);

  const beginTextEdit = useCallback((id: string) => {
    setEditing({ id, field: "text" });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const hasOverlap = useCallback(
    (elementId: string, newStart: number, newEnd: number): boolean => {
      // overlap if [newStart, newEnd) intersects with any other [startTime, endTime)
      // allow touching edges (==) without overlap
      return media.textElement.some(
        (other) => other.id !== elementId && newStart < other.endTime && newEnd > other.startTime
      );
    },
    [media.textElement]
  );

  // inline TimeEditable, caret, sanitize 로직은 외부 컴포넌트로 이동

  const commitClockEdit = useCallback(
    (elementId: string, field: "start" | "end", draftText: string) => {
      const element = media.textElement.find((el) => el.id === elementId);
      if (!element) return cancelEdit();

      const parsed = parseClockTime(draftText);
      if (parsed === null || parsed < 0) {
        return cancelEdit();
      }

      const newStart = field === "start" ? parsed : element.startTime;
      const newEnd = field === "end" ? parsed : element.endTime;

      if (newEnd <= newStart) {
        return cancelEdit();
      }

      if (hasOverlap(elementId, newStart, newEnd)) {
        alert("Overlap detected between other captions");
        return cancelEdit();
      }

      updateTextElement(elementId, {
        startTime: newStart,
        endTime: newEnd,
        duration: newEnd - newStart,
      });

      cancelEdit();
    },
    [cancelEdit, hasOverlap, media.textElement, parseClockTime, updateTextElement]
  );

  // text edit
  const commitTextEdit = useCallback(
    (elementId: string, newText: string) => {
      const element = media.textElement.find((el) => el.id === elementId);
      if (!element) return cancelEdit();

      updateTextElement(elementId, { text: newText });
      cancelEdit();
    },
    [cancelEdit, media.textElement, updateTextElement]
  );

  return {
    state: {
      editing,
      sortedTextElements,
      hasNoTextElement,
    },
    actions: {
      beginEdit,
      beginTextEdit,
      cancelEdit,
      commitClockEdit,
      commitTextEdit,
    },
  };
};
