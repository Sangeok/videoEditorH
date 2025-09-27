"use client";

import { useCaptionUpload } from "../model/hooks/useCaptionUpload";
import { useFileHandler } from "../model/hooks/useFileHandler";
import FileUploadArea from "./_components/FileUploadArea";
import { RefObject, useCallback, useMemo, useState } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { formatPlaybackTime } from "@/features/editFeatures/ui/editor-footer/lib/formatTimelineTime";

export default function CaptionEditSubSide() {
  const { state, actions } = useCaptionUpload();
  const { fileInputRef, actions: fileActions } = useFileHandler({
    onFileSelect: actions.processSRTFile,
    onReset: actions.resetUpload,
  });
  const { media, updateTextElement } = useMediaStore();

  // Inline edit state
  const [editing, setEditing] = useState<{ id: string; field: "start" | "end" } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

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

  const beginEdit = useCallback((id: string, field: "start" | "end", currentSeconds: number) => {
    setEditing({ id, field });
    setInputValue(formatPlaybackTime(currentSeconds));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
    setInputValue("");
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

  const commitEdit = useCallback(
    (elementId: string, field: "start" | "end") => {
      const element = media.textElement.find((el) => el.id === elementId);
      if (!element) return cancelEdit();

      const parsed = parseClockTime(inputValue);
      if (parsed === null || parsed < 0) {
        return cancelEdit();
      }

      const newStart = field === "start" ? parsed : element.startTime;
      const newEnd = field === "end" ? parsed : element.endTime;

      // basic validation to avoid invalid ranges
      if (newEnd <= newStart) {
        return cancelEdit();
      }

      // prevent overlapping with other text elements
      if (hasOverlap(elementId, newStart, newEnd)) {
        alert("다른 자막과 시간이 겹칩니다. 겹치지 않도록 시간을 조정해주세요.");
        return cancelEdit();
      }

      updateTextElement(elementId, {
        startTime: newStart,
        endTime: newEnd,
        duration: newEnd - newStart,
      });

      cancelEdit();
    },
    [cancelEdit, hasOverlap, inputValue, media.textElement, parseClockTime, updateTextElement]
  );

  const sortedTextElements = useMemo(() => {
    return [...media.textElement].sort((a, b) => a.startTime - b.startTime);
  }, [media.textElement]);

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Captions</h3>

      <FileUploadArea
        uploadState={state.uploadState}
        errorMessage={state.errorMessage}
        uploadedCount={state.uploadedCount}
        fileInputRef={fileInputRef as RefObject<HTMLInputElement>}
        actions={fileActions}
      />

      <div className="w-full">
        <h4 className="text-md font-medium text-white mb-2">Captions</h4>
        <div className="border border-gray-700 rounded-md max-h-64 overflow-y-auto divide-y divide-gray-800">
          {sortedTextElements.length === 0 ? (
            <div className="p-3 text-sm text-gray-400">No captions loaded</div>
          ) : (
            sortedTextElements.map((el) => (
              <div key={el.id} className="flex flex-col p-2 gap-2">
                <div className="flex w-full justify-center items-center gap-1 text-sm text-gray-200">
                  {editing?.id === el.id && editing.field === "start" ? (
                    <input
                      autoFocus
                      className="w-16 bg-transparent text-white text-center px-1 py-0.5 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => commitEdit(el.id, "start")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(el.id, "start");
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                  ) : (
                    <button
                      className="px-1 hover:text-white/90 decoration-dotted underline-offset-4"
                      onClick={() => beginEdit(el.id, "start", el.startTime)}
                    >
                      {formatPlaybackTime(el.startTime)}
                    </button>
                  )}
                  <span className="opacity-70">-</span>
                  {editing?.id === el.id && editing.field === "end" ? (
                    <input
                      autoFocus
                      className="w-16 bg-transparent text-white text-center px-1 py-0.5 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => commitEdit(el.id, "end")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(el.id, "end");
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                  ) : (
                    <button
                      className="px-1 hover:text-white/90 decoration-dotted underline-offset-4"
                      onClick={() => beginEdit(el.id, "end", el.endTime)}
                    >
                      {formatPlaybackTime(el.endTime)}
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-100 whitespace-pre-wrap break-words text-center">{el.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
