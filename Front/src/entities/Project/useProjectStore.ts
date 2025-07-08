import { create } from "zustand";
import { ProjectType } from "./types";

interface ProjectStore {
  project: ProjectType;
  setProject: (project: ProjectType) => void;
}

export const initialProject: ProjectType = {
  id: crypto.randomUUID(),
  name: "Untitled",
};

export const useProjectStore = create<ProjectStore>((set) => ({
  project: initialProject,
  setProject: (project) => set({ project }),
}));
