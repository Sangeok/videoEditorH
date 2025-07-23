/**
 * 시간 간격 설정 (초 단위)
 * zoom 레벨에 따라 적절한 시간 간격을 반환
 */
export const getTimeIntervals = (zoom: number): number[] => {
  if (zoom >= 8) {
    // 매우 높은 zoom: 0.1초 간격
    return [0.1, 0.5, 1];
  } else if (zoom >= 4) {
    // 높은 zoom: 0.5초 간격
    return [0.5, 1, 5];
  } else if (zoom >= 2) {
    // 중간 zoom: 1초 간격
    return [1, 5, 10];
  } else if (zoom >= 1) {
    // 기본 zoom: 5초 간격
    return [5, 10, 30];
  } else if (zoom >= 0.5) {
    // 낮은 zoom: 10초 간격
    return [10, 30, 60];
  } else {
    // 매우 낮은 zoom: 30초 간격
    return [30, 60, 300];
  }
};

/**
 * 주 눈금 간격 계산
 * zoom 레벨에 따라 적절한 주 눈금 간격을 반환
 */
export const getMajorTickInterval = (zoom: number): number => {
  const intervals = getTimeIntervals(zoom);
  return intervals[1]; // 중간 값을 주 눈금으로 사용
};

/**
 * 보조 눈금 간격 계산
 * zoom 레벨에 따라 적절한 보조 눈금 간격을 반환
 */
export const getMinorTickInterval = (zoom: number): number => {
  const intervals = getTimeIntervals(zoom);
  return intervals[0]; // 가장 작은 값을 보조 눈금으로 사용
};

/**
 * 시간을 포맷팅하여 문자열로 반환
 */
export const formatTimelineTime = (seconds: number): string => {
  if (seconds < 1) {
    return `${Math.round(seconds * 10) / 10}s`;
  } else if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
};

/**
 * 시간 위치를 픽셀 위치로 변환
 */
export const timeToPixels = (time: number, pixelsPerSecond: number): number => {
  return time * pixelsPerSecond;
};

/**
 * 주어진 시간 범위에서 표시할 눈금들을 계산
 */
export const calculateTicks = (
  startTime: number,
  endTime: number,
  zoom: number,
  pixelsPerSecond: number
): {
  majorTicks: { time: number; position: number; label: string }[];
  minorTicks: { time: number; position: number }[];
} => {
  const majorInterval = getMajorTickInterval(zoom);
  const minorInterval = getMinorTickInterval(zoom);

  const majorTicks: { time: number; position: number; label: string }[] = [];
  const minorTicks: { time: number; position: number }[] = [];

  // 시작 시간을 주 눈금 간격으로 정렬
  const startMajorTick = Math.ceil(startTime / majorInterval) * majorInterval;
  const startMinorTick = Math.ceil(startTime / minorInterval) * minorInterval;

  // 주 눈금 생성
  for (let time = startMajorTick; time <= endTime; time += majorInterval) {
    majorTicks.push({
      time,
      position: timeToPixels(time, pixelsPerSecond),
      label: formatTimelineTime(time),
    });
  }

  // 보조 눈금 생성 (주 눈금과 겹치지 않도록)
  for (let time = startMinorTick; time <= endTime; time += minorInterval) {
    const isMajorTick = majorTicks.some(
      (major) => Math.abs(major.time - time) < 0.01
    );
    if (!isMajorTick) {
      minorTicks.push({
        time,
        position: timeToPixels(time, pixelsPerSecond),
      });
    }
  }

  return { majorTicks, minorTicks };
};
