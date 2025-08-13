import Input from "@/shared/ui/atoms/Input/ui/Input";
import { useDebouncedTextEdit } from "../model/useDebouncedTextEdit";
import { TextEditRightSideProps } from "../model/types";

export default function TextEditRightSide({
  selectedTrackId,
}: TextEditRightSideProps) {
  const {
    localText,
    localWidth,
    localFontSize,
    handleTextChange,
    handleWidthChange,
    handleFontSizeChange,
  } = useDebouncedTextEdit(selectedTrackId);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 w-full">
          <h1>Text Content</h1>
          <Input
            placeholder="Text Content"
            value={localText}
            onChange={(e) => handleTextChange(e.target.value)}
          />

          <h1>Text width</h1>
          <Input
            placeholder="Text width"
            value={localWidth}
            onChange={(e) => handleWidthChange(e.target.value)}
          />

          <h1>Font Size</h1>
          <Input
            placeholder="Font Size"
            value={localFontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
