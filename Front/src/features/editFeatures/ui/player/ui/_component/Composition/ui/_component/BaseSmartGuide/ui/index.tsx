"use client";

import { memo } from "react";
import { PLAYER_CONFIG } from "@/features/editFeatures/ui/player/config/playerConfig";

/**
 * Player 캔버스 중앙에 가이드라인을 표시하는 오버레이 컴포넌트
 * - 텍스트 드래그 시 중앙 정렬을 돕기 위한 시각적 가이드
 * - 수직 가이드: 캔버스 가로 중앙
 * - 수평 가이드: 캔버스 세로 중앙
 */
const BaseSmartGuide = memo(() => {
  // const { showVerticalGuide, showHorizontalGuide } = useSmartGuideStore();

  // // 가이드라인이 하나도 표시되지 않으면 렌더링하지 않음
  // if (!showVerticalGuide && !showHorizontalGuide) return null;

  // // Composition 좌표계의 중앙점
  // const canvasCenterX = PLAYER_CONFIG.COMPOSITION_WIDTH / 2; // 540px
  // const canvasCenterY = PLAYER_CONFIG.COMPOSITION_HEIGHT / 2; // 960px

  // // Display 좌표계로 변환
  // const scaleX = PLAYER_CONFIG.PLAYER_DISPLAY_WIDTH / PLAYER_CONFIG.COMPOSITION_WIDTH;
  // const scaleY = PLAYER_CONFIG.PLAYER_DISPLAY_HEIGHT / PLAYER_CONFIG.COMPOSITION_HEIGHT;

  // const displayCenterX = canvasCenterX * scaleX;
  // const displayCenterY = canvasCenterY * scaleY;

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
      {
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
      }

      {/* 수평 가이드 (캔버스 세로 중앙) */}
      {
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
      }
    </div>
  );
});

BaseSmartGuide.displayName = "BaseSmartGuide";

export default BaseSmartGuide;
