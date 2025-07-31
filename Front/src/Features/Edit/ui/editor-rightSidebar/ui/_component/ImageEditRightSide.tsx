import { useMediaStore } from "@/src/entities/media/useMediaStore";

interface ImageEditRightSideProps {
  selectedTrackId: string | null;
}

export default function ImageEditRightSide({
  selectedTrackId,
}: ImageEditRightSideProps) {
  const imageElement = useMediaStore((state) =>
    state.media.mediaElement.find((element) => element.id === selectedTrackId)
  );

  console.log("imageElement", imageElement);

  return <div>ImageEditRightSide</div>;
}
