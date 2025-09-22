import { TextElement as TextElementType } from "@/entities/media/types";
import { MoveDragState, ResizeDragType } from "../../../../model/types";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import {
  calculateElementWidth,
  calculateTimelinePosition,
  isElementDragging,
} from "../../../../lib/timelineLib";
import { ResizeHandle } from "../../../_component/ResizeHandle";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { generateElementTitle } from "../../../../lib/generateElementTitle";

interface TextElementProps {
  textElement: TextElementType;
  dragState: MoveDragState;
  moveDragState?: MoveDragState;
  onResizeStart: (
    e: React.MouseEvent,
    elementId: string,
    dragType: ResizeDragType
  ) => void;
  onMoveStart?: (e: React.MouseEvent, elementId: string) => void;
  onClick: (selectedElements: string) => void;
}

export default function TextElement({
  textElement,
  dragState,
  moveDragState,
  onResizeStart,
  onMoveStart,
  onClick,
}: TextElementProps) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );
  const isDelete = useTimelineToolStore((state) => state.isDelete);
  const selectedTrackId = useSelectedTrackStore(
    (state) => state.selectedTrackId
  );

  // Calculate position and dimensions
  const leftPosition = calculateTimelinePosition(
    textElement.startTime,
    pixelsPerSecond
  );
  const width = calculateElementWidth(
    textElement.startTime,
    textElement.endTime,
    pixelsPerSecond
  );

  // Check drag states
  const isResizeDragging = isElementDragging(textElement.id, dragState);
  const isMoveDragging = Boolean(
    moveDragState?.isDragging && moveDragState.elementId === textElement.id
  );
  const isDragging = isResizeDragging || isMoveDragging;
  const isSelected = selectedTrackId === textElement.id;

  // Generate styles with visibility for move dragging
  const elementStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
    opacity: isMoveDragging ? 0.3 : 1, // Make original element semi-transparent during move
  };

  const elementClasses = getElementClasses(isDragging, isMoveDragging);
  const title = generateElementTitle(textElement);

  // Handle move drag start on element body
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if this is a move drag (not clicking on resize handles)
    if (!isDelete && onMoveStart && !e.defaultPrevented) {
      // Prevent text selection during move drag
      e.preventDefault();
      onMoveStart(e, textElement.id);

      setSelectedTrackAndId("Text", textElement.id);
    } else if (!e.defaultPrevented) {
      // Regular click - don't prevent default to allow normal interactions
      onClick(textElement.id);
    }
  };

  return (
    <div
      className={elementClasses}
      onMouseDown={handleMouseDown}
      style={elementStyles}
      title={title}
    >
      {/* Left resize handle */}
      <ResizeHandle
        position="left"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, textElement.id, "left");
        }}
      />

      <span className="w-full min-w-0 truncate px-3 pointer-events-none select-none">
        {textElement.text || "Text"}
      </span>

      {/* Right resize handle */}
      <ResizeHandle
        position="right"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, textElement.id, "right");
        }}
      />
    </div>
  );
}

function getElementClasses(
  isDragging: boolean,
  isMoveDragging?: boolean
): string {
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
  } else if (isDragging) {
    cursorClass = "cursor-grabbing"; // resize dragging
  } else {
    cursorClass = "cursor-grab hover:cursor-grab"; // ready to be dragged
  }

  return [...baseClasses, cursorClass].join(" ");
}
