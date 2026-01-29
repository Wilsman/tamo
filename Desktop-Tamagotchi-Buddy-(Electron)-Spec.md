Below is a copy-paste spec you can hand to a coding agent. It is scoped to an MVP that feels like Tamagotchi, runs on Windows and macOS via Electron, and uses a hover popover for actions plus optional docking and device skins.

---

# Desktop Tamagotchi Buddy (Electron) Spec

## 0. Goals

Build a cross-platform desktop pet that:

* Lives on top of the desktop (transparent window), walks around, and idles.
* Shows a minimal hover popover with quick actions (feed, play, clean, etc.).
* Has a simple Tamagotchi-like lifecycle (egg -> hatch -> stages).
* Can be docked (stop moving) and skinned (device shell look and colors).
* Persists state between sessions.

Non-goals (MVP):

* No online accounts, cloud saves, marketplace, or complex mini-games.
* No heavy settings UI. Only tray/menu + optional “device shell.”

---

## 1. Tech Stack

* Electron latest stable
* TypeScript
* React in renderer(s)
* Vite (or electron-vite) for builds
* State persistence: `electron-store` (JSON) or SQLite (use electron-store for MVP)
* Animations: sprite sheets (PNG) + simple frame timing JSON
* Packaging: electron-builder

---

## 2. App Architecture

### Processes

**Main process**

* Creates/controls windows
* Handles timers (game ticks)
* Reads/writes persisted pet state
* Sends state updates to renderers via IPC

**Renderer 1: Pet Window**

* Transparent always-on-top window
* Displays animated pet
* Handles mouse hover enter/leave to show popover
* Click interactions: optional (MVP can be hover-only)

**Renderer 2: Popover Window**

* Small window near pet location
* Shows meters + contextual action icons
* Sends action commands to main via IPC

**Optional Renderer 3: Device Shell Window**

* A skinned frame that can be toggled on
* Contains optional button UI and skin selector (can be minimal)

---

## 3. Windows and Behavior Requirements

### Pet window

* Frameless, transparent, always-on-top.
* Not in taskbar/dock.
* Size: default 220x220 px (configurable).
* Position updated by main process for movement.
* Must stay within visible work area bounds.
* Must support multiple monitors (MVP: stay on primary monitor only, but code should not hardcode screen size).

### Popover window

* Frameless, small (example 240x80).
* Appears on hover.
* Closes when cursor leaves pet + popover for 300ms grace period.
* Position anchored near pet (above or to side). Clamp within work area.

### Docking

* Docked: pet stops moving and stays at user-chosen anchor:

  * bottom-left, bottom-right, top-left, top-right, or custom x,y.
* Undocked: pet resumes roaming.

### System tray/menu bar

Provide menu items:

* Dock / Undock
* Toggle Device Shell (optional)
* Choose Skin (list)
* Pause / Resume (pauses needs decay and movement)
* Reset Pet (confirmation)
* Quit

---

## 4. Pet Gameplay Model

### Pet stages

* `EGG`, `BABY`, `CHILD`, `TEEN`, `ADULT`
* Evolution based on time + care mistakes.

Suggested durations (tweakable constants):

* Egg: 5 minutes
* Baby: 60 minutes
* Child: 12 hours
* Teen: 24 hours
* Adult: indefinite (or evolve to variants at teen->adult)

### Stats (hearts 0..4)

* `hunger` 0..4 (0 = starving)
* `happiness` 0..4
* `discipline` 0..4 (optional in MVP, but include fields)
* `isSick` boolean
* `poopCount` integer 0..N
* `sleeping` boolean
* `careMistakes` integer
* `attention` boolean (derived: true if needs urgent)

### Need decay rules (simple constants)

Tick interval: every 60 seconds (main process timer)

* Every 20 min: hunger -1 (min 0)
* Every 30 min: happiness -1 (min 0)
* Every 45-90 min random: poopCount +1 (max 4)
* Random sickness chance increases when hunger==0 or poopCount>0 for extended time.

Attention call rule (derived):

* attention = (hunger <=1) OR (happiness <=1) OR (poopCount>0) OR (isSick) OR (disciplineNeeded)

Care mistake increments when attention remains true longer than X minutes (example 15 min) without improvement.

### Actions (from UI)

Each action triggers an animation and updates state:

* `FEED_MEAL`: hunger +1 (max 4). If sleeping, ignore or wake? MVP: ignore when sleeping.
* `SNACK`: happiness +1 (max 4). Optional downside: if spammed, chance of sickness.
* `PLAY`: happiness +1 (max 4). Simple: instant win, no mini-game in MVP.
* `CLEAN`: poopCount -> max(0, poopCount-1). If poopCount becomes 0, clear poop visuals.
* `MEDICINE`: if isSick then 50% chance cure (or require 2 uses).
* `LIGHTS_TOGGLE`: if sleeping then wake; else if bedtime then sleep. MVP: manual sleep toggle.
* `DISCIPLINE`: if disciplineNeeded then discipline +1 (max 4), clears disciplineNeeded.

### Discipline needed logic (optional)

* Random event: if attention true but user tries to feed/play and pet refuses, set disciplineNeeded.
* MVP simplified: once per few hours if happiness low, disciplineNeeded = true until disciplined.

### Evolution outcomes

At each evolution boundary, compute adult variant based on careMistakes:

