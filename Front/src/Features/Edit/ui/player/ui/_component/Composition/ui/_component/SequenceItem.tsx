import { JSX } from "react";
import { AbsoluteFill, Sequence } from "remotion";

interface SequenceItemOptions {
  handleTextChange?: (id: string, text: string) => void;
  fps: number;
  editableTextId?: string | null;
  currentTime?: number;
}

const fps = 30;

export const SequenceItem: Record<
  string,
  (item: any, options: SequenceItemOptions) => JSX.Element
> = {
  text: (item, options: SequenceItemOptions) => {
    const fromFrame = Math.floor(item.startTime * fps);
    const durationInFrames = Math.floor((item.endTime - item.startTime) * fps);

    return (
      <Sequence
        key={item.id}
        from={fromFrame}
        durationInFrames={durationInFrames}
        style={{ pointerEvents: "none", zIndex: 1000 }}
      >
        {/* positioning layer */}
        <AbsoluteFill
          style={{
            position: "absolute",
            left: `${item.positionX}px`,
            top: `${item.positionY}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
            fontSize: `${item.fontSize}px`,
            fontFamily: item.font,
            color: item.textColor,
            backgroundColor: item.backgroundColor,
          }}
        >
          {/* animation layer */}
          {/* <Animated
            style={calculateContainerStyles(details)}
            animationIn={editableTextId === id ? null : animationIn}
            animationOut={editableTextId === id ? null : animationOut}
            durationInFrames={durationInFrames}
          > */}
          {/* text layer */}
          {/* <TextLayer
              key={id}
              id={id}
              content={details.text}
              editable={editableTextId === id}
              onChange={handleTextChange}
              onBlur={onTextBlur}
              style={calculateTextStyles(details)}
            />
          </Animated> */}
        </AbsoluteFill>
      </Sequence>
    );
  },
};
