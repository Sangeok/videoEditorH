export interface ImageEditState {
  uploadedImages: string[];
  selectedImageId: string | null;
  dragActive: boolean;
}

export interface ImageEditActions {
  handleFileSelect: (files: FileList | null) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  removeImage: (index: number) => void;
  selectImage: (imageId: string) => void;
  updateImageSettings: (imageId: string, updates: any) => void;
  deleteImage: (imageId: string) => void;
}

export interface UseImageEditReturn extends ImageEditState, ImageEditActions {
  selectedImage: any;
}