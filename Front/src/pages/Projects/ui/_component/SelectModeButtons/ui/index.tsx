import { useLoadAllProject } from "@/src/pages/Projects/model/hooks/useLoadAllProject";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import { Circle, CircleOff, Trash, X } from "lucide-react";

interface SelectModeButtonsProps {
  selectedProjects: string[];
  setSelectedProjects: (projects: string[]) => void;
  setShowSelectMode: (show: boolean) => void;
}

export default function SelectModeButtons({
  selectedProjects,
  setSelectedProjects,
  setShowSelectMode,
}: SelectModeButtonsProps) {
  const { projects, refetch } = useLoadAllProject();

  return (
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
                selectedProjects.map((projectId) =>
                  ProjectPersistenceService.deleteProject(projectId)
                )
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
  );
}
