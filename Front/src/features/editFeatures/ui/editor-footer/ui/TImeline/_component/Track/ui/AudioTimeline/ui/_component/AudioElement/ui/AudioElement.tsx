import { AudioElement as AudioElementType } from "@/entities/media/types";
import { MoveDragState } from "../../../../../../model/types";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import {
  calculateElementWidth,
  calculateTimelinePosition,
  formatTimeDisplay,
} from "../../../../../../lib/timelineLib";
import Waveform from "@/features/editFeatures/ui/editor-footer/ui/TImeline/_component/Track/ui/AudioTimeline/ui/_component/AudioElement/ui/_component/Waveform";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";

interface TextElementProps {
  audioElement: AudioElementType;
  moveDragState?: MoveDragState;
  onMoveStart?: (e: React.MouseEvent, elementId: string) => void;
  onClick: (selectedElements: string) => void;
}

export default function AudioElement({
  audioElement,
  moveDragState,
  onMoveStart,
  onClick,
}: TextElementProps) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );
  const isDelete = useTimelineToolStore((state) => state.isDelete);

  // Calculate position and dimensions
  const leftPosition = calculateTimelinePosition(
    audioElement.startTime,
    pixelsPerSecond
  );
  const width = calculateElementWidth(
    audioElement.startTime,
    audioElement.endTime,
    pixelsPerSecond
  );

  // Check drag states
  const isMoveDragging = Boolean(
    moveDragState?.isDragging && moveDragState.elementId === audioElement.id
  );

  // Generate styles with visibility for move dragging
  const elementStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
    opacity: isMoveDragging ? 0.3 : 1, // Make original element semi-transparent during move
  };

  const elementClasses = getElementClasses(isMoveDragging);
  const title = generateElementTitle(audioElement);

  // Handle move drag start on element body
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if this is a move drag (not clicking on resize handles)
    if (!isDelete && onMoveStart && !e.defaultPrevented) {
      // Prevent text selection during move drag
      e.preventDefault();
      onMoveStart(e, audioElement.id);

      setSelectedTrackAndId("Text", audioElement.id);
    } else if (!e.defaultPrevented) {
      // Regular click - don't prevent default to allow normal interactions
      onClick(audioElement.id);
    }
  };

  return (
    <div
      className={elementClasses}
      onMouseDown={handleMouseDown}
      style={elementStyles}
      title={title}
    >
      <Waveform
        url={audioElement.url}
        segmentStartSec={audioElement.sourceStart ?? 0}
        segmentEndSec={
          (audioElement.sourceStart ?? 0) +
          (audioElement.endTime - audioElement.startTime)
        }
        className="flex-1 h-full"
        color="#86efac" // tailwind lime-300
        backgroundColor="transparent"
      />
    </div>
  );
}

function getElementClasses(isMoveDragging?: boolean): string {
  const baseClasses = [
    "absolute",
    "top-2",
    "h-12",
    "bg-gray-700",
    "border-b-4",
    "hover:bg-gray-800",
    "border-1",
    "border-gray-500",
    "rounded",
    "transition-colors",
    "duration-200",
    "flex",
    "items-center",
    "justify-center",
    "text-white",
    "text-xs",
    "font-medium",
    "overflow-hidden",
    "select-none", // Prevent text selection
    "user-select-none", // Additional browser compatibility
  ];

  // Different cursor styles for different drag states
  let cursorClass: string;
  if (isMoveDragging) {
    cursorClass = "cursor-grabbing";
  } else {
    cursorClass = "cursor-grab hover:cursor-grab"; // ready to be dragged
  }

  return [...baseClasses, cursorClass].join(" ");
}

function generateElementTitle(audioElement: AudioElementType): string {
  const timeDisplay = formatTimeDisplay(
    audioElement.startTime,
    audioElement.endTime
  );
  return `${audioElement.type} (${timeDisplay})`;
}
