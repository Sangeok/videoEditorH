import Timeline from "../../../../features/Edit/ui/editor-footer/ui/TImeline/Timeline";
import TimelineToolBar from "../../../../features/Edit/ui/editor-footer/ui/TimelineToolBar/TimelineToolBar";
import TrackPannel from "../../../../features/Edit/ui/editor-footer/ui/TrackPannel/TrackPannel";

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
