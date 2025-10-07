import { JSX } from "react";
import { AbsoluteFill, Sequence, Audio, OffthreadVideo } from "remotion";
import DraggableText from "./_component/DraggableText/ui/DraggableText";
import { AudioElement, MediaElement, TextElement, TrackElement } from "@/entities/media/types";
import { ImageWithFade } from "./_component/ImageWithFade/ui/ImageWithFade";

interface SequenceItemOptions {
  fps: number;
}

type SequenceItemType = "text" | "image" | "video" | "audio";

export const SequenceItem: Record<SequenceItemType, (item: TrackElement, options: SequenceItemOptions) => JSX.Element> =
  {
    text: (item, options: SequenceItemOptions) => {
      const textElement = item as TextElement;
      const fromFrame = Math.floor(textElement.startTime * options.fps);
      const durationInFrames = Math.floor((textElement.endTime - textElement.startTime) * options.fps);

      return (
        <Sequence
          key={textElement.id}
          from={fromFrame}
          durationInFrames={durationInFrames}
          name={`Text: ${textElement.text.substring(0, 20)}...`}
          style={{ height: "100%", overflow: "hidden" }}
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
      const durationInFrames = Math.floor((imageElement.endTime - imageElement.startTime) * options.fps);

      return (
        <Sequence
          key={imageElement.id}
          from={fromFrame}
          durationInFrames={durationInFrames}
          name={`Image: ${imageElement.id}`}
          style={{
            height: "100%",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <ImageWithFade imageElement={imageElement} durationInFrames={durationInFrames} fps={options.fps} />
        </Sequence>
      );
    },

    video: (item, options: SequenceItemOptions) => {
      const videoElement = item as MediaElement;
      const fromFrame = Math.floor(videoElement.startTime * options.fps);
      const durationInFrames = Math.floor((videoElement.endTime - videoElement.startTime) * options.fps);

      return (
        <Sequence
          key={videoElement.id}
          from={fromFrame}
          durationInFrames={durationInFrames}
          name={`Video: ${videoElement.id}`}
          style={{
            height: "100%",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <OffthreadVideo
            src={videoElement.url || ""}
            volume={videoElement.volume || 100}
            style={{
              pointerEvents: "none",
              top: 0,
              left: 0,
              width: videoElement.width || "100%", // Default width
              height: videoElement.height || "auto", // Default height
              position: "absolute",
            }}
          />
        </Sequence>
      );
    },

    audio: (item, options: SequenceItemOptions) => {
      const audioElement = item as AudioElement;
      const fromFrame = Math.floor(audioElement.startTime * options.fps);
      const durationInFrames = Math.floor((audioElement.endTime - audioElement.startTime) * options.fps);

      const offsetSeconds = audioElement.sourceStart ?? 0;

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
              startFrom={Math.floor(offsetSeconds * options.fps)}
            />
          </AbsoluteFill>
        </Sequence>
      );
    },
  };
