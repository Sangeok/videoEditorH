import { AbsoluteFill, Img, useCurrentFrame, interpolate } from "remotion";
import { MediaElement } from "@/entities/media/types";

interface ImageWithFadeProps {
  imageElement: MediaElement;
  durationInFrames: number;
  fps: number;
}

export const ImageWithFade = ({
  imageElement,
  durationInFrames,
  fps,
}: ImageWithFadeProps) => {
  const frame = useCurrentFrame();

  let opacity = 1;

  // Calculate fade in opacity
  if (imageElement.fadeIn) {
    const fadeInFrames = Math.floor((imageElement.fadeInDuration || 0.5) * fps);
    opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Calculate fade out opacity
  if (imageElement.fadeOut) {
    const fadeOutFrames = Math.floor(
      (imageElement.fadeOutDuration || 0.5) * fps
    );
    const fadeOutStartFrame = durationInFrames - fadeOutFrames;
    const fadeOutOpacity = interpolate(
      frame,
      [fadeOutStartFrame, durationInFrames],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    opacity = Math.min(opacity, fadeOutOpacity);
  }

  return (
    <AbsoluteFill
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
