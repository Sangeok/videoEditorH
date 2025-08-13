"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { MediaElement } from "@/entities/media/types";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { timeToPixels } from "@/features/editFeatures/ui/editor-footer/lib/zoomUtils";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";

export default function MediaTimeline() {
  const { media, deleteMediaElement } = useMediaStore();

  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const isDelete = useTimelineToolStore((state) => state.isDelete);

  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );

  // 텍스트 요소 클릭 핸들러 (향후 선택 기능용)
  const handleMediaClick = (mediaElement: MediaElement) => {
    if (isDelete) {
      deleteMediaElement(mediaElement.id);
    } else {
      const clickedTrack = mediaElement.type === "video" ? "Video" : "Image";
      setSelectedTrackAndId(clickedTrack, mediaElement.id);
    }
  };

  console.log(media.mediaElement);

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {/* 텍스트 요소들 */}
      <div className="relative h-full">
        {media.mediaElement.map((mediaElement) => {
          const leftPosition = timeToPixels(
            mediaElement.startTime,
            pixelsPerSecond
          );
          const width = timeToPixels(
            mediaElement.endTime - mediaElement.startTime,
            pixelsPerSecond
          );

          return (
            <div
              key={mediaElement.id}
              className="absolute top-2 h-12 bg-gray-700 border-b-4 hover:bg-gray-800 border-1 border-gray-500 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center text-white text-xs font-medium overflow-hidden"
              style={{
                left: `${leftPosition}px`,
                width: `${width}px`,
              }}
              onClick={() => handleMediaClick(mediaElement)}
              title={`${mediaElement.type} (${mediaElement.startTime}s - ${mediaElement.endTime}s)`}
            >
              {/* 텍스트 내용 (너비에 따라 조정) */}
              <span className="truncate px-2">{mediaElement.id || "Text"}</span>
            </div>
          );
        })}
      </div>

      {/* 빈 상태 메시지 */}
      {media.mediaElement.length === 0 && (
        <div className="absolute top-0 w-full h-full flex items-center justify-center text-gray-500 text-sm">
          There is no media element.
        </div>
      )}
    </div>
  );
}
