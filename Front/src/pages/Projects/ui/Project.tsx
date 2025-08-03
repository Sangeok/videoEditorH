"use client";

import { SavedProject } from "@/src/shared/lib/indexedDB";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import IconButton from "@/src/shared/ui/atoms/Button/ui/IconButton";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import Dialog from "@/src/shared/ui/atoms/Dialog/ui/Dialog";
import ProjectManager from "@/src/features/Edit/ui/ProjectManager/ui/ProjectManager";

export default function Project() {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);

  const router = useRouter();

  const loadProjects = async () => {
    setLoading(true);
    const allProjects = await ProjectPersistenceService.getAllProjects();
    setProjects(allProjects);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col text-white w-full h-full p-4">
      {/* <header className="flex">
        <IconButton onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>
      </header> */}
      <div className="flex w-full mt-4 justify-between">
        <div className="flex gap-4 ">
          <IconButton onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <div className="flex h-full items-end gap-4 pl-4">
            <h1 className="text-3xl font-bold">My Projects</h1>
            <h1 className="text-base text-zinc-400">{projects.length} projects</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowProjectManager(true)} variant="light" className="flex items-center gap-2">
            <Plus size={16} /> New Project
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Dialog open={showProjectManager} onClose={() => setShowProjectManager(false)} title="New Project">
        <ProjectManager onClose={() => setShowProjectManager(false)} />
      </Dialog>
    </div>
  );
}
