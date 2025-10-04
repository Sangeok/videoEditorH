"use client";

import { memo, useEffect, useState, RefObject } from "react";
import { useSmartGuideStore } from "@/features/editFeatures/model/store/useSmartGuideStore";
import { PLAYER_CONFIG } from "@/features/editFeatures/ui/player/config/playerConfig";

/**
 * Player 캔버스 중앙에 가이드라인을 표시하는 오버레이 컴포넌트
 * - 텍스트 드래그 시 중앙 정렬을 돕기 위한 시각적 가이드
 * - 수직 가이드: 캔버스 가로 중앙
 * - 수평 가이드: 캔버스 세로 중앙
 */
interface SmartGuideOverlayProps {
  containerRef?: RefObject<HTMLDivElement | null>;
}

const SmartGuideOverlay = memo(({ containerRef }: SmartGuideOverlayProps) => {
  const showObjectEdgeSmartGuide = useSmartGuideStore((state) => state.showObjectEdgeSmartGuide);
  const nearObjEdgeData = useSmartGuideStore((state) => state.nearObjEdgeData);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const getRelativePos = (pos: number, axis: "x" | "y") => {
    const rect = containerRef?.current?.getBoundingClientRect();
    if (!rect) return pos;

    // viewport delta from container's top/left
    const deltaViewport = axis === "y" ? pos - rect.top : pos - rect.left;

    // compute scale applied to composition (display size / composition size)
    const scaleX = rect.width / PLAYER_CONFIG.COMPOSITION_WIDTH;
    const scaleY = rect.height / PLAYER_CONFIG.COMPOSITION_HEIGHT;

    // convert viewport-space delta to composition's local CSS coordinate
    const scale = axis === "y" ? scaleY : scaleX;
    if (scale === 0) return deltaViewport; // safety
    return deltaViewport / scale;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      {showObjectEdgeSmartGuide && nearObjEdgeData && (
        <>
          {(nearObjEdgeData.edgeKey === "top" || nearObjEdgeData.edgeKey === "bottom") && (
            <div
              style={{
                position: "absolute",
                top: getRelativePos(nearObjEdgeData.edgeXorYPosition, "y"),
                left: 0,
                width: "100%",
                height: 0,
                borderTop: "5px solid #9370DB",
                boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
                opacity: 0.9,
              }}
            />
          )}
          {(nearObjEdgeData.edgeKey === "left" || nearObjEdgeData.edgeKey === "right") && (
            <div
              style={{
                position: "absolute",
                left: getRelativePos(nearObjEdgeData.edgeXorYPosition, "x"),
                top: 0,
                width: 0,
                height: "100%",
                borderLeft: "5px solid #9370DB",
                boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
                opacity: 0.9,
              }}
            />
          )}
        </>
      )}
      {/* {showObjectEdgeSmartGuide && nearObjEdgeData && (
        <>
          {(nearObjEdgeData.edgeKey === "top" || nearObjEdgeData.edgeKey === "bottom") && (
            <div
              style={{
                position: "absolute",
                top: nearObjEdgeData.edgeXorYPosition,
                left: 0,
                width: "100%",
                height: 0,
                borderTop: "1px solid #9370DB",
                boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
                opacity: 0.9,
              }}
            />
          )}
          {(nearObjEdgeData.edgeKey === "left" || nearObjEdgeData.edgeKey === "right") && (
            <div
              style={{
                position: "absolute",
                left: nearObjEdgeData.edgeXorYPosition,
                top: 0,
                width: 0,
                height: "100%",
                borderLeft: "1px solid #9370DB",
                boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
                opacity: 0.9,
              }}
            />
          )}
        </>
      )} */}
      {/* {showObjectEdgeSmartGuide && nearObjEdgeData?.edgeKey === "left" && (
        <div
          style={{
            position: "fixed",
            left: `${nearObjEdgeData.edgeXorYPosition}px`,
            top: 0,
            width: "1px",
            height: "100%",
            background: "#9370DB",
            opacity: 0.9,
            boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
          }}
        />
      )}
      {showObjectEdgeSmartGuide && nearObjEdgeData?.edgeKey === "right" && (
        <div
          style={{
            position: "fixed",
            right: `${nearObjEdgeData.edgeXorYPosition}px`,
            top: 0,
            width: "1px",
            height: "100%",
            background: "#9370DB",
            opacity: 0.9,
            boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
          }}
        />
      )}
      {showObjectEdgeSmartGuide && nearObjEdgeData?.edgeKey === "top" && (
        <div
          style={{
            position: "fixed",
            top: `${nearObjEdgeData.edgeXorYPosition}px`,
            left: 0,
            width: "100%",
            height: "5px",
            background: "#9370DB",
            opacity: 0.9,
            boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
          }}
        />
      )}
      {showObjectEdgeSmartGuide && nearObjEdgeData?.edgeKey === "bottom" && (
        <div
          style={{
            position: "fixed",
            bottom: `${nearObjEdgeData.edgeXorYPosition}px`,
            left: 0,
            width: "100%",
            height: "1px",
            background: "#9370DB",
            opacity: 0.9,
            boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
          }}
        />
      )} */}
      {/* {showObjectEdgeSmartGuide && (
        <div
          style={{
            position: "absolute",
            left: `${PLAYER_CONFIG.COMPOSITION_WIDTH / 2}px`,
            top: 0,
            width: "1px",
            height: "100%",
            background: "#9370DB",
            opacity: 0.9,
            boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
          }}
        />
      )} */}

      {/* 수평 가이드 (캔버스 세로 중앙) */}
      {/* {showObjectEdgeSmartGuide && (
        <div
          style={{
            position: "absolute",
            top: `${PLAYER_CONFIG.COMPOSITION_HEIGHT / 2}px`,
            left: 0,
            width: "100%",
            height: "1px",
            background: "#9370DB",
            opacity: 0.9,
            boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
          }}
        />
      )} */}
    </div>
  );
});

SmartGuideOverlay.displayName = "SmartGuideOverlay";

export default SmartGuideOverlay;
