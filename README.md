# 🐾 Tamo - Desktop Tamagotchi Buddy

A cross-platform desktop pet that lives on your screen, built with Electron, TypeScript, and React.

![Tamo Screenshot](assets/icon.png)

## ✨ Features

- **Desktop Pet** - A cute companion that walks along the bottom of your screen
- **Tamagotchi-Style Gameplay** - Feed, play, clean, and care for your pet
- **Life Stages** - Watch your pet evolve from egg → baby → child → teen → adult
- **Hover Popover** - Quick access to pet stats and actions
- **Docking** - Pin your pet to screen corners
- **Device Skins** - Customize the look of your pet's shell
- **Persistent State** - Your pet's progress is saved between sessions

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- Windows or macOS

### Installation

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev
```

### Building

```bash
# Build for current platform
bun run build

# Build Windows executable
bun run build:win:exe

# Build macOS DMG
bun run build:mac
```

### Releasing (GitHub Actions)

```bash
# Create and push a version tag
git tag v0.0.1
git push origin v0.0.1
```

The GitHub Actions workflow builds Windows and macOS artifacts and uploads them to the GitHub Release.

## 🎮 How to Play

1. **Launch** the app - your pet starts as an egg
2. **Hover** over your pet to see stats and actions
3. **Feed** your pet when hunger is low
4. **Play** to keep happiness high
5. **Clean** up after your pet
6. **Give medicine** when sick
7. **Watch** your pet grow and evolve!

### Pet Stats

- **Hunger** (0-4 hearts) - Feed meals to increase
- **Happiness** (0-4 hearts) - Play to increase
- **Discipline** (0-4 hearts) - Discipline when needed
- **Health** - Watch for sickness and poop

### Life Stages

| Stage | Duration |
|-------|----------|
| Egg | 5 minutes |
| Baby | 60 minutes |
| Child | 12 hours |
| Teen | 24 hours |
| Adult | Forever! |

Your care affects which adult variant you get!

## 🛠️ Tech Stack

- **Electron** - Cross-platform desktop framework
- **TypeScript** - Type-safe JavaScript
- **React** - UI components
- **Vite** - Fast development and building
- **electron-store** - State persistence
- **electron-builder** - Application packaging

## 📁 Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # App entry point
│   ├── windows.ts  # Window management
│   ├── state.ts    # Pet state logic
│   ├── tick.ts     # Game timer
│   ├── movement.ts # Pet movement
│   ├── ipc.ts      # IPC handlers
│   └── store.ts    # Persistence
├── renderer/       # Renderer processes
│   ├── pet/        # Pet window UI
│   ├── popover/    # Hover popover UI
│   └── shell/      # Device shell UI
assets/             # Icons and images
sprites/            # Pet sprite animations
```

## 📝 License

MIT

## 🙏 Credits

Built with love and nostalgia for the classic Tamagotchi experience.
