import TimelineRuler from "./_component/TimelineRuler/TimelineRuler";
import CurrentTimeIndicator from "./_component/CurrentTimeIndicator/ui/CurrentTimeIndicator";
import TextTimeline from "./_component/Track/ui/TextTimeline/ui/TextTimeline";
import AudioTimeline from "./_component/Track/ui/AudioTimeline/ui/AudioTimeline";
import MediaTimeline from "./_component/Track/ui/MediaTimeline/ui";
import SnapGuideIndicator from "./_component/SnapGuide/SnapGuideIndicator";

export default function Timeline() {
  return (
    <div className="relative flex-1 flex flex-col border border-gray-700 overflow-x-auto">
      {/* dynamic ruler */}
      <TimelineRuler />

      {/* main timeline area */}
      <div className="flex-1 bg-black rounded-b">
        {/* area for timeline tracks */}
        <div className="h-full min-h-[100px] relative flex flex-col overflow-y-auto">
          <div className="flex-1">
            <TextTimeline />
          </div>
          <div className="flex-1">
            <MediaTimeline />
          </div>
          <div className="flex-1">
            <AudioTimeline />
          </div>
          {/* future timeline track components will be rendered here */}
        </div>
      </div>

      {/* Snap vertical guide overlay (beneath current time indicator) */}
      <SnapGuideIndicator />
      <CurrentTimeIndicator />
    </div>
  );
}
