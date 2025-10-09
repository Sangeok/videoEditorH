"use client";

import { useCaptionUpload } from "../model/hooks/useCaptionUpload";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import CaptionEdit from "./_components/captionEdit/ui";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export default function CaptionEditSubSide() {
  const { state, actions, fileInputRef } = useCaptionUpload();
  const { textLanes, activeLaneByType, setActiveLane, addTextLane } = useTrackLaneStore();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Captions</h3>

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

      <MediaFileUploadArea
        mediaType="caption"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <CaptionEdit />
    </div>
  );
}
