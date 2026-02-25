export const calculateWPM = (correctChars: number, timeElapsedSeconds: number): number => {
  const words = correctChars / 5;
  const minutes = timeElapsedSeconds / 60;
  return Math.round(words / minutes);
};

export const calculateAccuracy = (correctChars: number, totalTyped: number): number => {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Split code into lines for visual rendering, preserving indentation
export const parseCodeToLines = (code: string): string[] => {
  return code.split('\n');
};
