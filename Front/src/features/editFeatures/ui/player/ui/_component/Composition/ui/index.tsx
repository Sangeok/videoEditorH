"use client";

import { TextElement } from "@/entities/media/types";
import { SequenceItem } from "./_component/SequenceItem/ui/SequenceItem";
import { useMediaStore } from "@/entities/media/useMediaStore";
import HorizonSmartGuide from "./_component/HorizonSmartGuide/ui";
import { useSmartGuideStore } from "../../../../model/hooks/useSmartGuideStore";
import VerticalSmartGuide from "./_component/VerticalSmartGuide/ui";

export default function Composition() {
  const media = useMediaStore((state) => state.media);
  const fps = media.fps;

  const showVerticalSmartGuide = useSmartGuideStore((state) => state.showVerticalSmartGuide);
  const showHorizonSmartGuide = useSmartGuideStore((state) => state.showHorizonSmartGuide);

  return (
    <div className="relative w-full h-full">
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
      {showHorizonSmartGuide && <HorizonSmartGuide />}
      {showVerticalSmartGuide && <VerticalSmartGuide />}
    </div>
  );
}
