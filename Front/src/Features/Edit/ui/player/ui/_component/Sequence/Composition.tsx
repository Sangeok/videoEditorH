import { useVideoConfig, AbsoluteFill, Sequence } from "remotion";
import { TextElement } from "@/src/entities/media/types";

interface CompositionProps {
  textElements: TextElement[];
}

export default function Composition({ textElements }: CompositionProps) {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 각 textElement를 독립적인 Sequence로 렌더링 */}
      {textElements.map((textElement) => {
        const fromFrame = Math.floor(textElement.startTime * fps);
        const durationInFrames = Math.floor(
          (textElement.endTime - textElement.startTime) * fps
        );

        return (
          <Sequence
            key={textElement.id}
            from={fromFrame}
            durationInFrames={durationInFrames}
            name={`Text: ${textElement.text.substring(0, 20)}...`} // 타임라인에서 보이는 이름
          >
            <AbsoluteFill>
              <div
                style={{
                  position: "absolute",
                  left: `${textElement.positionX}px`,
                  top: `${textElement.positionY}px`,
                  width: `${textElement.width}px`,
                  height: `${textElement.height}px`,
                  fontSize: `${textElement.fontSize}px`,
                  fontFamily: textElement.font,
                  color: textElement.textColor,
                  backgroundColor: textElement.backgroundColor,
                  textAlign: textElement.textAlign as
                    | "left"
                    | "center"
                    | "right",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    textElement.textAlign === "center"
                      ? "center"
                      : textElement.textAlign === "right"
                      ? "flex-end"
                      : "flex-start",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  padding: "8px",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {textElement.text || "No Text"}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
