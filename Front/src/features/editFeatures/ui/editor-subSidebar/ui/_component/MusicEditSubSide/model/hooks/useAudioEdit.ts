import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop } from "./useDragAndDrop";
import { useAudioPreview } from "./useAudioPreview";
import { useAudioFileProcessor } from "./useAudioFileProcessor";
import { AudioEditState, AudioEditActions } from "../types";

export function useAudioEdit(): {
  state: AudioEditState;
  actions: AudioEditActions;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
} {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const audioPreview = useAudioPreview();
  const audioProcessor = useAudioFileProcessor();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, (file) => {
      audioProcessor.processAudioFile(
        file,
        () => fileUpload.setLoading(true),
        (audio) => {
          fileUpload.addAudio(audio);
          fileUpload.setLoading(false);
        },
        () => fileUpload.setLoading(false)
      );
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      handleFileSelect(files);
    });
  };

  const removeAudio = (index: number) => {
    audioPreview.stopPreviewForIndex(index);
    fileUpload.removeAudio(index);
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedAudios: fileUpload.uploadedAudios,
      dragActive: dragAndDrop.dragActive,
      loading: fileUpload.loading,
      previewAudio: audioPreview.previewAudio,
      playingIndex: audioPreview.playingIndex,
    },
    actions: {
      handleFileSelect,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      togglePreview: audioPreview.togglePreview,
      removeAudio,
    },
  };
}
