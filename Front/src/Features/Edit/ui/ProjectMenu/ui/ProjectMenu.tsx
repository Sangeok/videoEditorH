"use client";

import React, { useState } from "react";
import { Save, FolderOpen } from "lucide-react";
import ProjectManager from "../../ProjectManager/ui/ProjectManager";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";
import { useProjectStore } from "@/src/entities/Project/useProjectStore";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import Dialog from "@/src/shared/ui/atoms/Dialog/ui/Dialog";

const ProjectMenu: React.FC = () => {
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const { project } = useProjectStore();

  const handleQuickSave = async () => {
    setLoading(true);
    try {
      await ProjectPersistenceService.saveCurrentProject();
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to save project:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-white text-sm mr-4">{project.name}</span>

        {/* <Button size="sm" onClick={handleQuickSave} disabled={loading} className="flex items-center gap-1">
          <Save size={14} />
          Save
        </Button> */}

        <Button
          size="sm"
          variant="light"
          onClick={() => setShowProjectManager(true)}
          className="flex items-center gap-1"
        >
          <FolderOpen size={14} />
          Projects
        </Button>
      </div>

      <Dialog open={showProjectManager} onClose={() => setShowProjectManager(false)} title="Project Manager">
        <ProjectManager onClose={() => setShowProjectManager(false)} />
      </Dialog>
    </>
  );
};

export default ProjectMenu;
