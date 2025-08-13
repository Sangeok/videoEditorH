"use client";

import { use } from "react";
import { useCheckProject } from "../model/hooks/useCheckProject";
import Player from "../../../features/editFeatures/ui/player/ui/Player";

interface EditPageProps {
  params: Promise<{ projectId: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const { projectId } = use(params);

  const { isLoading, projectExists } = useCheckProject({ projectId });

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
