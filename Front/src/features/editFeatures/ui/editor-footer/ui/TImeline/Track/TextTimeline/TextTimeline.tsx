"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { TextElement } from "@/entities/media/types";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { timeToPixels } from "@/features/editFeatures/ui/editor-footer/lib/zoomUtils";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";

export default function TextTimeline() {
  const { media, deleteTextElement } = useMediaStore();

  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const isDelete = useTimelineToolStore((state) => state.isDelete);

  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );

  const handleTextClick = (textElement: TextElement) => {
    if (isDelete) {
      deleteTextElement(textElement.id);
    } else {
      setSelectedTrackAndId("Text", textElement.id);
    }
  };

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {/* text elements */}
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
              className="absolute top-2 h-12 bg-gray-700 hover:bg-gray-800 border-1 border-b-4 border-gray-500 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center text-white text-xs font-medium overflow-hidden"
              style={{
                left: `${leftPosition}px`,
                width: `${width}px`,
              }}
              onClick={() => handleTextClick(textElement)}
              title={`${textElement.text} (${textElement.startTime}s - ${textElement.endTime}s)`}
            >
              {/* text content (adjust width) */}
              <span className="truncate px-2">{textElement.id || "Text"}</span>
            </div>
          );
        })}
      </div>

      {/* empty state message */}
      {media.textElement.length === 0 && (
        <div className="absolute top-0 w-full h-full flex items-center justify-center text-gray-500 text-sm">
          There is no text element.
        </div>
      )}
    </div>
  );
}
