"use client";

import { useAudioEdit } from "../model/hooks/useAudioEdit";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import AudioListArea from "./_component/AudioListArea";
import AudioInstructions from "./_component/AudioInstructions";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export default function MusicEditSubSide() {
  const { state, actions, fileInputRef } = useAudioEdit();
  const { audioLanes, activeLaneByType, setActiveLane, addAudioLane } = useTrackLaneStore();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Audio</h3>

      {/* Lane selector */}
      <div className="flex items-center gap-2 w-full">
        <label className="text-xs text-gray-400">Audio Track:</label>
        <select
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white"
          value={activeLaneByType.audio}
          onChange={(e) => setActiveLane("audio", e.target.value)}
        >
          {audioLanes.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button
          className="px-2 py-1 text-xs border border-zinc-700 rounded text-white hover:bg-zinc-800"
          onClick={() => {
            const id = addAudioLane();
            setActiveLane("audio", id);
          }}
        >
          + New Lane
        </button>
      </div>

      <MediaFileUploadArea
        mediaType="audio"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
        loading={state.loading}
      />

      <AudioListArea
        uploadedAudios={state.uploadedAudios}
        playingIndex={state.playingIndex}
        togglePreview={actions.togglePreview}
        removeAudio={actions.removeAudio}
        addAudioToTimeLine={actions.addAudioToTimeLine}
      />

      <AudioInstructions />
    </div>
  );
}
