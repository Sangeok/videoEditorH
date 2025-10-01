import { TextElement } from "@/entities/media/types";
import { SequenceItem } from "./_component/SequenceItem/ui/SequenceItem";
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function Composition() {
  const { media } = useMediaStore();
  const fps = media.fps || 30;

  return (
    <>
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
    </>
  );
}
