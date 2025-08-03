"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Player from "@/src/features/Edit/ui/player/ui/Player";
import { ProjectPersistenceService } from "@/src/shared/lib/projectPersistence";

interface EditPageProps {
  params: Promise<{ projectId: string }>;
}

export default function Edit({ params }: EditPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [projectExists, setProjectExists] = useState(false);
  const router = useRouter();
  const { projectId } = use(params);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const success = await ProjectPersistenceService.loadProject(projectId);
        if (success) {
          setProjectExists(true);
        } else {
          // 프로젝트가 존재하지 않으면 projects 페이지로 리다이렉트
          router.replace('/projects');
          return;
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        router.replace('/projects');
        return;
      }
      setIsLoading(false);
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center">
        <div className="text-white">Loading project...</div>
      </div>
    );
  }

  if (!projectExists) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <Player />
    </div>
  );
}
