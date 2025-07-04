import Timeline from "./_component/TImeline/Timeline";
import TimelineToolBar from "./_component/TimelineToolBar/TimelineToolBar";
import TrackPannel from "./_component/TrackPannel/TrackPannel";

export default function EditorFooter() {
  return (
    <footer className="bg-black border-t border-white/20 h-full">
      <TimelineToolBar />
      <div className="flex">
        <TrackPannel />
        <Timeline />
      </div>
    </footer>
  );
}
