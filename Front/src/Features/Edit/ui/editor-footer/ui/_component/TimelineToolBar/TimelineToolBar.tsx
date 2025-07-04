import PlaybackDisplay from "./_component/PlaybackDisplay";
import ToolButton from "./_component/ToolButton";
import ZoomControl from "./_component/ZoomControl";

export default function TimelineToolBar() {
  return (
    <div className="flex items-center justify-between border-b border-white/20 pb-2">
      <ToolButton />
      <PlaybackDisplay />
      <ZoomControl />
    </div>
  );
}
