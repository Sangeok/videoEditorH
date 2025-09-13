import { useCallback } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { timeToPixels } from "@/shared/lib/timeConversion";
import { useSnapGuideStore } from "@/features/editFeatures/model/store/useSnapGuideStore";
import { buildSnapCandidates, findNearestSnapCandidate } from "../../../../lib/snapUtils";

export function useSnapGuide(pixelsPerSecond: number, snapTolerancePx: number = 7) {
  const { media } = useMediaStore();
  const showGuide = useSnapGuideStore((s) => s.showGuide);
  const hideGuide = useSnapGuideStore((s) => s.hideGuide);

  const updateSnapGuide = useCallback(
    (edgeTimeSeconds: number, excludedElementId?: string | null) => {
      const xPixels = timeToPixels(edgeTimeSeconds, pixelsPerSecond);

      const allElements = [...media.mediaElement, ...media.textElement, ...media.audioElement];
      const candidates = buildSnapCandidates(allElements, pixelsPerSecond, excludedElementId || undefined);

      const nearest = findNearestSnapCandidate(xPixels, candidates, snapTolerancePx);

      if (nearest.candidate) {
        showGuide(nearest.candidate.px, nearest.candidate.time);
      } else {
        hideGuide();
      }
    },
    [media, pixelsPerSecond, snapTolerancePx, showGuide, hideGuide]
  );

  const clearSnapGuide = useCallback(() => {
    hideGuide();
  }, [hideGuide]);

  return { updateSnapGuide, clearSnapGuide };
}
