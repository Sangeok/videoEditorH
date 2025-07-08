import TimelineRuler from "./_component/TimelineRuler";
import TextTimeline from "./TextTimeline/TextTimeline";

export default function Timeline() {
  return (
    <div className="relative flex-1 flex flex-col">
      {/* 동적 Ruler */}
      <TimelineRuler />

      {/* 타임라인 메인 영역 */}
      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-b overflow-hidden">
        {/* 타임라인 트랙들이 들어갈 영역 */}
        <div className="h-full min-h-[100px] relative">
          <TextTimeline />
          {/* 향후 타임라인 트랙 컴포넌트들이 여기에 렌더링됩니다 */}
        </div>
      </div>
    </div>
  );
}
