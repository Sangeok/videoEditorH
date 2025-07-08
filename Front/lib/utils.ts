import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 초 단위의 시간을 "mm:ss" 형식으로 포맷팅합니다
 * @param seconds - 초 단위의 시간
 * @returns "mm:ss" 형식의 문자열
 */
export function formatTime(seconds: number): string {
  // 음수나 유효하지 않은 값 처리
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // 소수점 제거하고 정수로 변환
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // 2자리 수로 패딩
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
