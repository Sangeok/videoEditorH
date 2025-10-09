import { useMediaStore } from "@/entities/media/useMediaStore";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import TextArea from "@/shared/ui/atoms/TextArea/ui/TextArea";
import { useState } from "react";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export default function TextEditSubSide() {
  const [text, setText] = useState<string>("");
  const { addTextElement } = useMediaStore();
  const { textLanes, activeLaneByType, setActiveLane, addTextLane } = useTrackLaneStore();

  const handleAddText = () => {
    const laneId = activeLaneByType.text ?? textLanes[0] ?? "text-0";
    const newText = {
      id: crypto.randomUUID(),
      type: "text",
      startTime: 0,
      endTime: 5,
      duration: 5,
      laneId,

      text: text || "No Text",
      positionX: 425,
      positionY: 500,
      fontSize: 120,
      textColor: "#ffffff",
      backgroundColor: "bg-transparent",
      font: "Arial",
      width: 300,
      height: 300,
      animation: "none",
    };
    addTextElement(newText);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h1>Text</h1>
      {/* Lane selector */}
      <div className="flex items-center gap-2 w-full">
        <label className="text-xs text-gray-400">Text Track:</label>
        <select
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white"
          value={activeLaneByType.text}
          onChange={(e) => setActiveLane("text", e.target.value)}
        >
          {textLanes.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button
          className="px-2 py-1 text-xs border border-zinc-700 rounded text-white hover:bg-zinc-800"
          onClick={() => {
            const id = addTextLane();
            setActiveLane("text", id);
          }}
        >
          + New Lane
        </button>
      </div>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={handleAddText}>Add Text</Button>
    </div>
  );
}
