import { screen } from "electron";
import { Position, Direction, AppState, DockAnchor } from "./types";

const PET_SIZE = 128;
const BUBBLE_SPACE = 80;
const TOTAL_HEIGHT = PET_SIZE + BUBBLE_SPACE;

// Movement speeds - more differentiation between walk and run
const WALK_SPEED = 3;
const RUN_SPEED = 8;
const IDLE_CHANCE = 0.005;
const DIRECTION_CHANGE_CHANCE = 0.02;
const RUN_CHANCE = 0.35; // 35% chance to run when moving
const HORIZONTAL_BIAS = 0.7; // 70% preference for horizontal movement

export interface MovementState {
  position: Position;
  direction: Direction;
  verticalDirection: "up" | "down" | null;
  velocity: number;
  idleTimer: number;
  isIdling: boolean;
  isRunning: boolean;
  targetPosition: Position | null;
}

export function createInitialMovement(): MovementState {
  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;

  return {
    position: {
      x: workArea.x + workArea.width / 2 - PET_SIZE / 2,
      y: workArea.y + workArea.height - TOTAL_HEIGHT,
    },
    direction: "right",
    verticalDirection: null,
    velocity: WALK_SPEED,
    idleTimer: 0,
    isIdling: false,
    isRunning: false,
    targetPosition: null,
  };
}

export function getDockPosition(
  anchor: DockAnchor,
  customX?: number | null,
  customY?: number | null,
): Position {
  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;

  switch (anchor) {
    case "BL":
      return {
        x: workArea.x + 20,
        y: workArea.y + workArea.height - TOTAL_HEIGHT,
      };
    case "BR":
      return {
        x: workArea.x + workArea.width - PET_SIZE - 20,
        y: workArea.y + workArea.height - TOTAL_HEIGHT,
      };
    case "TL":
      return { x: workArea.x + 20, y: workArea.y + 20 };
    case "TR":
      return {
        x: workArea.x + workArea.width - PET_SIZE - 20,
        y: workArea.y + 20,
      };
    case "CUSTOM":
      return { x: customX ?? workArea.x + 100, y: customY ?? workArea.y + 100 };
  }
}

function getRandomTarget(workArea: {
  x: number;
  y: number;
  width: number;
  height: number;
}): Position {
  const margin = 50;
  const x =
    workArea.x +
    margin +
    Math.random() * (workArea.width - PET_SIZE - margin * 2);
  // Lock pet to bottom edge of screen
  const y = workArea.y + workArea.height - TOTAL_HEIGHT - 5;
  return { x, y };
}

function pickNewDirection(
  movement: MovementState,
  workArea: { x: number; y: number; width: number; height: number },
): Partial<MovementState> {
  // Decide whether to run or walk
  const isRunning = Math.random() < RUN_CHANCE;
  const speed = isRunning ? RUN_SPEED : WALK_SPEED;

  // Pick a random target on screen
  const target = getRandomTarget(workArea);

  return {
    targetPosition: target,
    isRunning,
    velocity: speed,
    isIdling: false,
    idleTimer: 0,
  };
}

export function updateMovement(
  movement: MovementState,
  appState: AppState,
): MovementState {
  if (
    appState.uiPrefs.docked ||
    appState.uiPrefs.paused ||
    appState.petState.sleeping
  ) {
    return { ...movement, direction: "idle", isIdling: true, isRunning: false };
  }

  if (appState.petState.stage === "EGG") {
    return { ...movement, direction: "idle", isIdling: true, isRunning: false };
  }

  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;
  const minX = workArea.x + 20;
  const maxX = workArea.x + workArea.width - PET_SIZE - 20;
  const minY = workArea.y + workArea.height - TOTAL_HEIGHT - 10;
  const maxY = workArea.y + workArea.height - TOTAL_HEIGHT;

  let {
    position,
    direction,
    verticalDirection,
    velocity,
    idleTimer,
    isIdling,
    isRunning,
    targetPosition,
  } = movement;

  // Handle idling state
  if (isIdling) {
    idleTimer++;
    // Idle for random duration (50-150 ticks)
    if (idleTimer > 50 + Math.random() * 100) {
      // Start moving again
      const newState = pickNewDirection(movement, workArea);
      return {
        ...movement,
        ...newState,
        position,
      };
    }
    return {
      ...movement,
      direction: "idle",
      isIdling,
      idleTimer,
      isRunning: false,
    };
  }

  // If no target, pick one
  if (!targetPosition) {
    const newState = pickNewDirection(movement, workArea);
    return {
      ...movement,
      ...newState,
      position,
    };
  }

  // Calculate direction to target
  const dx = targetPosition.x - position.x;
  const dy = targetPosition.y - position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // If reached target, start idling
  if (distance < velocity * 2) {
    return {
      ...movement,
      isIdling: true,
      idleTimer: 0,
      targetPosition: null,
      direction: "idle",
      isRunning: false,
    };
  }

  // Determine horizontal direction for animation
  if (Math.abs(dx) > velocity) {
    direction = dx > 0 ? "right" : "left";
  }

  // Determine vertical direction
  if (Math.abs(dy) > velocity) {
    verticalDirection = dy > 0 ? "down" : "up";
  } else {
    verticalDirection = null;
  }

  // Move towards target
  let newX = position.x;
  let newY = position.y;

  // Move horizontally only - pet stays at bottom
  if (Math.abs(dx) >= velocity) {
    newX += (dx / distance) * velocity;
  }

  // Keep Y at bottom position
  newY = workArea.y + workArea.height - TOTAL_HEIGHT - 5;

  // Clamp to screen bounds
  newX = Math.max(minX, Math.min(newX, maxX));
  newY = Math.max(minY, Math.min(newY, maxY));

  // Randomly decide to idle or change direction
  if (Math.random() < IDLE_CHANCE) {
    return {
      ...movement,
      isIdling: true,
      idleTimer: 0,
      targetPosition: null,
      direction: "idle",
      isRunning: false,
    };
  }

  // Randomly pick a new target occasionally
  if (Math.random() < DIRECTION_CHANGE_CHANCE) {
    const newState = pickNewDirection(movement, workArea);
    return {
      ...movement,
      ...newState,
      position: { x: newX, y: newY },
      direction,
      verticalDirection,
    };
  }

  return {
    position: { x: newX, y: newY },
    direction,
    verticalDirection,
    velocity,
    idleTimer,
    isIdling,
    isRunning,
    targetPosition,
  };
}

export function clampPosition(pos: Position): Position {
  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;

  return {
    x: Math.max(
      workArea.x,
      Math.min(pos.x, workArea.x + workArea.width - PET_SIZE),
    ),
    y: workArea.y + workArea.height - TOTAL_HEIGHT - 5,
  };
}
