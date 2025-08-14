"use client";

import { useAudioEdit } from "../model/hooks/useAudioEdit";
import AudioFileUploadArea from "./_component/AudioFileUploadArea";
import AudioListArea from "./_component/AudioListArea";
import AudioInstructions from "./_component/AudioInstructions";

export default function MusicEditSubSide() {
  const { state, actions, fileInputRef } = useAudioEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Audio</h3>

      <AudioFileUploadArea
        fileInputRef={fileInputRef}
        actions={actions}
        dragActive={state.dragActive}
        loading={state.loading}
      />

      <AudioListArea
        uploadedAudios={state.uploadedAudios}
        playingIndex={state.playingIndex}
        togglePreview={actions.togglePreview}
        removeAudio={actions.removeAudio}
      />

      <AudioInstructions />
    </div>
  );
}
