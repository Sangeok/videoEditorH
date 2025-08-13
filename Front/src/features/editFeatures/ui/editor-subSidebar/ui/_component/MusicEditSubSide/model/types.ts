export interface AudioFile {
  name: string;
  url: string;
  duration?: number;
  size: number;
}

export interface AudioEditState {
  uploadedAudio: AudioFile[];
  dragActive: boolean;
}