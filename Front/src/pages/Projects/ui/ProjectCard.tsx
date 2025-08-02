"use client";

import { SavedProject } from "@/src/shared/lib/indexedDB";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";
import { Calendar, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectCardProps {
  project: SavedProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleLoadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const success = await ProjectPersistenceService.loadProject(projectId);
      if (success) {
        router.push(`/edit/${projectId}`);
      } else {
        alert("Failed to load project. The project may be corrupted or no longer exist.");
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      alert("Failed to load project. Please try again.");
    }
    setLoading(false);
  };
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
          <h1 className="text-sm text-zinc-400">Created {project.createdAt.toLocaleDateString()}</h1>
        </div>
        {/* <p className="text-sm text-zinc-400">{project.description}</p> */}
      </div>
    </div>
  );
}
