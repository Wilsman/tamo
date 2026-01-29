import Store from 'electron-store';
import { AppState } from './types';
import { createInitialAppState } from './state';

const store = new Store<{ appState: AppState }>({
  name: 'tamagotchi-buddy',
  defaults: {
    appState: createInitialAppState(),
  },
});

export function loadState(): AppState {
  return store.get('appState');
}

export function saveState(state: AppState): void {
  store.set('appState', { ...state, lastSavedAt: Date.now() });
}

export function resetState(): AppState {
  const newState = createInitialAppState();
  store.set('appState', newState);
  return newState;
}
