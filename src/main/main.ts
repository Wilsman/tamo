import { app, BrowserWindow } from "electron";
import { createPetWindow, updatePetPosition, getPetWindow } from "./windows";
import { loadState, saveState } from "./store";
import { setupIPC, broadcastState, broadcastPosition } from "./ipc";
import {
  createInitialMovement,
  updateMovement,
  MovementState,
  getDockPosition,
} from "./movement";
import { startTicking, stopTicking, applyOfflineProgression } from "./tick";
import { createTray } from "./tray";
import { AppState } from "./types";

let appState: AppState;
let movementState: MovementState;
let movementInterval: NodeJS.Timeout | null = null;

const getState = () => appState;
const setState = (state: AppState) => {
  appState = state;
};
const getMovement = () => movementState;
const setMovement = (movement: MovementState) => {
  movementState = movement;
  updatePetPosition(movement.position);
};

function startMovementLoop(): void {
  if (movementInterval) {
    clearInterval(movementInterval);
  }

  movementInterval = setInterval(() => {
    movementState = updateMovement(movementState, appState);
    updatePetPosition(movementState.position);
    broadcastPosition(
      movementState.position,
      movementState.direction,
      movementState.isRunning,
    );
  }, 50);
}

function stopMovementLoop(): void {
  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }
}

app.whenReady().then(() => {
  appState = loadState();
  appState = applyOfflineProgression(appState);
  saveState(appState);

  movementState = createInitialMovement();

  if (appState.uiPrefs.docked) {
    const dockPos = getDockPosition(
      appState.uiPrefs.dockAnchor,
      appState.uiPrefs.dockX,
      appState.uiPrefs.dockY,
    );
    movementState.position = dockPos;
  }

  createPetWindow();
  createTray(getState, setState, getMovement, setMovement);

  setupIPC(getState, setState, getMovement, setMovement);

  const petWindow = getPetWindow();
  if (petWindow) {
    petWindow.webContents.on("did-finish-load", () => {
      broadcastState(appState);
      broadcastPosition(movementState.position, movementState.direction);
    });
    petWindow.webContents.on("did-fail-load", (_e, code, desc) => {
      console.error("Failed to load pet window:", code, desc);
    });
  }

  startTicking(getState, setState);
  startMovementLoop();
});

app.on("window-all-closed", () => {
  stopTicking();
  stopMovementLoop();
  saveState(appState);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  stopTicking();
  stopMovementLoop();
  saveState(appState);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createPetWindow();
  }
});
