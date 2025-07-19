import { TextElement } from "@/src/entities/media/types";
import { useMediaStore } from "@/src/entities/media/useMediaStore";
import Input from "@/src/shared/ui/atoms/Input/ui/Input";
import { useState, useEffect, useCallback, useRef } from "react";

interface TextEditRightSideProps {
  selectedTrackId: string | null;
}

export default function TextEditRightSide({ selectedTrackId }: TextEditRightSideProps) {
  const { updateTextElement } = useMediaStore();
  const textElement = useMediaStore((state) =>
    state.media.textElement.find((element) => element.id === selectedTrackId)
  );

  // 로컬 상태로 즉시 UI 반응성 유지
  const [localText, setLocalText] = useState("");
  const [localWidth, setLocalWidth] = useState("");
  const [localFontSize, setLocalFontSize] = useState("");

  // debounce를 위한 timeout ref
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // textElement가 변경될 때 로컬 상태 동기화
  useEffect(() => {
    if (textElement) {
      setLocalText(textElement.text || "");
      setLocalWidth(textElement.width?.toString() || "");
      setLocalFontSize(textElement.fontSize?.toString() || "");
    } else {
      setLocalText("");
      setLocalWidth("");
      setLocalFontSize("");
    }
  }, [textElement]);

  // debounced 업데이트 함수
  const debouncedUpdateTextElement = useCallback(
    (field: keyof TextElement, value: number | string) => {
      if (!selectedTrackId) return;

      // 이전 timeout 클리어
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // 300ms 후에 실제 업데이트 실행
      debounceTimeoutRef.current = setTimeout(() => {
        updateTextElement(selectedTrackId, { [field]: value });
      }, 300);
    },
    [selectedTrackId, updateTextElement]
  );

  // 로컬 상태 업데이트 및 debounced 스토어 업데이트
  const handleTextChange = (value: string) => {
    setLocalText(value);
    debouncedUpdateTextElement("text", value);
  };

  const handleWidthChange = (value: string) => {
    setLocalWidth(value);
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      debouncedUpdateTextElement("width", numericValue);
    }
  };

  const handleFontSizeChange = (value: string) => {
    setLocalFontSize(value);
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      debouncedUpdateTextElement("fontSize", numericValue);
    }
  };

  // 컴포넌트 언마운트 시 timeout 정리
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 w-full">
          <h1>Text Content</h1>
          <Input placeholder="Text Content" value={localText} onChange={(e) => handleTextChange(e.target.value)} />

          <h1>Text width</h1>
          <Input placeholder="Text width" value={localWidth} onChange={(e) => handleWidthChange(e.target.value)} />

          <h1>Font Size</h1>
          <Input placeholder="Font Size" value={localFontSize} onChange={(e) => handleFontSizeChange(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
