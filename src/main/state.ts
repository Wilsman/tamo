import { PetState, UiPrefs, AppState, ActionType, PetStage } from './types';

const STAGE_DURATIONS: Record<PetStage, number> = {
  EGG: 5 * 60 * 1000,
  BABY: 60 * 60 * 1000,
  CHILD: 12 * 60 * 60 * 1000,
  TEEN: 24 * 60 * 60 * 1000,
  ADULT: Infinity,
};

const HUNGER_DECAY_INTERVAL = 20 * 60 * 1000;
const HAPPINESS_DECAY_INTERVAL = 30 * 60 * 1000;
const POOP_INTERVAL_MIN = 45 * 60 * 1000;
const POOP_INTERVAL_MAX = 90 * 60 * 1000;
const ATTENTION_MISTAKE_THRESHOLD = 15 * 60 * 1000;

export function createInitialPetState(): PetState {
  const now = Date.now();
  return {
    stage: 'EGG',
    variant: null,
    hunger: 4,
    happiness: 4,
    discipline: 2,
    isSick: false,
    poopCount: 0,
    sleeping: false,
    careMistakes: 0,
    attention: false,
    disciplineNeeded: false,
    stageStartedAt: now,
    lastHungerDecay: now,
    lastHappinessDecay: now,
    lastPoopTime: now,
    attentionStartedAt: null,
  };
}

export function createInitialUiPrefs(): UiPrefs {
  return {
    docked: false,
    dockAnchor: 'BR',
    dockX: null,
    dockY: null,
    roamEnabled: true,
    speed: 2,
    shellEnabled: false,
    skinId: 'classic-blue',
    paused: false,
  };
}

export function createInitialAppState(): AppState {
  const now = Date.now();
  return {
    petState: createInitialPetState(),
    uiPrefs: createInitialUiPrefs(),
    lastSavedAt: now,
    lastTickAt: now,
  };
}

function getNextStage(stage: PetStage): PetStage | null {
  const order: PetStage[] = ['EGG', 'BABY', 'CHILD', 'TEEN', 'ADULT'];
  const idx = order.indexOf(stage);
  if (idx < order.length - 1) return order[idx + 1];
  return null;
}

function computeAttention(state: PetState): boolean {
  return (
    state.hunger <= 1 ||
    state.happiness <= 1 ||
    state.poopCount > 0 ||
    state.isSick ||
    state.disciplineNeeded
  );
}

export function applyTick(state: AppState, now: number): AppState {
  if (state.uiPrefs.paused) return state;

  let pet = { ...state.petState };
  const elapsed = now - state.lastTickAt;

  if (pet.stage === 'EGG') {
    const stageElapsed = now - pet.stageStartedAt;
    if (stageElapsed >= STAGE_DURATIONS.EGG) {
      pet.stage = 'BABY';
      pet.stageStartedAt = now;
    }
    return { ...state, petState: pet, lastTickAt: now };
  }

  if (!pet.sleeping) {
    if (now - pet.lastHungerDecay >= HUNGER_DECAY_INTERVAL) {
      pet.hunger = Math.max(0, pet.hunger - 1);
      pet.lastHungerDecay = now;
    }

    if (now - pet.lastHappinessDecay >= HAPPINESS_DECAY_INTERVAL) {
      pet.happiness = Math.max(0, pet.happiness - 1);
      pet.lastHappinessDecay = now;
    }

    const poopInterval =
      POOP_INTERVAL_MIN + Math.random() * (POOP_INTERVAL_MAX - POOP_INTERVAL_MIN);
    if (now - pet.lastPoopTime >= poopInterval) {
      pet.poopCount = Math.min(4, pet.poopCount + 1);
      pet.lastPoopTime = now;
    }

    if (pet.hunger === 0 || pet.poopCount > 0) {
      if (Math.random() < 0.01) {
        pet.isSick = true;
      }
    }
  }

  pet.attention = computeAttention(pet);

  if (pet.attention) {
    if (pet.attentionStartedAt === null) {
      pet.attentionStartedAt = now;
    } else if (now - pet.attentionStartedAt >= ATTENTION_MISTAKE_THRESHOLD) {
      pet.careMistakes++;
      pet.attentionStartedAt = now;
    }
  } else {
    pet.attentionStartedAt = null;
  }

  const stageElapsed = now - pet.stageStartedAt;
  const stageDuration = STAGE_DURATIONS[pet.stage];
  if (stageElapsed >= stageDuration) {
    const nextStage = getNextStage(pet.stage);
    if (nextStage) {
      pet.stage = nextStage;
      pet.stageStartedAt = now;

      if (nextStage === 'ADULT') {
        if (pet.careMistakes <= 1) pet.variant = 'ADULT_GOOD';
        else if (pet.careMistakes <= 3) pet.variant = 'ADULT_OK';
        else pet.variant = 'ADULT_BAD';
      }
    }
  }

  return { ...state, petState: pet, lastTickAt: now };
}

export function applyAction(state: AppState, action: ActionType): AppState {
  let pet = { ...state.petState };

  if (pet.sleeping && action !== 'LIGHTS_TOGGLE') {
    return state;
  }

  switch (action) {
    case 'FEED_MEAL':
      pet.hunger = Math.min(4, pet.hunger + 1);
      break;
    case 'SNACK':
      pet.happiness = Math.min(4, pet.happiness + 1);
      if (Math.random() < 0.1) pet.isSick = true;
      break;
    case 'PLAY':
      pet.happiness = Math.min(4, pet.happiness + 1);
      break;
    case 'CLEAN':
      pet.poopCount = Math.max(0, pet.poopCount - 1);
      break;
    case 'MEDICINE':
      if (pet.isSick && Math.random() < 0.5) {
        pet.isSick = false;
      }
      break;
    case 'LIGHTS_TOGGLE':
      pet.sleeping = !pet.sleeping;
      break;
    case 'DISCIPLINE':
      if (pet.disciplineNeeded) {
        pet.discipline = Math.min(4, pet.discipline + 1);
        pet.disciplineNeeded = false;
      }
      break;
  }

  pet.attention = computeAttention(pet);
  if (!pet.attention) {
    pet.attentionStartedAt = null;
  }

  return { ...state, petState: pet };
}
