import IconButton from "@/src/shared/ui/atoms/Button/ui/IconButton";
import { ImageIcon, Music, Text, Video } from "lucide-react";

const TrackPannelItems = [
  {
    icon: <Music size={15} />,
    label: "Music",
  },
  {
    icon: <Video size={15} />,
    label: "Video",
  },
  {
    icon: <ImageIcon size={15} />,
    label: "Image",
  },
  {
    icon: <Text size={15} />,
    label: "Text",
  },
] as const;

export default function TrackPannel() {
  return (
    <div className="w-12 border-r border-white/20 bg-black mt-5">
      <div className="flex flex-col h-full items-center justify-around">
        {TrackPannelItems.map((item, index) => (
          <IconButton key={item.label + index}>{item.icon}</IconButton>
        ))}
      </div>
    </div>
  );
}
