import { useMediaStore } from "@/src/entities/media/useMediaStore";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import TextArea from "@/src/shared/ui/atoms/TextArea/ui/TextArea";
import { useState } from "react";

export default function TextEditSubSide() {
  const [text, setText] = useState<string>("");
  const { addTextElement } = useMediaStore();

  const handleAddText = () => {
    const newText = {
      id: crypto.randomUUID(),
      type: "text",
      startTime: 0,
      endTime: 10,
      duration: 10,
      textAlign: "center",

      text: text,
      positionX: 600,
      positionY: 500,
      fontSize: 120,
      textColor: "#000000",
      backgroundColor: "#ffffff",
      font: "Arial",
      width: 100,
      height: 100,
      animation: "none",
    };
    addTextElement(newText);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h1>Text</h1>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={handleAddText}>Add Text</Button>
    </div>
  );
}
