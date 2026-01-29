export type PetStage = 'EGG' | 'BABY' | 'CHILD' | 'TEEN' | 'ADULT';
export type AdultVariant = 'ADULT_GOOD' | 'ADULT_OK' | 'ADULT_BAD' | null;
export type DockAnchor = 'BL' | 'BR' | 'TL' | 'TR' | 'CUSTOM';

export interface PetState {
  stage: PetStage;
  variant: AdultVariant;
  hunger: number;
  happiness: number;
  discipline: number;
  isSick: boolean;
  poopCount: number;
  sleeping: boolean;
  careMistakes: number;
  attention: boolean;
  disciplineNeeded: boolean;
  stageStartedAt: number;
  lastHungerDecay: number;
  lastHappinessDecay: number;
  lastPoopTime: number;
  attentionStartedAt: number | null;
}

export interface UiPrefs {
  docked: boolean;
  dockAnchor: DockAnchor;
  dockX: number | null;
  dockY: number | null;
  roamEnabled: boolean;
  speed: number;
  shellEnabled: boolean;
  skinId: string;
  paused: boolean;
}

export interface AppState {
  petState: PetState;
  uiPrefs: UiPrefs;
  lastSavedAt: number;
  lastTickAt: number;
}

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'left' | 'right' | 'up' | 'down' | 'idle';

export type ActionType =
  | 'FEED_MEAL'
  | 'SNACK'
  | 'PLAY'
  | 'CLEAN'
  | 'MEDICINE'
  | 'LIGHTS_TOGGLE'
  | 'DISCIPLINE';

export const IPC_CHANNELS = {
  PET_HOVER_ENTER: 'PET_HOVER_ENTER',
  PET_HOVER_LEAVE: 'PET_HOVER_LEAVE',
  POPOVER_HOVER_ENTER: 'POPOVER_HOVER_ENTER',
  POPOVER_HOVER_LEAVE: 'POPOVER_HOVER_LEAVE',
  ACTION: 'ACTION',
  SET_DOCK: 'SET_DOCK',
  SET_SKIN: 'SET_SKIN',
  TOGGLE_SHELL: 'TOGGLE_SHELL',
  PAUSE: 'PAUSE',
  RESET_PET: 'RESET_PET',
  STATE_UPDATE: 'STATE_UPDATE',
  PLAY_ANIMATION: 'PLAY_ANIMATION',
  POSITION_UPDATE: 'POSITION_UPDATE',
} as const;
