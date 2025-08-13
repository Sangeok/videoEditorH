// import { useAudioUpload } from "./useAudioUpload";
// import { useDragAndDrop } from "@/src/features/Edit/ui/editor-subSidebar/ui/_component/ImageEditSubSide/model/hooks/useDragAndDrop";
// import { useAudioSelection } from "./useAudioSelection";
// import { useAudioProjectManagement } from "./useAudioProjectManagement";

// export function useAudioEdit() {
//   const fileUpload = useAudioUpload();
//   const dragAndDrop = useDragAndDrop();
//   const audioSelection = useAudioSelection();
//   const projectManagement = useAudioProjectManagement();

//   const handleFileSelect = (files: FileList | null) => {
//     fileUpload.handleFileSelect(files, projectManagement.addAudioToProject);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     dragAndDrop.handleDrop(e, (files) => {
//       fileUpload.handleFileSelect(files, projectManagement.addAudioToProject);
//     });
//   };

//   const deleteAudio = (audioId: string) => {
//     projectManagement.deleteAudio(audioId);
//     if (audioSelection.isAudioSelected(audioId)) {
//       audioSelection.clearSelection();
//     }
//   };

//   return {
//     fileInputRef: fileUpload.fileInputRef,
//     state: {
//       uploadedAudios: fileUpload.uploadedAudios,
//       selectedAudioId: audioSelection.selectedAudioId,
//       dragActive: dragAndDrop.dragActive,
//       selectedAudio: audioSelection.selectedAudio,
//     },
//     actions: {
//       handleFileSelect,
//       handleDrag: dragAndDrop.handleDrag,
//       handleDrop,
//       removeAudio: fileUpload.removeAudio,
//       selectAudio: audioSelection.selectAudio,
//       updateAudioSettings: projectManagement.updateAudioSettings,
//       deleteAudio,
//     },
//   };
// }
