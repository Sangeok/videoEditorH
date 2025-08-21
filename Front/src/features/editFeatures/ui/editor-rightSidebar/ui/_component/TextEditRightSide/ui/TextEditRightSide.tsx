"use client";

import Input from "@/shared/ui/atoms/Input/ui/Input";
import { useDebouncedTextEdit } from "../model/useDebouncedTextEdit";
import { TextEditRightSideProps } from "../model/types";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { useRef, useState } from "react";
import MatchWidthDropdown from "@/shared/ui/atoms/Dropdown/ui/MatchWidthDropdown";
import { TextBackgroundColorItems, BACKGROUND_COLOR_CONFIGS, BackgroundColorName } from "../constants";
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function TextEditRightSide({ selectedTrackId }: TextEditRightSideProps) {
  const { updateTextBackgroundColor } = useMediaStore();
  const { localText, localWidth, localFontSize, handleTextChange, handleWidthChange, handleFontSizeChange } =
    useDebouncedTextEdit(selectedTrackId);

  const [isBackgroundColorDropdownOpen, setIsBackgroundColorDropdownOpen] = useState<boolean>(false);
  const backgroundColorDropdownRef = useRef<HTMLButtonElement>(null);
  const [backgroundElement, setBackgroundElement] = useState<string | null>(null);

  const handleBackgroundColorChange = (name: string) => {
    const colorName = name as BackgroundColorName;
    const config = BACKGROUND_COLOR_CONFIGS[colorName];
    
    if (config === null) {
      setBackgroundElement(null);
      return;
    }
    
    if (config) {
      updateTextBackgroundColor(selectedTrackId!, config);
      setBackgroundElement(colorName);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 w-full">
          <h1>Text Content</h1>
          <Input placeholder="Text Content" value={localText} onChange={(e) => handleTextChange(e.target.value)} />

          <h1>Text width</h1>
          <Input placeholder="Text width" value={localWidth} onChange={(e) => handleWidthChange(e.target.value)} />

          <h1>Font Size</h1>
          <Input placeholder="Font Size" value={localFontSize} onChange={(e) => handleFontSizeChange(e.target.value)} />

          <h1>Text Background</h1>
          <Button
            className="w-full"
            variant="dark"
            onClick={() => setIsBackgroundColorDropdownOpen(true)}
            ref={backgroundColorDropdownRef}
          >
            {backgroundElement ? backgroundElement : "None"}
            <MatchWidthDropdown
              isOpen={isBackgroundColorDropdownOpen}
              setIsOpen={setIsBackgroundColorDropdownOpen}
              dropdownItems={TextBackgroundColorItems}
              handleSelectEvent={handleBackgroundColorChange}
              position="bottom"
              targetEl={backgroundColorDropdownRef.current}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
