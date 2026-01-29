import { useState, useEffect, useRef, useCallback } from "react";

interface SpritePlayerProps {
  animation: string;
  direction: "east" | "west" | "south" | "north";
  isEgg?: boolean;
  isRunning?: boolean;
}

interface AnimationData {
  [direction: string]: string[];
}

interface SpriteMetadata {
  character: {
    size: { width: number; height: number };
  };
  frames: {
    rotations: { [key: string]: string };
    animations: { [key: string]: AnimationData };
  };
}

const FPS = 8;

function getSpriteBasePath(): string {
  // In development (Vite dev server)
  if (
    window.location.protocol === "http:" ||
    window.location.protocol === "https:"
  ) {
    return "/bryan";
  }
  // In production (Electron packaged with asar)
  // HTML is at dist/renderer/src/renderer/pet/index.html
  // Sprites are at dist/renderer/bryan/
  return "../../../bryan";
}

export function SpritePlayer({
  animation,
  direction,
  isEgg,
  isRunning,
}: SpritePlayerProps) {
  const [metadata, setMetadata] = useState<SpriteMetadata | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);

  // Load metadata on mount
  useEffect(() => {
    let isMounted = true;
    const basePath = getSpriteBasePath();
    const metadataUrl = `${basePath}/metadata.json`;

    console.log("[SpritePlayer] Loading metadata from:", metadataUrl);

    fetch(metadataUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          console.log("[SpritePlayer] Metadata loaded:", data);
          setMetadata(data);
          setLoadError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("[SpritePlayer] Failed to load metadata:", err);
          setLoadError(err.message);
          setIsLoading(false);
          // Retry logic
          if (retryCountRef.current < 3) {
            retryCountRef.current++;
            console.log(
              `[SpritePlayer] Retrying... (${retryCountRef.current}/3)`,
            );
            setTimeout(() => setIsLoading(true), 1000);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update frames when animation or direction changes
  useEffect(() => {
    if (!metadata) return;

    const basePath = getSpriteBasePath();
    let animFrames: string[] = [];

    if (isEgg) {
      // For egg state, use a static rotation frame
      const staticFrame = metadata.frames.rotations["south"];
      if (staticFrame) {
        animFrames = [`${basePath}/${staticFrame}`];
      }
    } else {
      // Map animation name
      let animKey = animation;
      if (animation === "walk" || animation === "run") {
        animKey = "walk-4-frames";
      }

      // Try to get animation frames
      const animData = metadata.frames.animations[animKey];
      if (animData) {
        const dirFrames =
          animData[direction] ||
          animData["south"] ||
          animData["east"] ||
          Object.values(animData)[0];
        if (dirFrames && Array.isArray(dirFrames)) {
          animFrames = dirFrames.map((f) => `${basePath}/${f}`);
        }
      }

      // Fallback to idle animation
      if (animFrames.length === 0) {
        const idleData = metadata.frames.animations["idle"];
        if (idleData) {
          const idleFrames =
            idleData[direction] ||
            idleData["south"] ||
            idleData["east"] ||
            Object.values(idleData)[0];
          if (idleFrames && Array.isArray(idleFrames)) {
            animFrames = idleFrames.map((f) => `${basePath}/${f}`);
          }
        }
      }

      // Final fallback to static rotation
      if (animFrames.length === 0) {
        const staticFrame =
          metadata.frames.rotations[direction] ||
          metadata.frames.rotations["south"];
        if (staticFrame) {
          animFrames = [`${basePath}/${staticFrame}`];
        }
      }
    }

    console.log("[SpritePlayer] Animation frames:", animFrames);
    setFrames(animFrames);
    setCurrentFrame(0);
  }, [metadata, animation, direction, isEgg]);

  // Animation loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (frames.length <= 1) return;

    // Run at double speed when running
    const currentFps = isRunning ? FPS * 1.5 : FPS;

    intervalRef.current = window.setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 1000 / currentFps);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [frames, isRunning]);

  // Handle image load errors
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      console.error(
        "[SpritePlayer] Image failed to load:",
        e.currentTarget.src,
      );
      // Try to recover by using a fallback
      if (metadata && frames.length > 0) {
        const basePath = getSpriteBasePath();
        const staticFrame = metadata.frames.rotations["south"];
        if (staticFrame) {
          e.currentTarget.src = `${basePath}/${staticFrame}`;
        }
      }
    },
    [metadata, frames],
  );

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          width: 96,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          animation: "pulse 1s infinite",
        }}
      >
        🥚
      </div>
    );
  }

  // Error state
  if (loadError || !metadata || frames.length === 0) {
    return (
      <div
        style={{
          width: 96,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
          cursor: "pointer",
        }}
        title={loadError || "Loading..."}
      >
        🐕
      </div>
    );
  }

  const size = metadata.character.size;
  const scale = 2;
  const currentFramePath = frames[currentFrame];

  return (
    <img
      src={currentFramePath}
      alt="pet"
      onError={handleImageError}
      style={
        {
          width: size.width * scale,
          height: size.height * scale,
          imageRendering: "pixelated",
          userSelect: "none",
        } as React.CSSProperties
      }
      draggable={false}
    />
  );
}
