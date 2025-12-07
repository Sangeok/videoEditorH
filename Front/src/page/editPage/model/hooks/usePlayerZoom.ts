"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// Zoom 설정 상수
const PLAYER_ZOOM = {
  MIN: 0.5,
  MAX: 2,
  STEP: 0.1,
} as const;

// 반환 타입 정의
interface UsePlayerZoomReturn {
  zoom: number;
  playerContainerRef: React.RefObject<HTMLDivElement | null>;
  zoomControls: {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
  };
}

/**
 * Control Player Container Zoom
 */
export function usePlayerZoom(): UsePlayerZoomReturn {
  const [zoom, setZoom] = useState<number>(1);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Clamp Zoom Value
  const clampZoom = useCallback((value: number): number => {
    return Math.max(PLAYER_ZOOM.MIN, Math.min(PLAYER_ZOOM.MAX, value));
  }, []);

  // Wheel Event Handler (Ctrl + Wheel)
  const handleZoomWheel = useCallback(
    (event: WheelEvent) => {
      if (!event.ctrlKey) {
        return;
      }

      const containerNode = playerContainerRef.current;
      if (!containerNode || !containerNode.contains(event.target as Node)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const delta = event.deltaY < 0 ? PLAYER_ZOOM.STEP : -PLAYER_ZOOM.STEP;
      setZoom((prev) => clampZoom(prev + delta));
    },
    [clampZoom]
  );

  // Manual Zoom Control
  const zoomIn = useCallback(() => {
    setZoom((prev) => clampZoom(prev + PLAYER_ZOOM.STEP));
  }, [clampZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => clampZoom(prev - PLAYER_ZOOM.STEP));
  }, [clampZoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // Wheel Event Listener Register/Unregister
  useEffect(() => {
    window.addEventListener("wheel", handleZoomWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleZoomWheel);
    };
  }, [handleZoomWheel]);

  return {
    zoom,
    playerContainerRef,
    zoomControls: {
      zoomIn,
      zoomOut,
      resetZoom,
    },
  };
}
