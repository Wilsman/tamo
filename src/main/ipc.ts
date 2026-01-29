import { ipcMain } from "electron";
import { IPC_CHANNELS, ActionType, DockAnchor, AppState } from "./types";
import { applyAction } from "./state";
import { saveState, resetState } from "./store";
import { getDockPosition, MovementState } from "./movement";

type StateGetter = () => AppState;
type StateSetter = (state: AppState) => void;
type MovementGetter = () => MovementState;
type MovementSetter = (movement: MovementState) => void;

export function setupIPC(
  getState: StateGetter,
  setState: StateSetter,
  getMovement: MovementGetter,
  setMovement: MovementSetter,
): void {
  ipcMain.on(IPC_CHANNELS.ACTION, (_event, payload: { type: ActionType }) => {
    const state = getState();
    const newState = applyAction(state, payload.type);
    setState(newState);
    saveState(newState);
    broadcastState(newState);
  });

  ipcMain.on(
    IPC_CHANNELS.SET_DOCK,
    (
      _event,
      payload: { docked: boolean; anchor?: DockAnchor; x?: number; y?: number },
    ) => {
      const state = getState();
      const newState: AppState = {
        ...state,
        uiPrefs: {
          ...state.uiPrefs,
          docked: payload.docked,
          dockAnchor: payload.anchor ?? state.uiPrefs.dockAnchor,
          dockX: payload.x ?? state.uiPrefs.dockX,
          dockY: payload.y ?? state.uiPrefs.dockY,
        },
      };

      if (payload.docked) {
        const dockPos = getDockPosition(
          newState.uiPrefs.dockAnchor,
          newState.uiPrefs.dockX,
          newState.uiPrefs.dockY,
        );
        const movement = getMovement();
        setMovement({ ...movement, position: dockPos });
      }

      setState(newState);
      saveState(newState);
      broadcastState(newState);
    },
  );

  ipcMain.on(IPC_CHANNELS.SET_SKIN, (_event, payload: { skinId: string }) => {
    const state = getState();
    const newState: AppState = {
      ...state,
      uiPrefs: { ...state.uiPrefs, skinId: payload.skinId },
    };
    setState(newState);
    saveState(newState);
    broadcastState(newState);
  });

  ipcMain.on(
    IPC_CHANNELS.TOGGLE_SHELL,
    (_event, payload: { enabled: boolean }) => {
      const state = getState();
      const newState: AppState = {
        ...state,
        uiPrefs: { ...state.uiPrefs, shellEnabled: payload.enabled },
      };
      setState(newState);
      saveState(newState);
      broadcastState(newState);
    },
  );

  ipcMain.on(IPC_CHANNELS.PAUSE, (_event, payload: { paused: boolean }) => {
    const state = getState();
    const newState: AppState = {
      ...state,
      uiPrefs: { ...state.uiPrefs, paused: payload.paused },
    };
    setState(newState);
    saveState(newState);
    broadcastState(newState);
  });

  ipcMain.on(IPC_CHANNELS.RESET_PET, () => {
    const newState = resetState();
    setState(newState);
    broadcastState(newState);
  });
}

export function broadcastState(state: AppState): void {
  const { getPetWindow } = require("./windows");
  const petWindow = getPetWindow();

  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send(IPC_CHANNELS.STATE_UPDATE, {
      petState: state.petState,
      uiPrefs: state.uiPrefs,
    });
  }
}

export function broadcastPosition(
  position: { x: number; y: number },
  direction: string,
  isRunning?: boolean,
): void {
  const { getPetWindow } = require("./windows");
  const petWindow = getPetWindow();
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send(IPC_CHANNELS.POSITION_UPDATE, {
      position,
      direction,
      isRunning: isRunning || false,
    });
  }
}
