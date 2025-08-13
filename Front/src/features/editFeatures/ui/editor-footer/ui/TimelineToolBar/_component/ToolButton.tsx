"use client";

import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { Copy, Split, Trash } from "lucide-react";

export default function ToolButton() {
  const { isDelete, isClone, isSplit, setIsDelete, setIsClone, setIsSplit } =
    useTimelineToolStore();

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
      onClick: () => setIsSplit(!isSplit),
      isActive: isSplit,
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
        <IconButton
          key={item.label}
          onClick={item.onClick}
          isActive={item.isActive}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        </IconButton>
      ))}
    </div>
  );
}
