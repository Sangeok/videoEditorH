export interface TextElement {
  id: string;
  type: string;
  startTime: number;
  endTime: number;
  duration: number;

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

export interface MediaElement {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: "video" | "image";

  url: string;
  width: number;
  height: number;
  opacity: number;
  rotate: string;
  visibility: "visible" | "hidden";
  top: number | string;
  left: number | string;

  // video only
  volume: number;
  speed: number;
}

export interface Media {
  projectDuration: number;
  fps: number;
  textElement: TextElement[];
  mediaElement: MediaElement[];
}
