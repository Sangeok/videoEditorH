"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { AudioElement } from "@/entities/media/types";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { timeToPixels } from "@/features/editFeatures/ui/editor-footer/lib/zoomUtils";
import { useTimelineToolStore } from "@/features/editFeatures/model/store/useTimelieToolStore";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";

export default function AudioTimeline() {
  const { media, deleteAudioElement } = useMediaStore();
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const isDelete = useTimelineToolStore((state) => state.isDelete);
  const setSelectedTrackAndId = useSelectedTrackStore(
    (state) => state.setSelectedTrackAndId
  );

  // Filter only audio elements
  const audioElements = media.audioElement || [];

  const handleAudioClick = (audioElement: AudioElement) => {
    if (isDelete) {
      deleteAudioElement(audioElement.id);
    } else {
      setSelectedTrackAndId("Audio", audioElement.id);
    }
  };

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {/* Audio elements */}
      <div className="relative h-full">
        {audioElements.map((audioElement) => {
          const leftPosition = timeToPixels(
            audioElement.startTime,
            pixelsPerSecond
          );
          const width = timeToPixels(
            audioElement.endTime - audioElement.startTime,
            pixelsPerSecond
          );

          return (
            <div
              key={audioElement.id}
              className="absolute top-2 h-12 cursor-pointer transition-all duration-200 group"
              style={{
                left: `${leftPosition}px`,
                width: `${width}px`,
              }}
              onClick={() => handleAudioClick(audioElement)}
            >
              {/* Audio waveform visualization (placeholder) */}
              <div className="relative h-full bg-gradient-to-r from-purple-700 to-purple-500 rounded overflow-hidden border border-purple-400/50 hover:border-purple-400">
                <div className="absolute inset-0 opacity-30">
                  <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d="M0,50 Q10,30 20,50 T40,50 T60,50 T80,50 T100,50"
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.5"
                    />
                    <path
                      d="M0,50 Q5,35 10,50 T20,50 Q25,40 30,50 T40,50 Q45,35 50,50 T60,50 Q65,40 70,50 T80,50 Q85,35 90,50 T100,50"
                      stroke="white"
                      strokeWidth="0.5"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Volume indicator */}
                {audioElement.volume !== undefined &&
                  audioElement.volume < 1 && (
                    <div className="absolute top-1 right-1 bg-black/50 px-1 rounded text-xs text-white">
                      {Math.round(audioElement.volume * 100)}%
                    </div>
                  )}

                {/* Audio name/id */}
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xs font-medium truncate pr-8 pointer-events-none">
                  Audio {audioElement.id.slice(-4)}
                </span>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
            </div>
          );
        })}
      </div>

      {/* empty state message */}
      {audioElements.length === 0 && (
        <div className="absolute top-0 w-full h-full flex items-center justify-center text-gray-500 text-sm">
          There is no audio element.
        </div>
      )}
    </div>
  );
}
