import { useProjectStore } from "@/src/entities/Project/useProjectStore";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import TextArea from "@/src/shared/ui/atoms/TextArea/ui/TextArea";
import { useState } from "react";

export default function TextEditSubSide() {
  const [text, setText] = useState<string>("");
  const { project, addTextElement } = useProjectStore();

  const handleAddText = () => {
    const newText = {
      id: crypto.randomUUID(),
      text: text,
      type: "text",
      positionX: 600,
      positionY: 500,
      from_time: 0,
      to_time: 10,
      font_size: 120,
      textAlign: "center",
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
