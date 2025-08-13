export const PlayerService = {
  timeToFrame: (time: number, fps: number): number => {
    return Math.floor(time * fps);
  },

  frameToTime: (frame: number, fps: number): number => {
    return frame / fps;
  },

  roundTime: (time: number): number => {
    return Math.round(time * 100) / 100;
  },

  getDurationInFrames: (duration: number, fps: number): number => {
    return Math.floor(duration * fps) + 1;
  },
};
