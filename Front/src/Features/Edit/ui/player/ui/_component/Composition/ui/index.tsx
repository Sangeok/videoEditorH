import { useVideoConfig, AbsoluteFill, Sequence } from "remotion";
import { TextElement } from "@/src/entities/media/types";
import DraggableText from "../../DraggableText";

interface CompositionProps {
  textElements: TextElement[];
}

export default function Composition({ textElements }: CompositionProps) {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", height: "100%" }}>
      {/* 각 textElement를 독립적인 Sequence로 렌더링 */}
      {textElements.map((textElement) => {
        const fromFrame = Math.floor(textElement.startTime * fps);
        const durationInFrames = Math.floor((textElement.endTime - textElement.startTime) * fps);

        return (
          <Sequence
            key={textElement.id}
            from={fromFrame}
            durationInFrames={durationInFrames}
            name={`Text: ${textElement.text.substring(0, 20)}...`}
            style={{ height: "100%", border: "5px solid red" }}
          >
            {/* <div className="absolute right-0 bottom-0 text-9xl">hihi</div> */}
            <AbsoluteFill className="h-full">
              <DraggableText element={textElement}>{textElement.text || "No Text"}</DraggableText>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
