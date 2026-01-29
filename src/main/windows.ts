import { app, BrowserWindow, screen } from "electron";
import * as path from "path";
import { Position } from "./types";

const PET_SIZE = 160; // Increased to accommodate radial menu
const BUBBLE_SPACE = 80; // Space for speech bubble above pet
const TOTAL_PET_HEIGHT = 128 + BUBBLE_SPACE;

function isDev(): boolean {
  return !app.isPackaged;
}

let petWindow: BrowserWindow | null = null;

export function createPetWindow(): BrowserWindow {
  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;
  console.log(
    "Creating pet window at:",
    workArea.x + workArea.width / 2 - PET_SIZE / 2,
    workArea.y + workArea.height - PET_SIZE - BUBBLE_SPACE,
  );
  console.log("Work area:", workArea);

  petWindow = new BrowserWindow({
    width: PET_SIZE,
    height: PET_SIZE + BUBBLE_SPACE,
    x: 100,
    y: 100,
    show: true,
    frame: false,
    transparent: true,
    backgroundColor: undefined,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  petWindow.setIgnoreMouseEvents(false);

  if (isDev()) {
    petWindow.loadURL("http://localhost:5173/src/renderer/pet/index.html");
  } else {
    petWindow.loadFile(
      path.join(__dirname, "../renderer/src/renderer/pet/index.html"),
    );
  }

  petWindow.on("closed", () => {
    petWindow = null;
  });

  return petWindow;
}

export function getPetWindow(): BrowserWindow | null {
  return petWindow;
}

export function updatePetPosition(position: Position): void {
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.setPosition(
      Math.round(position.x),
      Math.round(position.y),
      false,
    );
  }
}
