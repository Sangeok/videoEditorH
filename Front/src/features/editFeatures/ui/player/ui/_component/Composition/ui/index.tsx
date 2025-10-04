import { TextElement } from "@/entities/media/types";
import { useRef } from "react";
import { SequenceItem } from "./_component/SequenceItem/ui/SequenceItem";
import { useMediaStore } from "@/entities/media/useMediaStore";
import SmartGuideOverlay from "../../SmartGuideOverlay/ui/SmartGuideOverlay";

export default function Composition() {
  const media = useMediaStore((state) => state.media);
  const fps = media.fps;
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {media.textElement.map((textElement) => {
        if (!textElement) return null;
        const trackItem = { ...textElement } as TextElement;
        return SequenceItem["text"](trackItem, { fps });
      })}
      {media.mediaElement.map((mediaElement) => {
        if (!mediaElement) return null;
        return SequenceItem[mediaElement.type](mediaElement, { fps });
      })}
      {media.audioElement.map((audioElement) => {
        if (!audioElement) return null;
        return SequenceItem["audio"](audioElement, { fps });
      })}
      <SmartGuideOverlay containerRef={containerRef} />
    </div>
  );
}
