import { useState, useRef, useEffect } from "react";
import { AudioFile } from "../types";

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedAudio, setUploadedAudio] = useState<AudioFile[]>([]);
  const audioUrlsRef = useRef<Set<string>>(new Set());

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve(0);
      });
      
      audio.src = url;
    });
  };

  const processAudioFile = async (file: File) => {
    if (!file.type.startsWith("audio/")) return;

    // 더 안정적인 Blob URL 생성 (오디오 끊김 방지)
    const audioBlob = new Blob([file], { type: file.type });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // duration 계산을 위한 안정적인 방법
    const duration = await getAudioDuration(file);

    // 메모리 효율성을 위한 파일 크기 제한 (100MB)
    if (file.size > 100 * 1024 * 1024) {
      console.warn('Audio file too large, may cause playback issues:', file.name);
    }

    // URL 추적을 위해 Set에 추가 (메모리 누수 방지)
    audioUrlsRef.current.add(audioUrl);

    const audioFile: AudioFile = {
      name: file.name,
      url: audioUrl,
      duration,
      size: file.size,
    };

    setUploadedAudio((prev) => [...prev, audioFile]);
  };

  const handleFileSelect = (
    files: FileList | null
  ) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      processAudioFile(file);
    });
  };

  const removeAudio = (index: number) => {
    setUploadedAudio((prev) => {
      const audioToRemove = prev[index];
      if (audioToRemove) {
        // Blob URL 메모리 해제
        URL.revokeObjectURL(audioToRemove.url);
        audioUrlsRef.current.delete(audioToRemove.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // 컴포넌트 언마운트 시 모든 Blob URL 해제
  useEffect(() => {
    const audioUrls = audioUrlsRef.current;
    return () => {
      audioUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      audioUrls.clear();
    };
  }, []); // dependency 배열 제거로 무한 루프 방지

  return {
    fileInputRef,
    uploadedAudio,
    handleFileSelect,
    removeAudio,
  };
}