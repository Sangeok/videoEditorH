export interface TextElement {
  id: string;
  text: string;
  type: string;
  positionX: number;
  positionY: number;
  startTime: number;
  endTime: number;
  duration: number;
  font_size: number;
  textAlign: string;
  animation: string;
}

export interface VideoElement {
  id: string;
  startTime: number;
  endTime: number;
}

export interface Media {
  projectDuration: number;
  textElement: TextElement[];
  //   videoElement: VideoElement[];
  //   audioElement: AudioElement[];
  //   imageElement: ImageElement[];
}
