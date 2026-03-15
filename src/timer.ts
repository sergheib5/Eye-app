let currentTimerId: NodeJS.Timeout | null = null;

export function startTimer(intervalMinutes: number, callback: () => void): void {
  // If a timer is already running, clear it before starting a new one
  if (currentTimerId) {
    stopTimer();
  }

  const intervalMs = intervalMinutes * 60 * 1000;
  currentTimerId = setInterval(callback, intervalMs);
}

export function stopTimer(): void {
  if (currentTimerId) {
    clearInterval(currentTimerId);
    currentTimerId = null;
  }
}
