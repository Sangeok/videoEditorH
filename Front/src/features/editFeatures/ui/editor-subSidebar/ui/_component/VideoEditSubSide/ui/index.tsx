"use client";

import { useVideoEdit } from "../model/hooks/useVideoEdit";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import VideoPreviewArea from "./_component/VideoPreviewArea";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export default function VideoEditSubSide() {
  const { state, actions, fileInputRef } = useVideoEdit();
  const { mediaLanes, activeLaneByType, setActiveLane, addMediaLane } = useTrackLaneStore();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Video</h3>

      {/* Lane selector */}
      <div className="flex items-center gap-2 w-full">
        <label className="text-xs text-gray-400">Media Track:</label>
        <select
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white"
          value={activeLaneByType.media}
          onChange={(e) => setActiveLane("media", e.target.value)}
        >
          {mediaLanes.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button
          className="px-2 py-1 text-xs border border-zinc-700 rounded text-white hover:bg-zinc-800"
          onClick={() => {
            const id = addMediaLane();
            setActiveLane("media", id);
          }}
        >
          + New Lane
        </button>
      </div>

      <MediaFileUploadArea
        mediaType="video"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <VideoPreviewArea
        uploadedVideos={state.uploadedVideos}
        removeVideo={actions.removeVideo}
        addVideoToTimeLine={actions.addVideoToTimeLine}
      />
    </div>
  );
}
