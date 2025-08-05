"use client";

import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import IconButton from "@/src/shared/ui/atoms/Button/ui/IconButton";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectCard from "./_component/ProjectCard/ui/ProjectCard";
import Dialog from "@/src/shared/ui/atoms/Dialog/ui/Dialog";
import ProjectCreator from "@/src/features/ProjectCreator/ui/ProjectCreator";
import { useLoadAllProject } from "../model/hooks/useLoadAllProject";

export default function Project() {
  const [showProjectManager, setShowProjectManager] = useState(false);

  const { projects, loading } = useLoadAllProject();
  const router = useRouter();

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col text-white w-full h-full p-4">
      <div className="flex w-full mt-4 justify-between">
        <div className="flex gap-4 ">
          <IconButton onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <div className="flex h-full items-end gap-4 pl-4">
            <h1 className="text-3xl font-bold">My Projects</h1>
            <h1 className="text-base text-zinc-400">
              {projects.length} projects
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowProjectManager(true)}
            variant="light"
            className="flex items-center gap-2"
          >
            <Plus size={16} /> New Project
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Dialog
        open={showProjectManager}
        onClose={() => setShowProjectManager(false)}
        title="New Project"
      >
        <ProjectCreator onClose={() => setShowProjectManager(false)} />
      </Dialog>
    </div>
  );
}
