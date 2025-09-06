"use client";

import React, { memo, useMemo } from "react";
import { DropPreview as DropPreviewType } from "@/entities/media/useMediaStore";

interface DropPreviewProps {
  dropPreview: DropPreviewType;
  pixelsPerSecond: number;
  className?: string;
}

const DropPreviewComponent = memo(function DropPreview({ dropPreview, pixelsPerSecond, className = "" }: DropPreviewProps) {
  const { startTime, duration, isValid, type, isSnapped, snapPoint, snapType } = dropPreview;

  // 메모이제이션된 계산 - 성능 최적화
  const { left, width, previewStyle, typeIcon, snapIndicatorLeft } = useMemo(() => {
    const left = startTime * pixelsPerSecond;
    const width = duration * pixelsPerSecond;
    
    // 스타일 계산 최적화 - switch 대신 객체 맵 사용
    const baseClasses = "absolute top-0 h-full rounded border-2 pointer-events-none transition-all duration-150";
    
    const typeStyles = {
      text: { color: 'blue', bgOpacity: '30', borderColor: 'blue-400' },
      media: { color: 'green', bgOpacity: '30', borderColor: 'green-400' },
      audio: { color: 'purple', bgOpacity: '30', borderColor: 'purple-400' }
    };
    
    const typeConfig = typeStyles[type] || { color: 'gray', bgOpacity: '30', borderColor: 'gray-400' };
    
    let previewStyle: string;
    
    if (!isValid) {
      previewStyle = `${baseClasses} bg-red-500/20 border-red-500 border-dashed`;
    } else if (isSnapped) {
      const glowClass = "shadow-lg shadow-current/50";
      previewStyle = `${baseClasses} bg-${typeConfig.color}-500/40 border-${typeConfig.color}-300 ${glowClass} border-solid`;
    } else {
      previewStyle = `${baseClasses} bg-${typeConfig.color}-500/${typeConfig.bgOpacity} border-${typeConfig.borderColor}`;
    }
    
    // 타입 아이콘 최적화 - 객체 맵 사용
    const typeIcons = {
      text: '📝',
      media: '🎬',
      audio: '🔊'
    };
    const typeIcon = typeIcons[type] || '📁';
    
    // 스냅 인디케이터 위치 최적화
    const snapIndicatorLeft = snapType === 'start' ? width : 0;
    
    return {
      left,
      width,
      previewStyle,
      typeIcon,
      snapIndicatorLeft
    };
  }, [startTime, duration, pixelsPerSecond, isValid, type, isSnapped, snapType]);

  // 조건부 렌더링 최적화 - 컴포넌트들을 미리 계산
  const contentIconsJsx = useMemo(() => (
    <span className="flex items-center gap-1 text-white drop-shadow-sm">
      <span>{typeIcon}</span>
      {!isValid && <span className="text-red-200">✗</span>}
      {isSnapped && <span className="text-yellow-200">🧲</span>}
    </span>
  ), [typeIcon, isValid, isSnapped]);

  const snapIndicatorJsx = useMemo(() => {
    if (!isSnapped || snapPoint === undefined) return null;
    
    return (
      <div
        className="absolute top-0 w-0.5 h-full bg-yellow-400 shadow-lg shadow-yellow-400/50"
        style={{ left: `${snapIndicatorLeft}px` }}
      >
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 transform rotate-45 ${
            snapType === 'start' ? '-translate-x-1/2' : 'translate-x-1/2'
          }`}
        />
      </div>
    );
  }, [isSnapped, snapPoint, snapIndicatorLeft, snapType]);

  return (
    <div
      className={`${previewStyle} ${className}`}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        zIndex: 1000, // Ensure it appears above other elements
      }}
    >
      {/* Content preview */}
      <div className="h-full flex items-center justify-center text-xs font-medium">
        {contentIconsJsx}
      </div>

      {/* Snap point indicator - 조건부 렌더링 최적화 */}
      {snapIndicatorJsx}

      {/* Conditional animations - 메모이제이션으로 최적화 */}
      {!isValid && (
        <div className="absolute inset-0 rounded animate-pulse bg-red-500/10" />
      )}
      {isSnapped && (
        <div className="absolute inset-0 rounded animate-pulse bg-current/5" />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // 극도로 강화된 비교 함수 - 더 큰 threshold로 렌더링 빈도 감소
  const prev = prevProps.dropPreview;
  const next = nextProps.dropPreview;
  
  // 픽셀 단위로 비교해서 실제 화면상 변화가 없으면 렌더링 스킭
  const prevLeft = prev.startTime * prevProps.pixelsPerSecond;
  const nextLeft = next.startTime * nextProps.pixelsPerSecond;
  const prevWidth = prev.duration * prevProps.pixelsPerSecond;
  const nextWidth = next.duration * nextProps.pixelsPerSecond;
  
  return (
    prevProps.pixelsPerSecond === nextProps.pixelsPerSecond &&
    prevProps.className === nextProps.className &&
    prev.id === next.id &&
    prev.type === next.type &&
    Math.abs(prevLeft - nextLeft) < 2 &&  // 2픽셀 이하 차이면 렌더링 스킵
    Math.abs(prevWidth - nextWidth) < 2 &&
    prev.isValid === next.isValid &&
    prev.isSnapped === next.isSnapped &&
    prev.snapPoint === next.snapPoint &&
    prev.snapType === next.snapType
  );
});

// 최적화된 export
export const DropPreview = DropPreviewComponent;