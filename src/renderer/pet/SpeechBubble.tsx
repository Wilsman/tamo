import { useEffect, useState } from "react";

interface SpeechBubbleProps {
  message: string;
  onComplete?: () => void;
  duration?: number;
}

export function SpeechBubble({
  message,
  onComplete,
  duration = 4000,
}: SpeechBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [showPointer, setShowPointer] = useState(true);

  // Entrance animation
  useEffect(() => {
    const entranceTimer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(entranceTimer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!visible) return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= message.length) {
        setTypedMessage(message.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [message, visible]);

  // Auto-hide after duration
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(hideTimer);
  }, [duration, onComplete]);

  // Blink the pointer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowPointer((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        left: "50%",
        transform: `translateX(-50%) scale(${visible ? 1 : 0})`,
        transition: "transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      {/* Bubble */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff9e6 0%, #fff3c4 100%)",
          border: "3px solid #f4d03f",
          borderRadius: "20px",
          padding: "12px 16px",
          minWidth: "100px",
          maxWidth: "200px",
          boxShadow: `
            0 4px 15px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8)
          `,
          position: "relative",
          fontFamily:
            '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive, sans-serif',
          fontSize: "14px",
          fontWeight: "600",
          color: "#5d4e37",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {/* Shine effect */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "10px",
            right: "10px",
            height: "8px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />

        {/* Message with typing cursor */}
        <span>{typedMessage}</span>
        {typedMessage.length < message.length && (
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "14px",
              background: "#5d4e37",
              marginLeft: "2px",
              animation: "cursorBlink 0.5s infinite",
              verticalAlign: "middle",
            }}
          />
        )}

        {/* Corner decorations */}
        <div
          style={{
            position: "absolute",
            top: "4px",
            right: "8px",
            fontSize: "10px",
            opacity: 0.6,
          }}
        >
          ✨
        </div>
      </div>

      {/* Bubble pointer/tail */}
      <div
        style={{
          position: "absolute",
          bottom: -12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "15px solid #f4d03f",
          filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.1))",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "12px solid #fff9e6",
        }}
      />

      {/* Little paw prints decoration */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: -5,
          fontSize: "12px",
          opacity: showPointer ? 0.7 : 0.3,
          transition: "opacity 0.3s",
          transform: "rotate(-20deg)",
        }}
      >
        🐾
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
