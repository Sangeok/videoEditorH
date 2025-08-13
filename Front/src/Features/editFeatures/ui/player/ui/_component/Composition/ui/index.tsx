import { TextElement } from "@/src/entities/media/types";
import { SequenceItem } from "./_component/SequenceItem";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

interface CompositionProps {
  textElements: TextElement[];
}

export default function Composition({ textElements }: CompositionProps) {
  const { media } = useMediaStore();
  const fps = media.fps || 30;

  console.log("textElements");
  console.log(textElements);

  return (
    <>
      {textElements.map((textElement) => {
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
