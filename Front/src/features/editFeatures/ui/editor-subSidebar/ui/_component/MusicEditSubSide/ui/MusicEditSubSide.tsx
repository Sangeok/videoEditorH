"use client";

import { useAudioEdit } from "../model/hooks/useAudioEdit";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import AudioListArea from "./_component/AudioListArea";
import AudioInstructions from "./_component/AudioInstructions";

export default function MusicEditSubSide() {
  const { state, actions, fileInputRef } = useAudioEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Audio</h3>

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
