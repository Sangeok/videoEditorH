import TimelineToolBar from "./_component/TimelineToolBar/TimelineToolBar";

export default function EditorFooter() {
  return (
    <footer className="bg-black border-t border-white/20 p-2 flex-1">
      <TimelineToolBar />

      {/* Timeline */}
      <div className="relative">
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <div className="w-1 h-4 bg-white absolute left-0 top-0"></div>
          <span className="ml-4">5s</span>
          <span className="ml-16">10s</span>
          <span className="ml-16">15s</span>
          <span className="ml-16">20s</span>
        </div>
        <div className="h-16 bg-gray-800 rounded border border-gray-700"></div>
      </div>
    </footer>
  );
}
