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
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function EditorHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const { project } = useProjectStore();
  const { media } = useMediaStore();

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

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // 백엔드 API 엔드포인트 (환경변수로 관리 권장)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      // 비디오 생성을 위한 데이터 준비
      const exportData = {
        project: {
          id: project.id,
          name: project.name,
        },
        media: {
          projectDuration: media.projectDuration,
          fps: media.fps,
          textElement: media.textElement,
          mediaElement: media.mediaElement,
          audioElement: media.audioElement,
        },
      };

      console.log("Exporting video with data:", exportData);

      const response = await fetch(`${API_BASE_URL}/video/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("비디오 생성 시작됨:", result.jobId);
        // TODO: 생성 완료 알림을 위한 폴링 또는 WebSocket 구현
        alert(`비디오 생성이 시작되었습니다. Job ID: ${result.jobId}`);
      } else {
        throw new Error(result.message || "비디오 생성 요청 실패");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert(`비디오 내보내기 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setExportLoading(false);
    }
  };

  const HeaderLeftButton = [
    {
      icon: <Menu size={18} />,
      label: "Menu",
      children: <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} dropdownItems={MenuItem} />,
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
      onClick: handleExport,
      disabled: exportLoading,
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

        <span className="text-white text-sm mr-4">{project.id ? project.name : "Loading..."}</span>

        <div className="flex items-center gap-2">
          {HeaderRightButton.map((button) => (
            <Button variant="dark" key={button.label} onClick={button.onClick} disabled={button.disabled}>
              <div className="flex items-center gap-2">
                {button.icon}
                {button.disabled && button.label === "Export" ? "Exporting..." : button.label}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
