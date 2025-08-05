"use client";

import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import IconButton from "@/src/shared/ui/atoms/Button/ui/IconButton";
import { ArrowLeft, Circle, CircleOff, MousePointer2, Plus, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectCard from "./_component/ProjectCard/ui/ProjectCard";
import Dialog from "@/src/shared/ui/atoms/Dialog/ui/Dialog";
import ProjectCreator from "@/src/features/ProjectCreator/ui/ProjectCreator";
import { useLoadAllProject } from "../model/hooks/useLoadAllProject";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";

export default function Project() {
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showSelectMode, setShowSelectMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const { projects, loading, refetch } = useLoadAllProject();
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
            <h1 className="text-base text-zinc-400">{projects.length} projects</h1>
          </div>
        </div>
        {!showSelectMode && (
          <div className="flex gap-2">
            <Button onClick={() => setShowSelectMode(true)} variant="light" className="flex items-center gap-2">
              <MousePointer2 size={16} /> Select
            </Button>
            <Button onClick={() => setShowProjectManager(true)} variant="light" className="flex items-center gap-2">
              <Plus size={16} /> New Project
            </Button>
          </div>
        )}
        {showSelectMode && (
          <div className="flex gap-2">
            {projects.length !== 0 && selectedProjects.length === projects.length && (
              <Button
                variant="light"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedProjects([]);
                }}
              >
                <CircleOff size={16} /> Deselect All
              </Button>
            )}
            {selectedProjects.length !== projects.length && (
              <Button
                variant="light"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedProjects(projects.map((project) => project.id));
                }}
              >
                <Circle size={16} /> Select All
              </Button>
            )}
            <Button
              onClick={async () => {
                const confirmDelete = window.confirm(
                  `Are you sure you want to delete ${selectedProjects.length} selected project(s)?`
                );
                if (confirmDelete) {
                  try {
                    await Promise.all(
                      selectedProjects.map((projectId) => ProjectPersistenceService.deleteProject(projectId))
                    );
                    setSelectedProjects([]);
                    refetch(); // Refresh the projects list
                  } catch (error) {
                    console.error("Failed to delete projects:", error);
                    alert("Failed to delete some projects. Please try again.");
                  }
                }
              }}
              variant="light"
              className="flex items-center gap-2"
              disabled={selectedProjects.length === 0}
            >
              <Trash size={16} /> Delete ({selectedProjects.length})
            </Button>
            <Button
              onClick={() => {
                setShowSelectMode(false);
                setSelectedProjects([]);
              }}
              variant="light"
              className="flex items-center gap-2"
            >
              <X size={16} /> Cancel Select
            </Button>
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            selectMode={showSelectMode}
            isSelected={selectedProjects.includes(project.id)}
            onSelect={(projectId, selected) => {
              if (selected) {
                setSelectedProjects((prev) => [...prev, projectId]);
              } else {
                setSelectedProjects((prev) => prev.filter((id) => id !== projectId));
              }
            }}
          />
        ))}
      </div>

      <Dialog open={showProjectManager} onClose={() => setShowProjectManager(false)} title="New Project">
        <ProjectCreator onClose={() => setShowProjectManager(false)} />
      </Dialog>
    </div>
  );
}
