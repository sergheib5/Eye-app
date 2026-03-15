"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTimer = startTimer;
exports.stopTimer = stopTimer;
let currentTimerId = null;
function startTimer(intervalMinutes, callback) {
    // If a timer is already running, clear it before starting a new one
    if (currentTimerId) {
        stopTimer();
    }
    const intervalMs = intervalMinutes * 60 * 1000;
    currentTimerId = setInterval(callback, intervalMs);
}
function stopTimer() {
    if (currentTimerId) {
        clearInterval(currentTimerId);
        currentTimerId = null;
    }
}
//# sourceMappingURL=timer.js.map