import Button from "@/shared/ui/atoms/Button/ui/Button";
import TextArea from "@/shared/ui/atoms/TextArea/ui/TextArea";
import { useState } from "react";

export default function TextEditSubSide() {
  const [text, setText] = useState<string>("");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h1>Text</h1>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button>Add Text</Button>
    </div>
  );
}
