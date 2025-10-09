"use client";

import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { Copy, Image, Music, Plus, Split, Trash, Type, Video } from "lucide-react";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useMediaStore } from "@/entities/media/useMediaStore";
import Dropdown from "@/shared/ui/atoms/Dropdown/ui/Dropdown";
import { useState } from "react";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export default function ToolButton() {
  const { isDelete, isClone, setIsDelete, setIsClone } = useTimelineToolStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedAddTrackItem, setSelectedAddTrackItem] = useState<string>("");
  const addTextLane = useTrackLaneStore((s) => s.addTextLane);
  const addMediaLane = useTrackLaneStore((s) => s.addMediaLane);
  const addAudioLane = useTrackLaneStore((s) => s.addAudioLane);
  const setActiveLane = useTrackLaneStore((s) => s.setActiveLane);

  const selectedTrack = useSelectedTrackStore((s) => s.selectedTrack);
  const selectedTrackId = useSelectedTrackStore((s) => s.selectedTrackId);
  const currentTime = useTimelineStore((s) => s.currentTime);

  const splitTextElement = useMediaStore((s) => s.splitTextElement);
  const splitMediaElement = useMediaStore((s) => s.splitMediaElement);
  const splitAudioElement = useMediaStore((s) => s.splitAudioElement);

  const handleSplit = () => {
    if (!selectedTrackId || !selectedTrack) {
      alert("Please select an element to split in timeline");
      return;
    }

    switch (selectedTrack) {
      case "Text":
        splitTextElement(selectedTrackId, currentTime);
        break;
      case "Video":
      case "Image":
        splitMediaElement(selectedTrackId, currentTime);
        break;
      case "Audio":
        splitAudioElement(selectedTrackId, currentTime);
        break;
      default:
        break;
    }
  };

  const FooterItems = [
    {
      label: "Delete",
      icon: <Trash size={15} />,
      onClick: () => setIsDelete(!isDelete),
      isActive: isDelete,
      isDropdown: false,
    },
    {
      label: "Split",
      icon: <Split size={15} />,
      onClick: () => {
        handleSplit();
      },
      isActive: false,
      isDropdown: false,
    },
    {
      label: "Clone",
      icon: <Copy size={15} />,
      onClick: () => setIsClone(!isClone),
      isActive: isClone,
      isDropdown: false,
    },
    {
      label: "Add",
      icon: <Plus size={15} />,
      onClick: () => {
        setIsDropdownOpen(!isDropdownOpen);
      },
      isActive: false,
      isDropdown: true,
      dropdownItems: [
        { label: "Add Text Track", icon: <Type size={15} /> },
        { label: "Add Media Track", icon: <Video size={15} /> },
        { label: "Add Audio Track", icon: <Music size={15} /> },
      ],
    },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      {FooterItems.map((item) => (
        <IconButton key={item.label} onClick={item.onClick} isActive={item.isActive}>
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-xs text-gray-400 pt-1">{item.label}</span>
            {item.isDropdown && (
              <Dropdown
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                dropdownItems={item.dropdownItems || []}
                handleSelectEvent={(label) => {
                  setSelectedAddTrackItem(label);
                  if (label === "Add Text Track") {
                    const id = addTextLane();
                    setActiveLane("Text", id);
                  } else if (label === "Add Media Track") {
                    const id = addMediaLane();
                    setActiveLane("Media", id);
                  } else if (label === "Add Audio Track") {
                    const id = addAudioLane();
                    setActiveLane("Audio", id);
                  }
                }}
              />
            )}
          </div>
        </IconButton>
      ))}
    </div>
  );
}
