"use client";

import { useCaptionUpload } from "../model/hooks/useCaptionUpload";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import { useCallback, useMemo, useState } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import TextEdit from "./_components/TextEdit/ui";
import ClockField from "./_components/TimeEdit/ui/ClockField";

export default function CaptionEditSubSide() {
  const { state, actions, fileInputRef } = useCaptionUpload();
  const { media, updateTextElement } = useMediaStore();

  // Inline edit state
  const [editing, setEditing] = useState<{ id: string; field: "start" | "end" | "text" } | null>(null);

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

  const sortedTextElements = useMemo(() => {
    return [...media.textElement].sort((a, b) => a.startTime - b.startTime);
  }, [media.textElement]);

  const hasNoTextElement = sortedTextElements.length === 0;

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Captions</h3>

      <MediaFileUploadArea
        mediaType="caption"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <div className="w-full">
        <h4 className="text-md font-medium text-white mb-2">Captions</h4>
        <div className="border border-gray-700 rounded-md max-h-64 overflow-y-auto divide-y divide-gray-800">
          {hasNoTextElement ? (
            <div className="p-3 text-sm text-gray-400">No captions loaded</div>
          ) : (
            sortedTextElements.map((el) => (
              <div key={el.id} className="flex flex-col p-2 gap-2">
                <div className="flex w-full justify-center items-center gap-1 text-sm text-gray-200">
                  <ClockField
                    isEditing={editing?.id === el.id && editing.field === "start"}
                    valueSeconds={el.startTime}
                    onBegin={() => beginEdit(el.id, "start")}
                    onCommit={(text) => commitClockEdit(el.id, "start", text)}
                    onCancel={cancelEdit}
                  />
                  <span className="opacity-70">-</span>
                  <ClockField
                    isEditing={editing?.id === el.id && editing.field === "end"}
                    valueSeconds={el.endTime}
                    onBegin={() => beginEdit(el.id, "end")}
                    onCommit={(text) => commitClockEdit(el.id, "end", text)}
                    onCancel={cancelEdit}
                  />
                </div>
                <TextEdit
                  editing={editing}
                  element={el}
                  commitTextEdit={commitTextEdit}
                  cancelEdit={cancelEdit}
                  beginTextEdit={beginTextEdit}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
