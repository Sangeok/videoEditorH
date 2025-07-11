export interface TextElement {
  id: string;
  type: string;
  startTime: number;
  endTime: number;
  duration: number;
  textAlign: string;

  text: string;
  positionX: number;
  positionY: number;
  fontSize: number;
  animation: string;
  textColor: string;
  backgroundColor: string;
  font: string;
  width: number;
  height: number;
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
