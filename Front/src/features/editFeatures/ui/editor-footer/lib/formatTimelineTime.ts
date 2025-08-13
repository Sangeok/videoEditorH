/**
 * format seconds to "mm:ss"
 * @param seconds - seconds
 * @returns "mm:ss" format string
 */
export function formatPlaybackTime(seconds: number): string {
  // handle negative or invalid values
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // remove decimal and convert to integer
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // pad with 2 digits
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
