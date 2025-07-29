import { useState, useCallback } from "react";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import {
  convertSRTToTextElements,
  parseSRTContent,
  readFileAsText,
} from "@/src/shared/lib/srtUtils";
import { UploadState, CaptionUploadState } from "../types";

export function useCaptionUpload() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadedCount, setUploadedCount] = useState<number>(0);
  const { addTextElement } = useMediaStore();

  const validateSRTFile = useCallback((file: File): boolean => {
    if (!file.name.toLowerCase().endsWith(".srt")) {
      setErrorMessage("Please select a valid SRT file");
      setUploadState("error");
      return false;
    }
    return true;
  }, []);

  const processSRTFile = useCallback(
    async (file: File): Promise<void> => {
      if (!validateSRTFile(file)) return;

      setUploadState("uploading");
      setErrorMessage("");

      try {
        const srtContent = await readFileAsText(file);

        const parsedEntries = parseSRTContent(srtContent);
        const textElements = convertSRTToTextElements(parsedEntries);

        textElements.forEach((element) => {
          addTextElement(element, true);
        });

        setUploadedCount(textElements.length);
        setUploadState("success");
      } catch (error) {
        console.error("Error processing SRT file:", error);
        setErrorMessage(
          "Failed to parse SRT file. Please check the file format."
        );
        setUploadState("error");
      }
    },
    [addTextElement, validateSRTFile]
  );

  const resetUpload = useCallback(() => {
    setUploadState("idle");
    setErrorMessage("");
    setUploadedCount(0);
  }, []);

  const state: CaptionUploadState = {
    uploadState,
    errorMessage,
    uploadedCount,
  };

  return {
    state,
    actions: {
      processSRTFile,
      resetUpload,
    },
  };
}
