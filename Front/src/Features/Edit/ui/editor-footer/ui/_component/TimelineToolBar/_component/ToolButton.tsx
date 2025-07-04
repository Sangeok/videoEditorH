import IconButton from "@/src/shared/ui/atoms/Button/ui/IconButton";
import { Copy, Split, Trash } from "lucide-react";

export default function ToolButton() {
  const FooterItems = [
    {
      label: "Delete",
      icon: <Trash size={15} />,
    },
    {
      label: "Split",
      icon: <Split size={15} />,
    },
    {
      label: "Clone",
      icon: <Copy size={15} />,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {FooterItems.map((item) => (
        <IconButton key={item.label}>
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        </IconButton>
      ))}
    </div>
  );
}
