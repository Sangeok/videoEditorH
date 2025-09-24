import TimelineRuler from "./_component/TimelineRuler/TimelineRuler";
import CurrentTimeIndicator from "./_component/CurrentTimeIndicator/ui/CurrentTimeIndicator";

import SnapGuideIndicator from "./_component/SnapGuide/SnapGuideIndicator";
import TextTrack from "./_component/Track/ui/TextTrack/ui/TextTrack";
import MediaTrack from "./_component/Track/ui/MediaTrack/ui";
import AudioTrack from "./_component/Track/ui/AudioTrack/ui/AudioTrack";

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
            <TextTrack />
          </div>
          <div className="flex-1">
            <MediaTrack />
          </div>
          <div className="flex-1">
            <AudioTrack />
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
