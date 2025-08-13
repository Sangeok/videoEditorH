"use client";

import { useRouter } from "next/navigation";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { Download, Menu, MoveLeft, Save } from "lucide-react";
import { useState } from "react";
import Dropdown from "@/shared/ui/atoms/Dropdown/ui/Dropdown";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { MenuItem } from "../constants/MenuItem";
import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";
import { useProjectStore } from "@/entities/project/useProjectStore";

export default function EditorHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { project } = useProjectStore();

  const router = useRouter();

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

  const HeaderLeftButton = [
    {
      icon: <Menu size={18} />,
      label: "Menu",
      children: (
        <Dropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dropdownItems={MenuItem}
        />
      ),
      onClick: () => {
        setIsOpen(!isOpen);
      },
    },
    {
      icon: <MoveLeft size={18} />,
      label: "Previous",
      onClick: () => {
        router.back();
      },
    },
  ];

  const HeaderRightButton = [
    {
      icon: <Save size={16} />,
      label: "Save",
      onClick: handleQuickSave,
      disabled: loading,
    },
    {
      icon: <Download size={16} />,
      label: "Export",
      onClick: () => {},
    },
  ];

  return (
    <header className="col-span-2 bg-black border-b border-white/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {HeaderLeftButton.map((button) => (
            <IconButton key={button.label} onClick={button.onClick}>
              {button.icon}
              {button.children}
            </IconButton>
          ))}
        </div>

        <span className="text-white text-sm mr-4">
          {project.id ? project.name : "Loading..."}
        </span>
        {/* <ProjectMenu /> */}

        <div className="flex items-center gap-2">
          {HeaderRightButton.map((button) => (
            <Button variant="dark" key={button.label}>
              <div className="flex items-center gap-2">
                {button.icon}
                {button.label}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
