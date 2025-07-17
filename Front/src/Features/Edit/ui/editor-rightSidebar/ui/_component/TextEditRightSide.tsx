import { TextElement } from "@/src/entities/media/types";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import Input from "@/src/shared/ui/atoms/Input/ui/Input";

interface TextEditRightSideProps {
  selectedTrackId: string | null;
}

export default function TextEditRightSide({
  selectedTrackId,
}: TextEditRightSideProps) {
  const { updateTextElement } = useMediaStore(); // updateTextElement 함수 가져오기
  const textElement = useMediaStore((state) =>
    state.media.textElement.find((element) => element.id === selectedTrackId)
  );

  const handleChangeTextElement = (field: keyof TextElement, value: number) => {
    if (!selectedTrackId) return;
    updateTextElement(selectedTrackId, { [field]: value }); // 스토어 직접 업데이트
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 w-full">
          <h1>Text width</h1>
          <Input
            placeholder="Text width"
            defaultValue={textElement?.width}
            onBlur={(e) =>
              handleChangeTextElement("width", Number(e.target.value))
            }
          />

          <h1>Font Size</h1>
          <Input
            placeholder="Font Size"
            defaultValue={textElement?.fontSize}
            onBlur={(e) =>
              handleChangeTextElement("fontSize", Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
}
