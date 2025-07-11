"use client";

import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { TextElement } from "@/src/entities/media/types";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";
import { timeToPixels } from "@/src/features/Edit/ui/editor-footer/lib/zoomUtils";
import { useTimelineToolStore } from "@/src/features/Edit/model/store/useTimelieToolStore";
import { useSelectedTrackStore } from "@/src/features/Edit/model/store/useSelectedTrackStore";

export default function TextTimeline() {
  const { media, deleteTextElement } = useMediaStore();
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const isDelete = useTimelineToolStore((state) => state.isDelete);
  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );

  // 텍스트 요소 클릭 핸들러 (향후 선택 기능용)
  const handleTextClick = (textElement: TextElement) => {
    if (isDelete) {
      deleteTextElement(textElement.id);
    } else {
      setSelectedTrackAndId("Text", textElement.id);
    }
  };

  return (
    <div className="relative w-full h-16 bg-zinc-900">
      {/* 텍스트 요소들 */}
      <div className="relative h-full">
        {media.textElement.map((textElement) => {
          const leftPosition = timeToPixels(
            textElement.startTime,
            pixelsPerSecond
          );
          const width = timeToPixels(
            textElement.endTime - textElement.startTime,
            pixelsPerSecond
          );

          return (
            <div
              key={textElement.id}
              className="absolute top-2 h-12 bg-gray-700 hover:bg-gray-800 border-1 border-gray-500 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center text-white text-xs font-medium overflow-hidden"
              style={{
                left: `${leftPosition}px`,
                width: `${width}px`,
                minWidth: "60px", // 최소 너비 설정
              }}
              onClick={() => handleTextClick(textElement)}
              title={`${textElement.text} (${textElement.startTime}s - ${textElement.endTime}s)`}
            >
              {/* 텍스트 내용 (너비에 따라 조정) */}
              <span className="truncate px-2">{textElement.id || "Text"}</span>
            </div>
          );
        })}
      </div>

      {/* 빈 상태 메시지 */}
      {media.textElement.length === 0 && (
        <div className="absolute top-0 w-full h-full flex items-center justify-center text-gray-500 text-sm">
          There is no text element.
        </div>
      )}
    </div>
  );
}
