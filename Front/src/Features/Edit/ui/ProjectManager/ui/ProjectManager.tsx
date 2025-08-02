"use client";

import React, { useState, useEffect } from "react";
import { Save, FolderOpen, Plus, Trash2, Copy } from "lucide-react";
import Button from "@/src/shared/ui/atoms/Button/ui/Button";
import Dialog from "@/src/shared/ui/atoms/Dialog/ui/Dialog";
import Input from "@/src/shared/ui/atoms/Input/ui/Input";
import { useProjectStore } from "@/src/entities/Project/useProjectStore";
import { SavedProject } from "@/src/shared/lib/indexedDB";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";

interface ProjectManagerProps {
  onClose: () => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ onClose }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveProjectName, setSaveProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const { project } = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const allProjects = await ProjectPersistenceService.getAllProjects();
    setProjects(allProjects);
    setLoading(false);
  };

  const handleSaveProject = async () => {
    if (!saveProjectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    setLoading(true);
    try {
      await ProjectPersistenceService.saveCurrentProject(saveProjectName);
      await loadProjects();
      setShowSaveDialog(false);
      setSaveProjectName("");
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Please try again.");
    }
    setLoading(false);
  };

  const handleLoadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const success = await ProjectPersistenceService.loadProject(projectId);
      if (success) {
        onClose();
      } else {
        alert("Failed to load project. The project may be corrupted or no longer exist.");
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      alert("Failed to load project. Please try again.");
    }
    setLoading(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      await ProjectPersistenceService.deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
    setLoading(false);
  };

  const handleDuplicateProject = async (projectId: string) => {
    setLoading(true);
    try {
      await ProjectPersistenceService.duplicateProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error("Failed to duplicate project:", error);
    }
    setLoading(false);
  };

  const handleNewProject = async () => {
    setLoading(true);
    try {
      await ProjectPersistenceService.createNewProject();
      onClose();
    } catch (error) {
      console.error("Failed to create new project:", error);
    }
    setLoading(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setSaveProjectName(project.name);
            setShowSaveDialog(true);
          }}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <Save size={16} />
          Save Project
        </Button>
        <Button onClick={handleNewProject} className="flex items-center gap-2" disabled={loading}>
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Saved Projects</h3>

        {loading ? (
          <div className="text-center py-8 text-zinc-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">No saved projects</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projects.map((savedProject) => (
              <div
                key={savedProject.id}
                className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{savedProject.name}</h4>
                  <p className="text-zinc-400 text-sm">Updated: {formatDate(savedProject.updatedAt)}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleLoadProject(savedProject.id)}
                    className="flex items-center gap-1"
                    disabled={loading}
                  >
                    <FolderOpen size={14} />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => handleDuplicateProject(savedProject.id)}
                    disabled={loading}
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => handleDeleteProject(savedProject.id)}
                    disabled={loading}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)} title="Save Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Project Name</label>
            <Input
              value={saveProjectName}
              onChange={(e) => setSaveProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="light" onClick={() => setShowSaveDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject} disabled={loading || !saveProjectName.trim()}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProjectManager;
