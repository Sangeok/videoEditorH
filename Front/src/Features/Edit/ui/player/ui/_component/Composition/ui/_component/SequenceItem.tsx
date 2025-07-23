import { JSX } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import DraggableText from "./DraggableText/ui/DraggableText";
import { TextElement } from "@/src/entities/media/types";

interface SequenceItemOptions {
  fps: number;
}

export const SequenceItem: Record<
  string,
  (item: TextElement, options: SequenceItemOptions) => JSX.Element
> = {
  Text: (item: TextElement, options: SequenceItemOptions) => {
    const textElement = item;
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
        style={{ height: "100%", border: "5px solid red" }}
      >
        <AbsoluteFill className="h-full">
          <DraggableText element={textElement} />
        </AbsoluteFill>
      </Sequence>
    );
  },
};
