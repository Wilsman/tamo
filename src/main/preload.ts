import { contextBridge, ipcRenderer } from "electron";

const IPC = {
  ACTION: "ACTION",
  SET_DOCK: "SET_DOCK",
  SET_SKIN: "SET_SKIN",
  TOGGLE_SHELL: "TOGGLE_SHELL",
  PAUSE: "PAUSE",
  RESET_PET: "RESET_PET",
  STATE_UPDATE: "STATE_UPDATE",
  POSITION_UPDATE: "POSITION_UPDATE",
};

contextBridge.exposeInMainWorld("electronAPI", {
  onStateUpdate: (callback: (data: unknown) => void) => {
    ipcRenderer.on(IPC.STATE_UPDATE, (_event, data) => callback(data));
  },
  onPositionUpdate: (callback: (data: unknown) => void) => {
    ipcRenderer.on(IPC.POSITION_UPDATE, (_event, data) => callback(data));
  },
  sendAction: (type: string) => ipcRenderer.send(IPC.ACTION, { type }),
  setDock: (payload: {
    docked: boolean;
    anchor?: string;
    x?: number;
    y?: number;
  }) => ipcRenderer.send(IPC.SET_DOCK, payload),
  setSkin: (skinId: string) => ipcRenderer.send(IPC.SET_SKIN, { skinId }),
  toggleShell: (enabled: boolean) =>
    ipcRenderer.send(IPC.TOGGLE_SHELL, { enabled }),
  pause: (paused: boolean) => ipcRenderer.send(IPC.PAUSE, { paused }),
  resetPet: () => ipcRenderer.send(IPC.RESET_PET),
});
