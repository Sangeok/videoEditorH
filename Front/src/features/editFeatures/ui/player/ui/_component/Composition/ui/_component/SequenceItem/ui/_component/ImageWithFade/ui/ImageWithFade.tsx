"use client";

import { AbsoluteFill, Img, useCurrentFrame, interpolate } from "remotion";
import { MediaElement } from "@/entities/media/types";
import { useCallback, useEffect, useRef } from "react";
import { useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";

interface ImageWithFadeProps {
  imageElement: MediaElement;
  durationInFrames: number;
  fps: number;
}

export const ImageWithFade = ({ imageElement, durationInFrames, fps }: ImageWithFadeProps) => {
  const frame = useCurrentFrame();
  const isDraggingText = useSmartGuideStore((state) => state.isDraggingText);
  const setShowVerticalSmartGuide = useSmartGuideStore((state) => state.setShowVerticalSmartGuide);
  const setShowHorizonSmartGuide = useSmartGuideStore((state) => state.setShowHorizonSmartGuide);
  const setSmartGuides = useSmartGuideStore((state) => state.setSmartGuides);
  const setNearObjEdgeData = useSmartGuideStore((state) => state.setNearObjEdgeData);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wasNearRef = useRef(false);
  const lastEdgeRef = useRef<"left" | "right" | "top" | "bottom" | null>(null);
  const EDGE_NEAR_PX = 8; // 가장자리 근접 임계값(px)

  let opacity = 1;

  // Calculate fade in opacity
  if (imageElement.fadeIn) {
    const fadeInFrames = Math.floor((imageElement.fadeInDuration || 0.5) * fps);
    opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  useEffect(() => {
    if (!isDraggingText) return;

    const onMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const img = container.querySelector("img") as HTMLImageElement | null;
      if (!img) return;

      const rect = img.getBoundingClientRect();
      const { clientX: x, clientY: y } = e;

      const insideRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      let near = false as boolean;
      let nearestEdge: "left" | "right" | "top" | "bottom" | null = null;
      let nearestEdgeData = null;

      if (insideRect) {
        const distToLeft = x - rect.left;
        const distToRight = rect.right - x;
        const distToTop = y - rect.top;
        const distToBottom = rect.bottom - y;

        const leftPosition = rect.left;
        const rightPosition = rect.right;
        const topPosition = rect.top;
        const bottomPosition = rect.bottom;

        const edges = {
          left: { distance: distToLeft, position: leftPosition },
          right: { distance: distToRight, position: rightPosition },
          top: { distance: distToTop, position: topPosition },
          bottom: { distance: distToBottom, position: bottomPosition },
        };

        const edgeArray = Object.entries(edges).map(([key, value]) => ({
          key: key as "left" | "right" | "top" | "bottom",
          distance: value.distance,
          position: value.position,
        }));

        edgeArray.sort((a, b) => a.distance - b.distance);

        const { key: edgeKey, distance, position: edgeXorYPosition } = edgeArray[0];
        nearestEdge = edgeKey;
        near = distance <= EDGE_NEAR_PX;
        nearestEdgeData = { edgeKey, distance, edgeXorYPosition };
      }

      if (near) {
        if (!wasNearRef.current) {
          wasNearRef.current = true;
        }
        if (nearestEdge && lastEdgeRef.current !== nearestEdge) {
          if (nearestEdge === "left" || nearestEdge === "right") {
            setShowVerticalSmartGuide(true);
            setNearObjEdgeData(nearestEdgeData);
          } else if (nearestEdge === "top" || nearestEdge === "bottom") {
            setShowHorizonSmartGuide(true);
            setNearObjEdgeData(nearestEdgeData);
          }
          lastEdgeRef.current = nearestEdge;
        }
      } else if (!near && wasNearRef.current) {
        wasNearRef.current = false;
        lastEdgeRef.current = null;
        setSmartGuides(false, false);
        setNearObjEdgeData(null);
      }
    };

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
    };
  }, [isDraggingText]);

  const handleMouseLeave = useCallback(() => {
    wasNearRef.current = false;
    lastEdgeRef.current = null;
    setSmartGuides(false, false);
    setNearObjEdgeData(null);
  }, [setSmartGuides, setNearObjEdgeData]);

  // Calculate fade out opacity
  if (imageElement.fadeOut) {
    const fadeOutFrames = Math.floor((imageElement.fadeOutDuration || 0.5) * fps);
    const fadeOutStartFrame = durationInFrames - fadeOutFrames;
    const fadeOutOpacity = interpolate(frame, [fadeOutStartFrame, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = Math.min(opacity, fadeOutOpacity);
  }

  return (
    <AbsoluteFill
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      className="h-full"
      style={{
        zIndex: 100,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <Img
        style={{
          pointerEvents: "none",
          zIndex: 100,
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
        src={imageElement.url || ""}
        alt={"image"}
      />
    </AbsoluteFill>
  );
};
