"use client";

import { useState, useRef } from "react";
import { Music, X, Play, Pause } from "lucide-react";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { AudioElement } from "@/entities/media/types";

export default function MusicEditSubSide() {
  const [uploadedAudios, setUploadedAudios] = useState<
    { url: string; name: string }[]
  >([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { media, addAudioElement } = useMediaStore();

  const processAudioFile = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      alert("Please select a valid audio file");
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const audioUrl = e.target?.result as string;
      const audioName = file.name;

      // Add to uploaded list
      setUploadedAudios((prev) => [
        ...prev,
        { url: audioUrl, name: audioName },
      ]);

      // Create audio element to get actual duration
      const audio = new Audio(audioUrl);

      audio.onloadedmetadata = () => {
        const actualDuration = audio.duration;

        // Create audio element and add to media store with actual duration
        const audioElement: AudioElement = {
          id: `audio-${Date.now()}-${Math.random()}`,
          type: "audio",
          startTime: media.projectDuration,
          endTime: media.projectDuration + actualDuration,
          duration: actualDuration,
          url: audioUrl,
          volume: 100,
          speed: 1,
        };

        addAudioElement(audioElement);
        setLoading(false);
      };

      audio.onerror = () => {
        // Fallback to default duration if metadata loading fails
        const audioElement: AudioElement = {
          id: `audio-${Date.now()}-${Math.random()}`,
          type: "audio",
          startTime: media.projectDuration,
          endTime: media.projectDuration + 30, // Fallback to 30 seconds
          duration: 30,
          url: audioUrl,
          volume: 100,
          speed: 1,
        };

        addAudioElement(audioElement);
        setLoading(false);
      };
    };

    reader.onerror = () => {
      alert("Failed to read audio file");
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      processAudioFile(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    handleFileSelect(e.dataTransfer.files);
  };

  const togglePreview = (audioUrl: string, index: number) => {
    // Stop current preview if playing
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }

    if (playingIndex === index) {
      // Stop if clicking the same audio
      setPlayingIndex(null);
      setPreviewAudio(null);
    } else {
      // Play new audio
      const audio = new Audio(audioUrl);
      audio.volume = 0.5;
      audio.play();

      audio.onended = () => {
        setPlayingIndex(null);
        setPreviewAudio(null);
      };

      setPreviewAudio(audio);
      setPlayingIndex(index);
    }
  };

  const removeAudio = (index: number) => {
    // Stop preview if playing this audio
    if (playingIndex === index && previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      setPlayingIndex(null);
    }

    setUploadedAudios((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Audio</h3>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-600 bg-zinc-800/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={loading}
        />

        <Music className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-300 mb-2">Drag & drop your audio files here</p>
        <p className="text-gray-500 text-sm mb-4">
          Supports MP3, WAV, OGG, M4A
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="light"
          size="sm"
          disabled={loading}
        >
          {loading ? "Processing..." : "Choose Audio Files"}
        </Button>
      </div>

      {/* Uploaded Audio List */}
      {uploadedAudios.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-300">
            Uploaded Audio ({uploadedAudios.length})
          </h4>
          <div className="space-y-2">
            {uploadedAudios.map((audio, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 group hover:bg-zinc-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => togglePreview(audio.url, index)}
                    className="p-2 hover:bg-zinc-600 rounded-full transition-colors"
                  >
                    {playingIndex === index ? (
                      <Pause className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Music className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 truncate">
                      {audio.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeAudio(index)}
                  className="p-1 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Audio will be added to the timeline at the current end position</p>
        <p>• You can adjust volume, trim, and effects in the right sidebar</p>
        <p>• Supports fade in/out transitions</p>
      </div>
    </div>
  );
}
