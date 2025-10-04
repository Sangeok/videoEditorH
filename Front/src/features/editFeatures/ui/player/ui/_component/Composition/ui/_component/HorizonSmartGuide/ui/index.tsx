"use client";

import { useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";

export default function HorizonSmartGuide() {
  const nearObjEdgeData = useSmartGuideStore((state) => state.nearObjEdgeData);
  return <div className="absolute top-0 left-0 w-full h-full">hihi</div>;
}
