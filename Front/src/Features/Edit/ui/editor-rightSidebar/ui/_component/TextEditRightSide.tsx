import { TextElement } from "@/src/entities/media/types";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import Input from "@/src/shared/ui/atoms/Input/ui/Input";
import { useState } from "react";

interface TextEditRightSideProps {
  selectedTrackId: string | null;
}

export default function TextEditRightSide({
  selectedTrackId,
}: TextEditRightSideProps) {
  const findTextElement = useMediaStore((state) =>
    state.media.textElement.find((element) => element.id === selectedTrackId)
  );

  const [textElement, setTextElement] = useState(findTextElement);

  const handleChangeTextElement = (field: keyof TextElement, value: number) => {
    if (!textElement) return;
    setTextElement({ ...textElement, [field]: value });
  };

  console.log(textElement);

  return (
    <div className="w-full h-full flex flex-col  gap-2">
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
        </div>
      </div>
    </div>
  );
}
