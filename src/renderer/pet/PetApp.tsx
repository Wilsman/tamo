import { useState, useEffect, useCallback, useRef } from "react";
import { SpritePlayer } from "./SpritePlayer";
import { SpeechBubble } from "./SpeechBubble";
import { RadialMenu } from "./RadialMenu";
import { getBarkForState } from "./barks";
import { PetState, PositionUpdate, ActionType } from "../types";

export function PetApp() {
  const [petState, setPetState] = useState<PetState | null>(null);
  const [direction, setDirection] = useState<
    "left" | "right" | "up" | "down" | "idle"
  >("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [currentBark, setCurrentBark] = useState<string | null>(null);
  const [isShowingBark, setIsShowingBark] = useState(false);
  const barkQueueRef = useRef<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wasPausedRef = useRef(false);

  // Function to show a bark
  const showBark = useCallback(
    (message: string) => {
      if (isShowingBark) {
        // Queue the bark if one is already showing
        barkQueueRef.current.push(message);
        return;
      }
      setCurrentBark(message);
      setIsShowingBark(true);
    },
    [isShowingBark],
  );

  // Handle bark completion
  const handleBarkComplete = useCallback(() => {
    setIsShowingBark(false);
    setCurrentBark(null);

    // Show next bark from queue if any
    if (barkQueueRef.current.length > 0) {
      const nextBark = barkQueueRef.current.shift();
      if (nextBark) {
        setTimeout(() => showBark(nextBark), 200);
      }
    }
  }, [showBark]);

  // Listen for state updates and show context-aware barks
  useEffect(() => {
    window.electronAPI.onStateUpdate((data) => {
      const oldState = petState;
      setPetState(data.petState);

      // Show bark on significant state changes
      if (oldState) {
        // Hunger dropped to critical
        if (oldState.hunger > 1 && data.petState.hunger <= 1) {
          const hungerBarks = [
            "Feed me please? 🥺",
            "Tummy empty! Need noms!",
            "Food emergency! 🚨",
            "My bowl is staring at me...",
            "Snack attack! 🍖",
          ];
          showBark(hungerBarks[Math.floor(Math.random() * hungerBarks.length)]);
        }
        // Got sick
        else if (!oldState.isSick && data.petState.isSick) {
          const sickBarks = [
            "I don't feel so good... 🤒",
            "Tummy hurts... help?",
            "I'm a sick pup... 😢",
            "Medicine please? 🏥",
            "Not feeling paw-some...",
          ];
          showBark(sickBarks[Math.floor(Math.random() * sickBarks.length)]);
        }
        // Poop appeared
        else if (oldState.poopCount === 0 && data.petState.poopCount > 0) {
          const poopBarks = [
            "Um... I made a oopsie 💩",
            "Cleanup on aisle 5!",
            "Nature called! 🌿",
            "*shameful woof*",
            "It was an accident! 🙈",
          ];
          showBark(poopBarks[Math.floor(Math.random() * poopBarks.length)]);
        }
        // Attention needed
        else if (!oldState.attention && data.petState.attention) {
          const attentionBarks = [
            "Hello? Hello! 📢",
            "Notice me!",
            "I need attention!",
            "Emergency: Boredom! 🚨",
            "Pet me human! 🥺",
            "Look at me! I'm cute!",
          ];
          showBark(
            attentionBarks[Math.floor(Math.random() * attentionBarks.length)],
          );
        }
        // Evolved!
        else if (oldState.stage !== data.petState.stage) {
          const evolveBarks = [
            "I grew! Look at me! 🎉",
            "Evolution complete! 🦋",
            "I'm bigger now! 📏",
            "Level up! 🆙",
            "New me just dropped! ✨",
          ];
          showBark(evolveBarks[Math.floor(Math.random() * evolveBarks.length)]);
        }
      }
    });

    window.electronAPI.onPositionUpdate((data: PositionUpdate) => {
      setDirection(data.direction);
      // @ts-expect-error - isRunning might be in data
      setIsRunning(data.isRunning || false);
    });
  }, [petState, showBark]);

  const handleClick = () => {
    if (petState && !isMenuOpen) {
      // Store current pause state and pause the pet
      wasPausedRef.current = petState.sleeping;
      window.electronAPI.pause(true);
      setIsMenuOpen(true);
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    // Resume pet movement if it wasn't paused before
    if (!wasPausedRef.current) {
      window.electronAPI.pause(false);
    }
  };

  const handleMenuAction = (action: string) => {
    if (!petState) return;

    switch (action) {
      case "pet":
        // Pet the doggo
        const pettingResponses = [
          "*purrs happily* 🥰",
          "That feels so nice! 💕",
          "More pets please! 🖐️",
          "*tail wags furiously*",
          "You're the best! 🌟",
          "I love being petted! 💖",
          "*happy doggo noises*",
          "So cozy! ☺️",
          "Pet me more! 🐾",
          "*melts into a puddle of happy*",
        ];
        showBark(
          pettingResponses[Math.floor(Math.random() * pettingResponses.length)],
        );
        break;
      case "feed":
        window.electronAPI.sendAction("FEED_MEAL");
        showBark("Yum yum! 🍖");
        break;
      case "clean":
        if (petState.poopCount > 0) {
          window.electronAPI.sendAction("CLEAN");
          showBark("All clean! Thanks! ✨");
        }
        break;
      case "medicine":
        if (petState.isSick) {
          window.electronAPI.sendAction("MEDICINE");
          showBark("I feel better already! 💊");
        }
        break;
      case "sleep":
      case "wake":
        window.electronAPI.sendAction("LIGHTS_TOGGLE");
        showBark(action === "sleep" ? "Goodnight! 💤" : "Good morning! ☀️");
        break;
      case "stats":
        const stats = `❤️ ${petState.happiness}/4 🍖 ${petState.hunger}/4`;
        showBark(stats);
        break;
    }
  };

  // Random idle barking timer
  useEffect(() => {
    if (!petState || petState.sleeping) return;

    const scheduleNextBark = () => {
      // Random interval between 15-45 seconds
      const interval = 15000 + Math.random() * 30000;

      return setTimeout(() => {
        if (!isShowingBark) {
          const message = getBarkForState(petState);
          showBark(message);
        }
        scheduleNextBark();
      }, interval);
    };

    const timer = scheduleNextBark();
    return () => clearTimeout(timer);
  }, [petState, isShowingBark, showBark]);

  const getAnimationName = (): string => {
    if (!petState) return "idle";

    if (petState.stage === "EGG") return "idle";
    if (petState.sleeping) return "idle";
    if (petState.attention) return "bark";

    // Walking or running (includes all directions)
    if (
      direction === "left" ||
      direction === "right" ||
      direction === "up" ||
      direction === "down"
    ) {
      return isRunning ? "run" : "walk";
    }

    return "idle";
  };

  const getDirection = (): "east" | "west" | "south" | "north" => {
    if (direction === "left") return "west";
    if (direction === "right") return "east";
    if (direction === "up") return "north";
    if (direction === "down") return "south";
    return "south";
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        cursor: isMenuOpen ? "default" : "pointer",
        background: "transparent",
        position: "relative",
        paddingBottom: "10px",
      }}
    >
      {/* Radial Menu */}
      <RadialMenu
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        onAction={handleMenuAction}
        petState={petState}
      />

      {/* Speech Bubble */}
      {currentBark && (
        <SpeechBubble
          message={currentBark}
          onComplete={handleBarkComplete}
          duration={4000}
        />
      )}

      <SpritePlayer
        animation={getAnimationName()}
        direction={getDirection()}
        isEgg={petState?.stage === "EGG"}
      />
      {petState && petState.poopCount > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            fontSize: "20px",
            pointerEvents: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
          }}
        >
          {"💩".repeat(Math.min(petState.poopCount, 3))}
        </div>
      )}
      {petState?.attention && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 10,
            fontSize: "16px",
            animation: "pulse 1s infinite",
            pointerEvents: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
          }}
        >
          ❗
        </div>
      )}
      {petState?.isSick && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 10,
            fontSize: "16px",
            animation: "pulse 1s infinite",
            pointerEvents: "none",
          }}
        >
          🤒
        </div>
      )}
      {petState?.sleeping && (
        <div
          style={{
            position: "absolute",
            top: 5,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "14px",
            animation: "float 2s infinite",
            pointerEvents: "none",
          }}
        >
          💤
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
