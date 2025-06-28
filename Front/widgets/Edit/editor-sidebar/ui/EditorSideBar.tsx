import { Captions, Image, Music, Type, Video } from "lucide-react";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import Tooltip from "@/shared/ui/atoms/Tooltip/ui/Tooltip";

export default function EditorSideBar() {
  const SideBarItems = [
    {
      icon: <Type size={18} />,
      label: "Text",
    },
    {
      icon: <Video size={18} />,
      label: "Video",
    },
    {
      icon: <Captions size={18} />,
      label: "Captions",
    },
    {
      icon: <Image size={18} />,
      label: "Image",
    },
    {
      icon: <Music size={18} />,
      label: "Music",
    },
  ];

  return (
    <aside className="w-15 h-full bg-black border-r border-white/20 overflow-y-auto">
      <div className="p-4">
        <div className="flex flex-col h-full w-full items-center justify-center gap-8">
          {SideBarItems.map((item) => (
            <Tooltip key={item.label} content={item.label} position="right" size="sm" theme="dark">
              <IconButton>{item.icon}</IconButton>
            </Tooltip>
          ))}
        </div>
      </div>
    </aside>
  );
}
