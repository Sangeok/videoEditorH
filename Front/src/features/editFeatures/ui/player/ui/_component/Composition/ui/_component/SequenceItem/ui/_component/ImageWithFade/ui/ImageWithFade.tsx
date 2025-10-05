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
  const draggingTextRect = useSmartGuideStore((state) => state.draggingTextRect);
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
    if (!isDraggingText || !draggingTextRect) {
      if (wasNearRef.current) {
        wasNearRef.current = false;
        lastEdgeRef.current = null;
        setSmartGuides(false, false);
        setNearObjEdgeData(null);
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const compositionContainer = document.getElementById("composition-container") as HTMLDivElement | null;
    if (!compositionContainer) return;

    const img = container.querySelector("img") as HTMLImageElement | null;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const compositionRect = compositionContainer.getBoundingClientRect();
    const scaleX = compositionRect.width / compositionContainer.offsetWidth || 1;
    const scaleY = compositionRect.height / compositionContainer.offsetHeight || 1;

    const leftPosition = (rect.left - compositionRect.left) / scaleX;
    const rightPosition = (rect.right - compositionRect.left) / scaleX;
    const topPosition = (rect.top - compositionRect.top) / scaleY;
    const bottomPosition = (rect.bottom - compositionRect.top) / scaleY;

    const imageTop = topPosition;
    const imageHeight = bottomPosition - topPosition;

    const t = draggingTextRect;

    const intersects = !(
      t.right < leftPosition ||
      t.left > rightPosition ||
      t.bottom < topPosition ||
      t.top > bottomPosition
    );

    const distToLeft = Math.min(Math.abs(t.left - leftPosition), Math.abs(t.right - leftPosition));
    const distToRight = Math.min(Math.abs(t.left - rightPosition), Math.abs(t.right - rightPosition));
    const distToTop = Math.min(Math.abs(t.top - topPosition), Math.abs(t.bottom - topPosition));
    const distToBottom = Math.min(Math.abs(t.top - bottomPosition), Math.abs(t.bottom - bottomPosition));

    const edges = {
      left: { distance: distToLeft, position: leftPosition },
      right: { distance: distToRight, position: rightPosition },
      top: { distance: distToTop, position: topPosition },
      bottom: { distance: distToBottom, position: bottomPosition },
    } as const;

    const edgeArray = Object.entries(edges).map(([key, value]) => ({
      key: key as "left" | "right" | "top" | "bottom",
      distance: value.distance,
      position: value.position,
    }));

    edgeArray.sort((a, b) => a.distance - b.distance);

    const { key: edgeKey, distance, position: edgeXorYPosition } = edgeArray[0];
    const near = intersects && distance <= EDGE_NEAR_PX;

    if (near) {
      if (!wasNearRef.current) {
        wasNearRef.current = true;
      }
      if (lastEdgeRef.current !== edgeKey) {
        if (edgeKey === "left" || edgeKey === "right") {
          setShowVerticalSmartGuide(true);
          setNearObjEdgeData({ edgeKey, distance, edgeXorYPosition, top: imageTop, height: imageHeight });
        } else {
          setShowHorizonSmartGuide(true);
          setNearObjEdgeData({ edgeKey, distance, edgeXorYPosition, top: imageTop, height: imageHeight });
        }
        lastEdgeRef.current = edgeKey;
      }
    } else if (wasNearRef.current) {
      wasNearRef.current = false;
      lastEdgeRef.current = null;
      setSmartGuides(false, false);
      setNearObjEdgeData(null);
    }
  }, [
    isDraggingText,
    draggingTextRect,
    setShowVerticalSmartGuide,
    setShowHorizonSmartGuide,
    setSmartGuides,
    setNearObjEdgeData,
  ]);

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
