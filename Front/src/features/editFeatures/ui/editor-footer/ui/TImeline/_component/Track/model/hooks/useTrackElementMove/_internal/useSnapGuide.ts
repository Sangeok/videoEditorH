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
    (startTimeSeconds: number, durationSeconds: number, excludedElementId?: string | null) => {
      const currentStartPx = timeToPixels(startTimeSeconds, pixelsPerSecond);
      const currentEndPx = timeToPixels(startTimeSeconds + durationSeconds, pixelsPerSecond);

      const allElements = [...media.mediaElement, ...media.textElement, ...media.audioElement];
      const candidates = buildSnapCandidates(allElements, pixelsPerSecond, excludedElementId || undefined);

      const startNearest = findNearestSnapCandidate(currentStartPx, candidates, snapTolerancePx);
      const endNearest = findNearestSnapCandidate(currentEndPx, candidates, snapTolerancePx);

      const best = startNearest.distancePx <= endNearest.distancePx ? startNearest : endNearest;
      if (best.candidate) {
        showGuide(best.candidate.px, best.candidate.time);
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
