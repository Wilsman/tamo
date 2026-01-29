import { AppState } from './types';
import { applyTick } from './state';
import { saveState } from './store';
import { broadcastState } from './ipc';

const TICK_INTERVAL = 60 * 1000;
const MAX_OFFLINE_TICKS = 12 * 60;

let tickTimer: NodeJS.Timeout | null = null;

type StateGetter = () => AppState;
type StateSetter = (state: AppState) => void;

export function startTicking(getState: StateGetter, setState: StateSetter): void {
  if (tickTimer) {
    clearInterval(tickTimer);
  }

  tickTimer = setInterval(() => {
    const state = getState();
    const now = Date.now();
    const newState = applyTick(state, now);
    setState(newState);
    saveState(newState);
    broadcastState(newState);
  }, TICK_INTERVAL);
}

export function stopTicking(): void {
  if (tickTimer) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
}

export function applyOfflineProgression(state: AppState): AppState {
  const now = Date.now();
  const elapsed = now - state.lastTickAt;
  const ticksToApply = Math.min(
    Math.floor(elapsed / TICK_INTERVAL),
    MAX_OFFLINE_TICKS
  );

  let currentState = state;
  for (let i = 0; i < ticksToApply; i++) {
    const tickTime = state.lastTickAt + (i + 1) * TICK_INTERVAL;
    currentState = applyTick(currentState, tickTime);
  }

  return { ...currentState, lastTickAt: now };
}
