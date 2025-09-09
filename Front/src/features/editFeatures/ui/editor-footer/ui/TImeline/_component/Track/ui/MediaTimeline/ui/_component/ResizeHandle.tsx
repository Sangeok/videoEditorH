// "use client";

// import React from "react";

// interface ResizeHandleProps {
//   position: "left" | "right";
//   isVisible: boolean;
//   onMouseDown: (e: React.MouseEvent) => void;
// }

// export function ResizeHandle({ position, isVisible, onMouseDown }: ResizeHandleProps) {
//   const positionClasses = getPositionClasses(position);
//   const visibilityClass = isVisible ? "opacity-100" : "opacity-0";
//   const cursorClass = position === "left" ? "cursor-w-resize" : "cursor-e-resize";

//   const handleClasses = [
//     "absolute",
//     "top-0",
//     "w-1",
//     "h-full",
//     "bg-indigo-500",
//     "transition-opacity",
//     positionClasses,
//     cursorClass,
//     visibilityClass,
//   ].join(" ");

//   const title = position === "left" ? "Resize start time" : "Resize end time";

//   return <div className={handleClasses} onMouseDown={onMouseDown} title={title} />;
// }

// function getPositionClasses(position: "left" | "right"): string {
//   return position === "left" ? "left-0" : "right-0";
// }
