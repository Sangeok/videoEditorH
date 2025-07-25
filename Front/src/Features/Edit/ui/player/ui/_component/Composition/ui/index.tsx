import { TextElement } from "@/src/entities/media/types";
import { SequenceItem } from "./_component/SequenceItem";
import { useMediaStore } from "@/src/entities/media/useMediaStore";

interface CompositionProps {
  textElements: TextElement[];
}

export default function Composition({ textElements }: CompositionProps) {
  const { media } = useMediaStore();
  const fps = media.fps || 30;

  return (
    <>
      {textElements.map((textElement) => {
        if (!textElement) return null;
        const trackItem = { ...textElement } as TextElement;
        return SequenceItem["Text"](trackItem, { fps });
      })}
    </>
  );
}
