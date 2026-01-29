import { Tray, Menu, nativeImage, app } from 'electron';
import * as path from 'path';
import { IPC_CHANNELS, AppState } from './types';
import { saveState, resetState } from './store';
import { broadcastState } from './ipc';
import { getDockPosition, MovementState } from './movement';

let tray: Tray | null = null;

type StateGetter = () => AppState;
type StateSetter = (state: AppState) => void;
type MovementGetter = () => MovementState;
type MovementSetter = (movement: MovementState) => void;

export function createTray(
  getState: StateGetter,
  setState: StateSetter,
  getMovement: MovementGetter,
  setMovement: MovementSetter
): Tray {
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  let icon: Electron.NativeImage;
  
  try {
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      icon = nativeImage.createEmpty();
    }
  } catch {
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);
  tray.setToolTip('Desktop Tamagotchi Buddy');

  const updateMenu = () => {
    const state = getState();
    const contextMenu = Menu.buildFromTemplate([
      {
        label: state.uiPrefs.docked ? 'Undock' : 'Dock',
        click: () => {
          const currentState = getState();
          const newDocked = !currentState.uiPrefs.docked;
          const newState: AppState = {
            ...currentState,
            uiPrefs: { ...currentState.uiPrefs, docked: newDocked },
          };

          if (newDocked) {
            const dockPos = getDockPosition(
              newState.uiPrefs.dockAnchor,
              newState.uiPrefs.dockX,
              newState.uiPrefs.dockY
            );
            const movement = getMovement();
            setMovement({ ...movement, position: dockPos });
          }

          setState(newState);
          saveState(newState);
          broadcastState(newState);
          updateMenu();
        },
      },
      { type: 'separator' },
      {
        label: state.uiPrefs.paused ? 'Resume' : 'Pause',
        click: () => {
          const currentState = getState();
          const newState: AppState = {
            ...currentState,
            uiPrefs: { ...currentState.uiPrefs, paused: !currentState.uiPrefs.paused },
          };
          setState(newState);
          saveState(newState);
          broadcastState(newState);
          updateMenu();
        },
      },
      { type: 'separator' },
      {
        label: 'Dock Position',
        submenu: [
          {
            label: 'Bottom Left',
            type: 'radio',
            checked: state.uiPrefs.dockAnchor === 'BL',
            click: () => setDockAnchor('BL'),
          },
          {
            label: 'Bottom Right',
            type: 'radio',
            checked: state.uiPrefs.dockAnchor === 'BR',
            click: () => setDockAnchor('BR'),
          },
          {
            label: 'Top Left',
            type: 'radio',
            checked: state.uiPrefs.dockAnchor === 'TL',
            click: () => setDockAnchor('TL'),
          },
          {
            label: 'Top Right',
            type: 'radio',
            checked: state.uiPrefs.dockAnchor === 'TR',
            click: () => setDockAnchor('TR'),
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Reset Pet',
        click: () => {
          const newState = resetState();
          setState(newState);
          broadcastState(newState);
          updateMenu();
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    tray?.setContextMenu(contextMenu);
  };

  const setDockAnchor = (anchor: 'BL' | 'BR' | 'TL' | 'TR') => {
    const currentState = getState();
    const newState: AppState = {
      ...currentState,
      uiPrefs: { ...currentState.uiPrefs, dockAnchor: anchor },
    };

    if (currentState.uiPrefs.docked) {
      const dockPos = getDockPosition(anchor, null, null);
      const movement = getMovement();
      setMovement({ ...movement, position: dockPos });
    }

    setState(newState);
    saveState(newState);
    broadcastState(newState);
    updateMenu();
  };

  updateMenu();
  return tray;
}
