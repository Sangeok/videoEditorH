import { useMediaStore } from "@/src/entities/media/useMediaStore";
import { EffectType, FadeEffectType, MediaElement } from "@/src/entities/media/types";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Input from "@/src/shared/ui/atoms/Input/ui/Input";
import MatchWidthDropdown from "@/src/shared/ui/atoms/Dropdown/ui/MatchWidthDropdown";
import { DEFAULT_EFFECT_DURATION, ImageEffectMenuItems } from "../constants";
import { useImageEffectsDetails } from "../model/hooks/useImageEffectsDetails";

interface ImageEditRightSideProps {
  selectedTrackId: string | null;
}

export default function ImageEditRightSide({ selectedTrackId }: ImageEditRightSideProps) {
  const [isInEffectDropdownOpen, setIsInEffectDropdownOpen] = useState<boolean>(false);
  const [isOutEffectDropdownOpen, setIsOutEffectDropdownOpen] = useState<boolean>(false);

  const inEffectDropdownRef = useRef<HTMLButtonElement>(null);
  const outEffectDropdownRef = useRef<HTMLButtonElement>(null);

  const { updateMediaElement } = useMediaStore();
  const imageElement = useMediaStore((state) =>
    state.media.mediaElement.find((element) => element.id === selectedTrackId)
  ) as MediaElement;

  const { handleFadeDurationChange } = useImageEffectsDetails(imageElement);

  const handleInEffectChange = (inEffect: EffectType) => {
    if (inEffect === "fadeIn") {
      updateMediaElement(imageElement.id, {
        fadeIn: true,
        fadeInDuration: DEFAULT_EFFECT_DURATION,
      });
    }
  };

  const handleOutEffectChange = (outEffect: EffectType) => {
    if (outEffect === "fadeOut") {
      updateMediaElement(imageElement.id, {
        fadeOut: true,
        fadeOutDuration: DEFAULT_EFFECT_DURATION,
      });
    }
  };

  if (!imageElement || imageElement.type !== "image") {
    return <div>No image selected</div>;
  }

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
            onChange={(e) => handleFadeDurationChange(Number(e.target.value), "fadeInDuration")}
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
            onChange={(e) => handleFadeDurationChange(Number(e.target.value), "fadeOutDuration")}
          />
        )}
      </div>
    </div>
  );
}
