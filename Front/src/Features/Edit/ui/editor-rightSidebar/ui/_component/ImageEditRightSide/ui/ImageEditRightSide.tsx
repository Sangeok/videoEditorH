import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { MediaElement } from "@/src/entities/media/types";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Input from "@/src/shared/ui/atoms/Input/ui/Input";
import MatchWidthDropdown from "@/src/shared/ui/atoms/Dropdown/ui/MatchWidthDropdown";
import { DEFAULT_EFFECT_DURATION, ImageEffectMenuItems } from "../constants";

interface ImageEditRightSideProps {
  selectedTrackId: string | null;
}

export default function ImageEditRightSide({
  selectedTrackId,
}: ImageEditRightSideProps) {
  const [isInEffectDropdownOpen, setIsInEffectDropdownOpen] =
    useState<boolean>(false);
  const [isOutEffectDropdownOpen, setIsOutEffectDropdownOpen] =
    useState<boolean>(false);

  const inEffectDropdownRef = useRef<HTMLButtonElement>(null);
  const outEffectDropdownRef = useRef<HTMLButtonElement>(null);

  const { updateMediaElement } = useMediaStore();
  const imageElement = useMediaStore((state) =>
    state.media.mediaElement.find((element) => element.id === selectedTrackId)
  ) as MediaElement;

  if (!imageElement || imageElement.type !== "image") {
    return <div>No image selected</div>;
  }

  const handleInEffectChange = (inEffect: string) => {
    if (inEffect === "Fade In") {
      updateMediaElement(imageElement.id, {
        fadeIn: true,
        fadeInDuration: DEFAULT_EFFECT_DURATION,
      });
    }
  };

  const handleOutEffectChange = (outEffect: string) => {
    if (outEffect === "Fade Out") {
      updateMediaElement(imageElement.id, {
        fadeOut: true,
        fadeOutDuration: DEFAULT_EFFECT_DURATION,
      });
    }
  };

  const handleFadeInDurationChange = (value: number) => {
    updateMediaElement(imageElement.id, { fadeInDuration: value });
  };

  const handleFadeOutDurationChange = (value: number) => {
    updateMediaElement(imageElement.id, { fadeOutDuration: value });
  };

  return (
    <div className="p-4 w-full space-y-4">
      <h3 className="text-lg font-semibold text-white">Image Effects</h3>

      <div className="flex flex-col gap-2">
        <h4>In</h4>
        <Button
          className="w-full"
          variant="dark"
          onClick={() => setIsInEffectDropdownOpen(true)}
          ref={inEffectDropdownRef}
        >
          <div className="flex items-center gap-2">
            <div className="flex w-full justify-between items-center">
              <span>{imageElement.fadeIn ? "Fade In" : "None"}</span>
              {!isInEffectDropdownOpen && <ChevronDown size={16} />}
              {isInEffectDropdownOpen && <ChevronUp size={16} />}
            </div>
            <MatchWidthDropdown
              isOpen={isInEffectDropdownOpen}
              setIsOpen={setIsInEffectDropdownOpen}
              dropdownItems={ImageEffectMenuItems.ImageIn}
              handleSelectEvent={handleInEffectChange}
              position="bottom"
              targetEl={inEffectDropdownRef.current}
            />
          </div>
        </Button>
        {imageElement.fadeIn && (
          <Input
            type="number"
            value={imageElement.fadeInDuration}
            onChange={(e) => handleFadeInDurationChange(Number(e.target.value))}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h4>Out</h4>
        <Button
          className="w-full"
          variant="dark"
          onClick={() => setIsOutEffectDropdownOpen(true)}
          ref={outEffectDropdownRef}
        >
          <div className="flex items-center gap-2">
            <div className="flex w-full justify-between items-center">
              <span>{imageElement.fadeOut ? "Fade Out" : "None"}</span>
              {!isOutEffectDropdownOpen && <ChevronDown size={16} />}
              {isOutEffectDropdownOpen && <ChevronUp size={16} />}
            </div>
            <MatchWidthDropdown
              isOpen={isOutEffectDropdownOpen}
              setIsOpen={setIsOutEffectDropdownOpen}
              dropdownItems={ImageEffectMenuItems.ImageOut}
              handleSelectEvent={handleOutEffectChange}
              position="bottom"
              targetEl={outEffectDropdownRef.current}
            />
          </div>
        </Button>
        {imageElement.fadeOut && (
          <Input
            type="number"
            value={imageElement.fadeOutDuration}
            onChange={(e) =>
              handleFadeOutDurationChange(Number(e.target.value))
            }
          />
        )}
      </div>
    </div>
  );
}
