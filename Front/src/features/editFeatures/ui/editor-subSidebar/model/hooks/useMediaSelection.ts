import { useState } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { MediaElement } from "@/entities/media/types";

/**
 * 미디어 요소 선택 상태를 관리하는 제네릭 훅
 * @template T - MediaElement를 확장하는 타입
 * @param mediaType - 필터링할 미디어 타입 (선택적)
 */
export function useMediaSelection<T extends MediaElement>(
  mediaType?: T["type"]
) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { media } = useMediaStore();

  const selectedItem = selectedId
    ? (media.mediaElement.find(
        (el) => el.id === selectedId && (!mediaType || el.type === mediaType)
      ) as T | undefined)
    : null;

  const select = (id: string) => {
    setSelectedId(id);
  };

  const clearSelection = () => {
    setSelectedId(null);
  };

  const isSelected = (id: string) => {
    return selectedId === id;
  };

  return {
    selectedId,
    selectedItem: selectedItem ?? null,
    select,
    clearSelection,
    isSelected,
  };
}