* 0-1 mistakes: `ADULT_GOOD`
* 2-3: `ADULT_OK`
* 4+: `ADULT_BAD`
  Variant influences idle animation, speed, and need decay (small differences).

---

## 5. Animation System

### Sprite assets

Use sprite sheets per state, example:

* `idle`, `walk_left`, `walk_right`, `eat`, `happy`, `sad`, `sleep`, `poop`, `clean`, `medicine`, `evolve`, `attention`

Each animation defined by JSON:

* frameWidth, frameHeight
* frames: count
* fps
* loop: true/false
* anchor offset for positioning

Renderer should implement:

* `playAnimation(name, { interrupt: true/false, onComplete })`
* Fallback to idle if missing.

### Visual overlays

* Poop icon(s) near pet when poopCount > 0 (can be separate sprites)
* Attention indicator (small bubble/exclamation) when attention true

---

## 6. Movement System

Main process updates pet position every 30-60ms (simple loop) or every 100ms (good enough).

* Pet has velocity and direction.
* Roam path options:

  * Bottom-edge roaming only (recommended MVP)
  * Full screen roam (optional later)

MVP movement:

* Pet walks along bottom of screen between x bounds.
* Occasionally stops to idle.
* Turn around at edges.

Docked:

* No movement updates.

---

## 7. UI Specs

### Hover popover

Minimal, cute. No heavy panels.
Layout:

* Top row: hearts (hunger and happiness)
* Right side: tiny status badges: poop, sick, sleep, attention
* Bottom row: action icons (contextual)
  Actions shown rules:
* Always show Feed + Play
* Show Clean only if poopCount>0
* Show Medicine only if isSick
* Show Lights always (or only if sleeping/bedtime)
* Show Discipline only if disciplineNeeded

Icon-only with tooltips.

### Device shell skins (optional in MVP but implement selection)

Skins are simple theme packs:

* `shellEnabled` boolean
* `shellSkinId` string (e.g., classic-blue, pink, white)
* Shell window can just wrap the pet and popover area visually.

---

## 8. Persistence

Store as a single object:

* `petState` (stats, stage, variant, timestamps)
* `uiPrefs` (dock mode, dock position, roam enabled, speed, shell enabled, skin)
* `lastSavedAt`
* `lastTickAt` (for catch-up when app relaunches)

On app start:

* Load state
* Compute offline progression: apply ticks based on elapsed time capped to a max (example: 12 hours worth) to avoid extreme decay.

---

## 9. IPC Contract

Define IPC channels:

From renderer to main:

* `PET_HOVER_ENTER`
* `PET_HOVER_LEAVE`
* `POPOVER_HOVER_ENTER`
* `POPOVER_HOVER_LEAVE`
* `ACTION` payload: `{ type: 'FEED_MEAL' | 'PLAY' | ... }`
* `SET_DOCK` payload `{ docked: boolean, anchor?: 'BL'|'BR'|'TL'|'TR'|'CUSTOM', x?, y? }`
* `SET_SKIN` payload `{ skinId: string }`
* `TOGGLE_SHELL` payload `{ enabled: boolean }`
* `PAUSE` payload `{ paused: boolean }`
* `RESET_PET`

From main to renderer:

* `STATE_UPDATE` payload `{ petState, uiPrefs }`
* `PLAY_ANIMATION` payload `{ name: string }` (optional, or renderer derives from state)

---

## 10. Error/Edge Cases

* Clamp windows inside screen bounds on resolution change.
* Handle sleep/pause when system sleeps. On resume, compute offline progression.
* Ensure popover closes reliably (grace period).
* Ensure quit cleans intervals/timeouts.

---

## 11. Folder Structure (suggested)

* `src/main/`

  * `main.ts` (app boot)
  * `windows.ts` (create pet/popover/shell)
  * `state.ts` (pet state model + reducer)
  * `tick.ts` (timers + offline progression)
  * `movement.ts` (position updates)
  * `ipc.ts` (IPC handlers)
  * `store.ts` (electron-store wrapper)
* `src/renderer/pet/`

  * `PetApp.tsx`
  * `SpritePlayer.tsx`
  * `animations/` (json)
* `src/renderer/popover/`

  * `PopoverApp.tsx`
  * `ActionBar.tsx`
  * `Meters.tsx`
* `src/renderer/shell/` (optional)

  * `ShellApp.tsx`
* `assets/`

  * `sprites/`
  * `skins/`

---

## 12. Acceptance Criteria (MVP)

* Launch shows egg then hatch to baby.
* Pet walks along bottom of primary screen and idles.
* Hovering pet shows popover with hearts and actions.
* Feed increases hunger; play increases happiness.
* Poop appears over time; clean reduces poop.
* State persists across relaunch; offline progression applies reasonably.
* Dock/undock works from tray and popover.
* Skin selection changes device shell look (or at minimum changes pet frame theme).

---

## 13. Implementation Notes for Agent

* Prefer main process for authoritative state and ticking to avoid renderer suspends.
* Renderers are “dumb views” of state.
* Keep animations data-driven from JSON so adding new pets/skins is easy.
* Use a single reducer function `applyAction(state, action)` and `applyTick(state, now)`.

---

If you want, I can also provide a concrete `PetState` TypeScript interface, reducer skeleton, and IPC wiring skeleton that the coding agent can start from.
