import TimelineRuler from "./TimelineRuler/TimelineRuler";
import TextTimeline from "./TextTimeline/TextTimeline";
import CurrentTimeIndicator from "./_component/CurrentTimeIndicator/ui/CurrentTimeIndicator";
import MediaTimeline from "./MediaTimeline/ui";
import AudioTimeline from "./AudioTimeline";

export default function Timeline() {
  return (
    <div className="relative flex-1 flex flex-col border border-gray-700 overflow-x-auto">
      {/* 동적 Ruler */}
      <TimelineRuler />

      {/* 타임라인 메인 영역 */}
      <div className="flex-1 bg-black rounded-b">
        {/* 타임라인 트랙들이 들어갈 영역 */}
        <div className="h-full min-h-[100px] relative">
          <TextTimeline />
          <MediaTimeline />
          <AudioTimeline />
          {/* 향후 타임라인 트랙 컴포넌트들이 여기에 렌더링됩니다 */}
        </div>
      </div>

      <CurrentTimeIndicator />
    </div>
  );
}
