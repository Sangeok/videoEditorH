import { create } from "zustand";
import { ProjectType, TextElement } from "./types";

interface ProjectStore {
  project: ProjectType;
  setProject: (project: ProjectType) => void;
  addTextElement: (textElement: TextElement) => void;
}

export const initialProject: ProjectType = {
  id: crypto.randomUUID(),
  name: "Untitled",

  // video duration
  projectDuration: 0,

  textElement: [],
};

export const useProjectStore = create<ProjectStore>((set) => ({
  project: initialProject,
  setProject: (project) => set({ project }),

  addTextElement: (textElement: TextElement) =>
    set((state) => {
      const currentTextElements = state.project.textElement;
      let newTextElement: TextElement;

      if (currentTextElements.length === 0) {
        // 첫 번째 텍스트 요소: 전달받은 from_time, to_time 사용
        newTextElement = { ...textElement };
      } else {
        // 두 번째 이후 텍스트 요소: 이전 요소의 to_time을 기준으로 설정
        const lastElement = currentTextElements[currentTextElements.length - 1];
        const defaultDuration = 3; // 기본 지속시간 3초

        newTextElement = {
          ...textElement,
          from_time: lastElement.to_time,
          to_time: lastElement.to_time + defaultDuration,
        };
      }

      const updatedTextElements = [...currentTextElements, newTextElement];

      // projectDuration을 가장 마지막 요소의 to_time으로 업데이트
      const newProjectDuration = Math.max(state.project.projectDuration, newTextElement.to_time);

      return {
        project: {
          ...state.project,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
}));
