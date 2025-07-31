import { JSX } from "react";
import { AbsoluteFill, Img, Sequence } from "remotion";
import DraggableText from "./DraggableText/ui/DraggableText";
import { MediaElement, TextElement } from "@/src/entities/media/types";

interface SequenceItemOptions {
  fps: number;
}

export const SequenceItem: Record<
  string,
  (item: TextElement | MediaElement, options: SequenceItemOptions) => JSX.Element
> = {
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
    const durationInFrames = Math.floor((imageElement.endTime - imageElement.startTime) * options.fps);

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
        <AbsoluteFill className="h-full" style={{ zIndex: 100, overflow: "hidden" }}>
          <Img
            style={{
              pointerEvents: "none",
              zIndex: 100,
              width: "100%",
              height: "auto",
            }}
            src={imageElement.url}
            alt={"image"}
            className="object-cover w-full h-full"
          />
        </AbsoluteFill>
      </Sequence>
    );
  },
};
