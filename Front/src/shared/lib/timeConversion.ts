export const pixelsToTime = (
  pixels: number,
  pixelsPerSecond: number
): number => {
  const time = pixels / pixelsPerSecond;
  return Math.round(time * 1000) / 1000;
};

export const timeToPixels = (time: number, pixelsPerSecond: number): number => {
  const pixels = time * pixelsPerSecond;
  return Math.round(pixels * 1000) / 1000;
};

export const roundTime = (time: number): number => {
  return Math.round(time * 1000) / 1000;
};
