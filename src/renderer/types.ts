export type PetStage = "EGG" | "BABY" | "CHILD" | "TEEN" | "ADULT";
export type AdultVariant = "ADULT_GOOD" | "ADULT_OK" | "ADULT_BAD" | null;

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
}

export interface UiPrefs {
  docked: boolean;
  dockAnchor: string;
  dockX: number | null;
  dockY: number | null;
  roamEnabled: boolean;
  speed: number;
  shellEnabled: boolean;
  skinId: string;
  paused: boolean;
}

export interface StateUpdate {
  petState: PetState;
  uiPrefs: UiPrefs;
}

export interface PositionUpdate {
  position: { x: number; y: number };
  direction: "left" | "right" | "up" | "down" | "idle";
}

declare global {
  interface Window {
    electronAPI: {
      onStateUpdate: (callback: (data: StateUpdate) => void) => void;
      onPositionUpdate: (callback: (data: PositionUpdate) => void) => void;
      sendAction: (type: string) => void;
      setDock: (payload: {
        docked: boolean;
        anchor?: string;
        x?: number;
        y?: number;
      }) => void;
      setSkin: (skinId: string) => void;
      toggleShell: (enabled: boolean) => void;
      pause: (paused: boolean) => void;
      resetPet: () => void;
    };
  }
}
