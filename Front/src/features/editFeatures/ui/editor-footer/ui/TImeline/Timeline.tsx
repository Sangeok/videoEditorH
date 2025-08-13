import TimelineRuler from "./TimelineRuler/TimelineRuler";
import TextTimeline from "./TextTimeline/TextTimeline";
import CurrentTimeIndicator from "./_component/CurrentTimeIndicator/ui/CurrentTimeIndicator";
import MediaTimeline from "./MediaTimeline/ui";
import AudioTimeline from "./AudioTimeline/ui/AudioTimeline";

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
            {/* <MediaTimeline /> */}
            {/* <AudioTimeline /> */}
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

      <CurrentTimeIndicator />
    </div>
  );
}
