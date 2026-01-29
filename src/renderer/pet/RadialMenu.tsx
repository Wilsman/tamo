import { useEffect, useState } from "react";

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  disabled?: boolean;
}

interface RadialMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  petState: {
    sleeping: boolean;
    isSick: boolean;
    poopCount: number;
    hunger: number;
  } | null;
}

export function RadialMenu({
  isOpen,
  onClose,
  onAction,
  petState,
}: RadialMenuProps) {
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      setSelectedIndex(null);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems: MenuItem[] = [
    {
      id: "pet",
      icon: "🖐️",
      label: "Pet",
      color: "#ff6b9d",
    },
    {
      id: "feed",
      icon: "🍖",
      label: "Feed",
      color: "#ffa726",
      disabled: petState?.sleeping,
    },
    {
      id: "clean",
      icon: "🧹",
      label: "Clean",
      color: "#66bb6a",
      disabled: !petState?.poopCount || petState?.sleeping,
    },
    {
      id: "medicine",
      icon: "💊",
      label: "Medicine",
      color: "#ef5350",
      disabled: !petState?.isSick || petState?.sleeping,
    },
    {
      id: petState?.sleeping ? "wake" : "sleep",
      icon: petState?.sleeping ? "☀️" : "🌙",
      label: petState?.sleeping ? "Wake" : "Sleep",
      color: "#5c6bc0",
    },
    {
      id: "stats",
      icon: "📊",
      label: "Stats",
      color: "#42a5f5",
    },
  ];

  const radius = 52; // Distance from center to menu items (smaller to prevent clipping)
  const angleStep = (2 * Math.PI) / menuItems.length;
  const startAngle = -Math.PI / 2; // Start from top

  const handleItemClick = (id: string, index: number) => {
    if (menuItems[index].disabled) return;
    setSelectedIndex(index);
    setTimeout(() => {
      onAction(id);
      onClose();
    }, 150);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: radius * 2 + 60,
        height: radius * 2 + 60,
        zIndex: 2000,
        pointerEvents: "auto",
      }}
      onClick={(e) => {
        // Close when clicking outside menu items
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop blur */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: radius * 2 + 80,
          height: radius * 2 + 80,
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "50%",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Center - Pet portrait area */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${visible ? 1 : 0})`,
          width: 60,
          height: 60,
          background: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,1)",
          transition: "transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          zIndex: 10,
        }}
        title="Click to close"
      >
        🐕
      </div>

      {/* Menu items */}
      {menuItems.map((item, index) => {
        const angle = startAngle + index * angleStep;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isSelected = selectedIndex === index;

        return (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id, index)}
            onMouseEnter={() => !item.disabled && setSelectedIndex(index)}
            onMouseLeave={() => setSelectedIndex(null)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${
                visible ? (isSelected ? 1.15 : 1) : 0
              })`,
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: item.disabled
                ? "#e0e0e0"
                : `linear-gradient(135deg, ${item.color} 0%, ${adjustBrightness(
                    item.color,
                    -20,
                  )} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              cursor: item.disabled ? "not-allowed" : "pointer",
              boxShadow: item.disabled
                ? "0 2px 8px rgba(0,0,0,0.1)"
                : `0 4px 15px ${item.color}80, 0 2px 4px rgba(0,0,0,0.2)`,
              opacity: item.disabled ? 0.5 : 1,
              transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              transitionDelay: `${index * 50}ms`,
              zIndex: isSelected ? 100 : 1,
            }}
            title={item.label}
          >
            {/* Glow effect for selected item */}
            {isSelected && !item.disabled && (
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${item.color}40 0%, transparent 70%)`,
                  animation: "pulse 1s infinite",
                }}
              />
            )}
            <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}>
              {item.icon}
            </span>
          </div>
        );
      })}

      {/* Labels that appear on hover */}
      {selectedIndex !== null && !menuItems[selectedIndex].disabled && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            marginTop: 85,
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            animation: "fadeIn 0.2s ease",
            pointerEvents: "none",
          }}
        >
          {menuItems[selectedIndex].label}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
}

// Helper to darken colors
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
