import {
  AudioElement,
  MediaElement,
  TextElement,
} from "@/entities/media/types";
import { timeToPixels } from "@/shared/lib/timeConversion";

export type TimelineAnyElement = MediaElement | AudioElement | TextElement;

export interface SnapCandidate {
  time: number; // seconds
  px: number; // x position in pixels
  sourceId: string; // element id
  edge: "start" | "end";
}

/**
 * Build snap candidates (start/end) from all visible elements across tracks.
 * Caller should pass already filtered elements if needed (e.g., viewport range).
 */
export function buildSnapCandidates(
  allElements: TimelineAnyElement[],
  pixelsPerSecond: number,
  excludeElementId?: string | null
): SnapCandidate[] {
  const result: SnapCandidate[] = [];
  for (const el of allElements) {
    if (excludeElementId && el.id === excludeElementId) continue;
    const startPx = timeToPixels(el.startTime, pixelsPerSecond);
    const endPx = timeToPixels(el.endTime, pixelsPerSecond);
    result.push({
      time: el.startTime,
      px: startPx,
      sourceId: el.id,
      edge: "start",
    });
    result.push({ time: el.endTime, px: endPx, sourceId: el.id, edge: "end" });
  }
  // Sort by pixel position for quick nearest search
  result.sort((a, b) => a.px - b.px);
  return result;
}

export interface NearestSnapResult {
  candidate: SnapCandidate | null;
  distancePx: number;
}

/**
 * Find nearest candidate to a given pixel x within tolerance. Returns null if none under tolerance.
 */
export function findNearestSnapCandidate(
  xPx: number,
  candidates: SnapCandidate[],
  tolerancePx: number
): NearestSnapResult {
  if (candidates.length === 0) return { candidate: null, distancePx: Infinity };

  // Binary search for insertion point
  let lo = 0;
  let hi = candidates.length - 1;
  let idx = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (candidates[mid].px < xPx) lo = mid + 1;
    else {
      idx = mid;
      hi = mid - 1;
    }
  }

  const nearby = [idx - 1, idx, idx + 1].filter(
    (i) => i >= 0 && i < candidates.length
  );
  let best: SnapCandidate | null = null;
  let bestDist = Infinity;
  for (const i of nearby) {
    const c = candidates[i];
    const d = Math.abs(c.px - xPx);
    if (d < bestDist) {
      best = c;
      bestDist = d;
    }
  }

  if (best && bestDist <= tolerancePx)
    return { candidate: best, distancePx: bestDist };
  return { candidate: null, distancePx: Infinity };
}
