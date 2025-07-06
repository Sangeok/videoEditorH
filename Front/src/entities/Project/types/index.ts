export interface TextElement {
  id: string;
  text: string;
  type: string;
  positionX: number;
  positionY: number;
  from_time: number;
  to_time: number;
  font_size: number;
  textAlign: string;
  animation: string;
}

export interface ProjectType {
  id: string;
  name: string;
  projectDuration: number;
  textElement: TextElement[];
}
