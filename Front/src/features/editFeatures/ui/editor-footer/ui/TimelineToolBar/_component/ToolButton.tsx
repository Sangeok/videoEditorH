"use client";

import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { Copy, Split, Trash } from "lucide-react";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function ToolButton() {
  const { isDelete, isClone, setIsDelete, setIsClone } = useTimelineToolStore();

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
    },
    {
      label: "Split",
      icon: <Split size={15} />,
      onClick: () => {
        handleSplit();
      },
      isActive: false,
    },
    {
      label: "Clone",
      icon: <Copy size={15} />,
      onClick: () => setIsClone(!isClone),
      isActive: isClone,
    },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      {FooterItems.map((item) => (
        <IconButton key={item.label} onClick={item.onClick} isActive={item.isActive}>
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        </IconButton>
      ))}
    </div>
  );
}
