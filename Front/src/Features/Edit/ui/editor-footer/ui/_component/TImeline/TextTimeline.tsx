"use client";

import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { TextElement } from "@/src/entities/media/types";
import useTimelineStore from "@/src/features/Edit/model/store/useTimelineStore";

export default function TextTimeline() {
  const { media } = useMediaStore();
  const { pixelsPerSecond } = useTimelineStore();

  // 시간(초)을 픽셀로 변환하는 함수
  const timeToPixels = (time: number) => {
    return time * pixelsPerSecond;
  };

  // 텍스트 요소 클릭 핸들러 (향후 선택 기능용)
  const handleTextClick = (textElement: TextElement) => {
    console.log("Text element clicked:", textElement);
  };

  return (
    <div className="relative w-full h-16 bg-gray-800 border-b border-gray-700">
      {/* 트랙 라벨 */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gray-700 border-r border-gray-600 flex items-center justify-center text-xs text-gray-300">
        Text
      </div>

      {/* 텍스트 요소들 */}
      <div className="relative ml-20 h-full">
        {media.textElement.map((textElement) => {
          const leftPosition = timeToPixels(textElement.startTime);
          const width = timeToPixels(
            textElement.endTime - textElement.startTime
          );

          return (
            <div
              key={textElement.id}
              className="absolute top-2 h-12 bg-blue-500 hover:bg-blue-600 border border-blue-400 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center text-white text-xs font-medium overflow-hidden"
              style={{
                left: `${leftPosition}px`,
                width: `${width}px`,
                minWidth: "60px", // 최소 너비 설정
              }}
              onClick={() => handleTextClick(textElement)}
              title={`${textElement.text} (${textElement.startTime}s - ${textElement.endTime}s)`}
            >
              {/* 텍스트 내용 (너비에 따라 조정) */}
              <span className="truncate px-2">
                {textElement.text || "Text"}
              </span>
            </div>
          );
        })}
      </div>

      {/* 빈 상태 메시지 */}
      {media.textElement.length === 0 && (
        <div className="absolute left-20 top-0 w-full h-full flex items-center justify-center text-gray-500 text-sm">
          텍스트 요소가 없습니다. 텍스트를 추가해보세요.
        </div>
      )}
    </div>
  );
}
