"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import Input from "@/src/shared/ui/atoms/Input/ui/Input";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";
import { useRouter } from "next/navigation";

interface ProjectCreatorProps {
  onClose: () => void;
}

export default function ProjectCreator({ onClose }: ProjectCreatorProps) {
  const [saveProjectName, setSaveProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 삭제 기능 추가 시 참고
  // const handleDeleteProject = async (projectId: string) => {
  //   if (!confirm("Are you sure you want to delete this project?")) return;

  //   setLoading(true);
  //   try {
  //     await ProjectPersistenceService.deleteProject(projectId);
  //     await loadProjects();
  //   } catch (error) {
  //     console.error("Failed to delete project:", error);
  //   }
  //   setLoading(false);
  // };

  // const handleDuplicateProject = async (projectId: string) => {
  //   setLoading(true);
  //   try {
  //     await ProjectPersistenceService.duplicateProject(projectId);
  //     await loadProjects();
  //   } catch (error) {
  //     console.error("Failed to duplicate project:", error);
  //   }
  //   setLoading(false);
  // };

  const handleNewProject = async () => {
    setLoading(true);
    try {
      const newProjectId = await ProjectPersistenceService.createNewProject(
        saveProjectName
      );
      router.push(`/edit/${newProjectId}`);
      onClose();
    } catch (error) {
      console.error("Failed to create new project:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Input
        value={saveProjectName}
        onChange={(e) => setSaveProjectName(e.target.value)}
        placeholder="Enter project name"
      />

      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleNewProject}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <Plus size={16} />
          Create New Project
        </Button>
      </div>
    </div>
  );
}
