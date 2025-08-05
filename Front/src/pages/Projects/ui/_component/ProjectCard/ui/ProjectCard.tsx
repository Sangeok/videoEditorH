"use client";

import { SavedProject } from "@/src/shared/lib/indexedDB";
import { Calendar, Video } from "lucide-react";
import { useLoadProject } from "../model/hooks/useLoadProject";

interface ProjectCardProps {
  project: SavedProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { handleLoadProject } = useLoadProject();

  return (
    <div
      onClick={() => handleLoadProject(project.id)}
      className="hover:bg-zinc-800 cursor-pointer rounded-lg p-4 h-full"
    >
      <div className="bg-zinc-900/50 flex items-center justify-center">
        <Video className="h-40 w-12 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <h1 className="text-base font-semibold">{project.name}</h1>
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <h1 className="text-sm text-zinc-400">
            Created {project.createdAt.toLocaleDateString()}
          </h1>
        </div>
      </div>
    </div>
  );
}
