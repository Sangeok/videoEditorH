import { JSX } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
  Audio,
} from "remotion";
import DraggableText from "./DraggableText/ui/DraggableText";
import {
  AudioElement,
  MediaElement,
  TextElement,
} from "@/src/entities/media/types";

interface SequenceItemOptions {
  fps: number;
}

export const SequenceItem: Record<
  string,
  (
    item: TextElement | MediaElement,
    options: SequenceItemOptions
  ) => JSX.Element
> = {
  text: (item, options: SequenceItemOptions) => {
    const textElement = item as TextElement;
    const fromFrame = Math.floor(textElement.startTime * options.fps);
    const durationInFrames = Math.floor(
      (textElement.endTime - textElement.startTime) * options.fps
    );

    return (
      <Sequence
        key={textElement.id}
        from={fromFrame}
        durationInFrames={durationInFrames}
        name={`Text: ${textElement.text.substring(0, 20)}...`}
        style={{ height: "100%", border: "5px solid red", overflow: "hidden" }}
      >
        <AbsoluteFill className="h-full">
          <DraggableText element={textElement} />
        </AbsoluteFill>
      </Sequence>
    );
  },

  image: (item, options: SequenceItemOptions) => {
    const imageElement = item as MediaElement;
    const fromFrame = Math.floor(imageElement.startTime * options.fps);
    const durationInFrames = Math.floor(
      (imageElement.endTime - imageElement.startTime) * options.fps
    );

    console.log("왔나?");

    const ImageWithFade = () => {
      const frame = useCurrentFrame();

      let opacity = 1;

      // Calculate fade in opacity
      if (imageElement.fadeIn) {
        const fadeInFrames = Math.floor(
          (imageElement.fadeInDuration || 0.5) * options.fps
        );
        opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      }

      // Calculate fade out opacity
      if (imageElement.fadeOut) {
        const fadeOutFrames = Math.floor(
          (imageElement.fadeOutDuration || 0.5) * options.fps
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

    return (
      <Sequence
        key={imageElement.id}
        from={fromFrame}
        durationInFrames={durationInFrames}
        name={`Image: ${imageElement.id}`}
        style={{
          height: "100%",
          border: "5px solid blue",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <ImageWithFade />
      </Sequence>
    );
  },

  audio: (item, options: SequenceItemOptions) => {
    const audioElement = item as AudioElement;
    const fromFrame = Math.floor(audioElement.startTime * options.fps);
    const durationInFrames = Math.floor(
      (audioElement.endTime - audioElement.startTime) * options.fps
    );

    return (
      <Sequence
        key={audioElement.id}
        from={fromFrame}
        durationInFrames={durationInFrames}
        name={`Audio: ${audioElement.id}`}
      >
        <AbsoluteFill>
          <Audio
            src={audioElement.url || ""}
            volume={audioElement.volume || 100}
          />
        </AbsoluteFill>
      </Sequence>
    );
  },
};
